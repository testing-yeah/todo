var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { COMPLETE_TODO } from "../graphQL/getQueryGql/getTodoGql.js";
export function completeTodo(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, completed, token }) {
        try {
            const response = yield fetch(`http://localhost:8000/graphql`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `${token}` : ''
                },
                body: JSON.stringify({
                    query: COMPLETE_TODO,
                    variables: {
                        id,
                        completed,
                    }
                })
            });
            const data = yield response.json();
            console.log(data);
        }
        catch (error) {
            console.log('Error to fetch request for complete todo', error);
        }
    });
}
