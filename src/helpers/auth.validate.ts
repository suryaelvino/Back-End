
export function typeofUserRegister(email: any, phonenumber: any, name: any, password: any): boolean {
    return  typeof email        === 'string' &&
            typeof phonenumber  === 'string' &&
            typeof name         === 'string' &&
            typeof password     === 'string';
}