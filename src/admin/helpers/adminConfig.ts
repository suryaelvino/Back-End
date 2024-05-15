export function typeofAdminRegister(email: string, phonenumber: string, name: string, password: string, role: string): boolean {
    return typeof email === 'string' &&
        typeof phonenumber === 'string' &&
        typeof name === 'string' &&
        typeof password === 'string' &&
        typeof role === 'string';
}

export interface AdminData {
    name            : string;
    email           : string;
    password        : string;
    phonenumber     : string;
    role            : string;
    created_at      : number;
    update_at       : number;
    status          : string;
}