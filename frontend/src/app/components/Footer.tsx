import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Section 1: About */}
                    <div>
                        <h2 className="text-lg font-bold">About</h2>
                        <p className="mt-4 text-sm text-gray-400">
                            This is a Todo App to help you manage your tasks efficiently.
                            Built with Next.js and Tailwind CSS.
                        </p>
                    </div>

                    {/* Section 2: Links */}
                    <div>
                        <h2 className="text-lg font-bold">Quick Links</h2>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-400 hover:text-white text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/list"
                                    className="text-gray-400 hover:text-white text-sm"
                                >
                                    My Tasks
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/completed"
                                    className="text-gray-400 hover:text-white text-sm"
                                >
                                    Completed
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section 3: Contact */}
                    <div>
                        <h2 className="text-lg font-bold">Contact</h2>
                        <ul className="mt-4 space-y-2 text-sm text-gray-400">
                            <li>Email: support@todoapp.com</li>
                            <li>Phone: +123 456 7890</li>
                            <li>Address: 123 Task St, Productivity City</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-4 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Todo App. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
