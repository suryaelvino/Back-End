import { r } from 'rethinkdb-ts';
import { dbconfig } from './databaseConfig';
import { resolve } from 'path';

class Connection {
    conn: any;

    constructor() {
        this.conn = r.connectPool(dbconfig);
    }

    public async connect() {
        try {
            await this.conn; // Wait for the connection to establish
            console.info("Database connected");
            return "Database Connected";
        } catch (error) {
            throw error;
        }
    }

    public async insertData(table: string, data: object) {
        return new Promise((resolve, reject) => {
            r.table(table).insert(data).run(this.conn).then((result: any) => {
                return resolve(result);
            }).catch((er: any) => {
                return reject(er);
            })
        });
    }

    public async getData(table: string) {
        return new Promise((resolve, reject) => {
            r.table(table).run(this.conn).then((result: any) => {
                return resolve(result);
            }).catch((er: any) => {
                return reject(er.message);
            });
        });
    }

    public async getDataFiltered(table: string, filter: any, limit?: number) {
        return new Promise((resolve, reject) => {
            r.table(table).filter(filter).limit(limit ? limit : dbconfig.defaultPageLimit).run(this.conn).then((result: any) => {
                return resolve(result);
            }).catch((er: any) => {
                return reject(er);
            })
        });
    }

    public async updateData(table: string, filter: object, data: any) {
        return new Promise((resolve, reject) => {
            r.table(table).filter(filter).update(data).run(this.conn).then((result: any) => {
                return resolve(result);
            }).catch((er: any) => {
                return reject(er);
            })
        });
    }

    public async deleteData(table: string, filter: object) {
        return new Promise((resolve, reject) => {
            r.table(table).filter(filter).delete().run(this.conn).then((result: any) => {
                return resolve(result)
            }).catch((er: any) => {
                return reject(er)
            })
        });
    }

}

export { Connection };

