var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function loginUser(newUser) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield fetch(`http://localhost:8000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation loginUser($email: String!, $password: String!) {
                    loginUser(email: $email, password: $password) {
                      user {
                        id
                        username
                        email
                      }
                      token
                    }
                  }`,
                variables: {
                    email: newUser.email,
                    password: newUser.password,
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = yield response.json();
        if (result.errors) {
            throw new Error(((_a = result.errors[0]) === null || _a === void 0 ? void 0 : _a.message) || 'GraphQL errors occurred');
        }
        return result.data.loginUser;
    });
}
