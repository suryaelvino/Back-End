export function typeofUserRegister(email: any, phonenumber: any, name: any, password: any): boolean {
    return typeof email === 'string' &&
        typeof phonenumber === 'string' &&
        typeof name === 'string' &&
        typeof password === 'string';
}

export interface UserData {
    name        : string;
    email       : string;
    password    : string;
    phonenumber : string;
    created_at  : number;
    update_at   : number;
    status      : string;
}