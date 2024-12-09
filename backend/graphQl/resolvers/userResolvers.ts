import bcrypt from "bcrypt";
import prisma from "../../prisma/index";
import jwt from "jsonwebtoken";


interface GetUserArgs {
    id: string;
    name: string;
    email: string;
    password: string;
}

type SignOutResponse = {
    message: string;
};


export const userResolvers = {

    Query: {
        getUser: async (_: unknown, { id }: GetUserArgs) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: id,
                    },
                    include: {
                        todos: {
                            include: {
                                author: true
                            }
                        }
                    }
                });
                return user;

            } catch (error) {
                console.error(error);
            }
        },
    },

    Mutation: {
        signUp: async (_: unknown, { name, email, password }: GetUserArgs) => {
            try {
                if (!name || !email || !password) {
                    throw new Error('Please provide all required fields (name, email, password)');
                }

                // Check if user already exists
                const existingUser = await prisma.user.findUnique({
                    where: { 
                        email: email 
                    },
                });
                if (existingUser) {
                    throw new Error('User already exists');  
                }

                // Hash the password before storing it
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create the user in the database
                const user = await prisma.user.create({
                    data: {
                        username: name,
                        email: email,
                        password: hashedPassword,
                    },
                });
 
                return user;

            } catch (error) {
                console.error('Error during registration:', error);
                throw new Error('An error occurred during registration');
            }
        },

        signIn: async (_: unknown, { email, password }: GetUserArgs) => {
            try {
                const user = await prisma.user.findUnique
                    ({
                        where: {
                            email
                        }
                    });

                if (!user) {
                    throw new Error('User not found');
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY || 'defaultSecret', {
                    expiresIn: '1d',
                });

                return {
                    token,
                    user,
                };
            } catch (error) {
                console.error(error);
                throw new Error('Failed to sign in');
            }
        },

        signOut: async (): Promise<SignOutResponse>  => {
            try {
                // No user-specific actions are needed here.
                return {
                    message: 'Sign out successful',
                };
            } catch (error) {
                console.error(error);
                throw new Error('Failed to sign out');
            }
        }
    }
}