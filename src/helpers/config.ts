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
