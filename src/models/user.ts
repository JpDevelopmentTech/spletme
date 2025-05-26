export interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
}

export interface UserResponse {
    user: User;
    token: string;
}

export interface RegisterSchema {
    username: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}