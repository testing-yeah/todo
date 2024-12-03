var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UPDATE_TODO } from "../graphQL/getQueryGql/getTodoGql.js";
export function editTodoFun(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, title, description, completed, token }) {
        console.log(id);
        const response = yield fetch(`http://localhost:8000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `${token}` : ''
            },
            body: JSON.stringify({
                query: UPDATE_TODO,
                variables: {
                    id,
                    title,
                    description,
                    completed
                }
            })
        });
        if (!response.ok) {
            throw new Error('error to update todo fetch err');
        }
        const result = yield response.json();
        if (result.errors) {
            throw new Error('Error in grapql');
        }
        return result.data;
    });
}
