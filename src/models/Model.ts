import Server from "../Server";

export type RowData = { [key: string]: string|number };
export type RetrievableModel<T extends Model> = new (tableName: string, data: RowData) => T;

export default abstract class Model {

    protected constructor(private tableName: string, protected data: RowData, private primaryKey: string, private id: any) {
    }

    getData(): RowData {
        return this.data;
    }

    async save(): Promise<void> {
        return new Promise((resolve, reject) => {
            let preparedKeys = Object.keys(this.data).map(key => "$" + key).join(", ");
            Server.getDatabase().run(`INSERT INTO ${this.tableName} VALUES ${preparedKeys} ON CONFLICT REPLACE`, this.data, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        });
    }

    async load(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Server.getDatabase().get(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`, this.id,(err, row) => {
                if (err)
                    reject(err);
                else {
                    if (row === null) {
                        resolve(false);
                    } else {
                        this.data = row;
                        resolve(true);
                    }
                }
            })
        });
    }

    static async retrieve<T extends Model>(model: RetrievableModel<T>, tableName: string, column: string, value: any): Promise<T> {
        return new Promise((resolve, reject) => {
            Server.getDatabase().get(`SELECT * FROM ${tableName} WHERE ${column} = ?`, value,(err, row) => {
                if (err)
                    reject(err);
                else {
                    if (row === null) {
                        resolve(null);
                    } else {
                        resolve(new model(tableName, row));
                    }
                }
            })
        });
    }

    static async retrieveAll<T extends Model>(model: RetrievableModel<T>, tableName: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            Server.getDatabase().all(`SELECT * FROM ${tableName}`,(err, rows) => {
                if (err)
                    reject(err);
                else {
                    resolve(rows.map(row => new model(tableName, row)));
                }
            })
        });
    }
}