var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SIGN_UP_MUTATION } from "../graphQL/getUserGql/getUser.js";
export function signUpUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username, email, password }) {
        try {
            const response = fetch('http://localhost:8000/graphql', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: SIGN_UP_MUTATION,
                    variables: {
                        username,
                        email,
                        password
                    }
                })
            });
            const data = (yield response).json();
            console.log(data);
        }
        catch (err) {
            console.log('Error creating user SignUp', err);
        }
    });
}
