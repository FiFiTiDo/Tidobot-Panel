import Server from "../Server";
import {RawRowData} from "../database/RowData";
import {TableSchema} from "../database/Schema";
import {where, Where} from "../database/BooleanOperations";

export interface RetrievableModel<T extends Model> {
    new (row: RawRowData, service: string, channel: string): T;
    getTableName(service?: string, channel?: string): string;
}

export default abstract class Model {
    protected schema: TableSchema = null;

    protected constructor(private tableName: string, private primaryKey: string, private entryId: any, private service: string, private channel: string) {
    }

    getSchema(): TableSchema {
        if (this.schema === null) this.schema = new TableSchema(this);

        return this.schema;
    }

    getService(): string {
        return this.service;
    }

    getChannel(): string {
        return this.channel;
    }

    async exists(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Server.getDatabase().get(`SELECT COUNT(*) as "count" FROM ${this.tableName} WHERE ${this.primaryKey} = ?`, this.entryId,(err, row) => {
                if (err)
                    reject(err);
                else {
                    if (row === null) {
                        resolve(false);
                    } else {
                        resolve(row.count);
                    }
                }
            })
        });
    }

    async save(): Promise<void> {
        return new Promise((resolve, reject) => {
            let data = {};
            for (let [key, value] of Object.entries(this.getSchema().exportRow())) {
                data["$" + key] = value;
            }

            let preparedKeys = Object.keys(data).join(", ");
            Server.getDatabase().run(`INSERT INTO ${this.tableName} VALUES ${preparedKeys} ON CONFLICT REPLACE`, data, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        });
    }

    async delete(): Promise<void> {
        return new Promise((resolve, reject) => {
            Server.getDatabase().run(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`, this.entryId,(err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    async load(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Server.getDatabase().get(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`, this.entryId,(err, row) => {
                if (err)
                    reject(err);
                else {
                    if (row === null) {
                        resolve(false);
                    } else {
                        this.getSchema().importRow(row);
                        resolve(true);
                    }
                }
            })
        });
    }

    static async retrieve<T extends Model>(model_const: RetrievableModel<T>, service: string, channel: string, where: Where): Promise<T> {
        return this.retrieveAll<T>(model_const, service, channel, where).then(models => models.length < 1 ? null : models[0]);
    }

    static async retrieveAll<T extends Model>(model_const: RetrievableModel<T>, service: string, channel: string, where_clause?: Where): Promise<T[]> {
        let tableName = model_const.getTableName(service, channel);
        if (!where_clause) where_clause = where();
        return new Promise((resolve, reject) => {
            Server.getDatabase().all(`SELECT * FROM ${tableName}` + where_clause.toString(), where_clause.getPreparedValues(),(err, rows) => {
                if (err)
                    reject(err);
                else {
                    resolve(rows.map(row => {
                        let model = new model_const(row, service, channel);
                        model.getSchema().importRow(row);
                        return model;
                    }));
                }
            })
        });
    }
}