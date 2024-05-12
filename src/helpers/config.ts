export interface Config {
    port: number;
    hostname: string;
    loggingLevel: string;
};

export interface Dbconfig {
    port: number;
    password: string;
    host: string;
    tls: boolean;
    ca: any;
    defaultPageLimit: number;
}

export interface UserData{
    name                : string;
    email               : string;
    password            : string;
    phonenumber         : string;
    created_at          : number;
    update_at           : number;
    status              : string;
}

export const config: Config = {
    port: 3000,
    hostname: "localhost",
    loggingLevel: 'info',
};

export const dbconfig: Dbconfig = {
    port: 28015,
    host: "localhost",
    password: "G1ZZY!",
    defaultPageLimit: 30,
    tls: false,
    ca: null
};

