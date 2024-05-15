import { r } from 'rethinkdb-ts';
import { dbconfig } from './databaseConfig';
import { resolve } from 'path';

interface JoinedData {
    [key: string]: any;
}

class Connection {
    conn: any;

    constructor() {
        this.conn = r.connectPool(dbconfig);
    }

    public async connect() {
        try {
            await this.conn;
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

    public async getAllData(table: string) {
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

    public async getFilteredOrderedData(table: string, filter: any, order:any, limit?:number){
        return new Promise((resolve, reject) => {
            r.table(table).filter(filter).orderBy(order).limit(limit ? limit : dbconfig.defaultPageLimit).run(this.conn).then((result: any) => {
                return resolve(result);
            }).catch((er: any) => {
                return reject(er);
            })
        });
    }

    public async getAllDataPagination(table: string, order: any, skip:any, limit?: number) {
        return new Promise((resolve, reject) => {
            r.table(table).orderBy(order).skip(skip).limit(limit ? limit : dbconfig.defaultPageLimit).run(this.conn).then((result: any) => {
                return resolve(result);
            }).catch((er: any) => {
                return reject(er);
            })
        });
    }

    public async getListOrderedData(table: string, filter: any, order: any) {
        return new Promise((resolve, reject) => {
            r.table(table).filter(filter).orderBy(order).run(this.conn).then((result: any) => {
                return resolve(result);
            }).catch((er: any) => {
                return reject(er);
            })
        });
    }

    public async getJoinedData(table1: string, table2: string, column: string, where: any) {
        return new Promise((resolve, reject) => {
            r.table(table1).eqJoin(column, r.table(table2), { index: column })
                .map((row: any) => {
                    return {
                        [column]: row("left")(column),
                        left: row("left"),
                        right: row("right")
                    };
                })
                .filter(where)
                .run(this.conn)
                .then((result: any[]) => {
                    this.conn.close();
                    resolve(result);
                }).catch((error: any) => {
                    this.conn.close();
                    reject(error);
                });
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

