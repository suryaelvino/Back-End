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

// export interface Dbconfig {
//     servers: Array<{
//         host: string; // Alamat IP atau hostname server RethinkDB
//         port: number; // Port yang digunakan untuk koneksi ke server RethinkDB
//     }>;
//     password: string; // Kata sandi untuk koneksi ke RethinkDB
//     tls: boolean; // Apakah koneksi menggunakan TLS/SSL
//     ca: any; // Sertifikat CA untuk koneksi TLS (jika TLS diaktifkan)
//     defaultPageLimit: number; // Batas halaman default untuk kueri
// }


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
// export const dbconfig: Dbconfig = {
//     servers: [
//         { host: "localhost", port: 28015 },
//         { host: "localhost", port: 29015 }
//     ],
//     password: "G1ZZY!",
//     defaultPageLimit: 30,
//     tls: false,
//     ca: null
// };

