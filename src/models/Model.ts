import Server from "../Server";
import {prepareData, RawRowData} from "../database/RowData";
import {DataTypes, TableSchema} from "../database/Schema";
import {where, Where} from "../database/BooleanOperations";
import moment from "moment";
import {getTableName} from "../decorators/database";

export interface ModelConstructor<T extends Model> {
    new (id: number, service: string, channel: string, optional_param?: string): T;
}

export default abstract class Model {
    private readonly tableName: string;
    protected schema: TableSchema = null;

    protected constructor(private model_const: ModelConstructor<any>, public id: number, private service: string, private channel: string, private optional_param?: string) {
        this.tableName = getTableName(model_const, service, channel, optional_param);
        if (this.tableName === null) throw new Error("Model must use the @Table decorator to add the table name formatter.");
        this.schema = new TableSchema(this);
        this.schema.addColumn("id", { datatype: DataTypes.INTEGER, primary: true, increment: true });
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
            Server.getDatabase().get(`SELECT COUNT(*) as "count" FROM ${this.tableName} WHERE id = ?`, this.id,(err, row) => {
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
            let { keys, columns, prepared } = prepareData(this.getSchema().exportRow());
            Server.getDatabase().run(`INSERT OR REPLACE INTO ${this.tableName}(${columns.join(", ")}) VALUES (${keys.join(", ")})`, prepared, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        });
    }

    async delete(): Promise<void> {
        return new Promise((resolve, reject) => {
            Server.getDatabase().run(`DELETE FROM ${this.tableName} WHERE id = ?`, this.id,(err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    async load(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Server.getDatabase().get(`SELECT * FROM ${this.tableName} WHERE id = ?`, this.id,(err, row) => {
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

    async update(obj: { [key: string]: any }): Promise<boolean> {
        let updated = false;
        for (let [key, value] of Object.entries(obj)) {
            if (this.hasOwnProperty(key)) {
                this[key] = value;
                updated = true;
            }
        }

        if (updated) {
            if (this.hasOwnProperty("updated_at")) {
                this["updated_at"] = moment();
            }

            await this.save();
            return true;
        }

        return false;
    }

    static async get<T extends Model>(id: number, service?: string, channel?: string, optional_param?: string): Promise<T|null> {
        return Model.retrieve(this as unknown as ModelConstructor<T>, service, channel, where().eq("id", id), optional_param);
    }

    static async getAll<T extends Model>(service?: string, channel?: string, optional_param?: string): Promise<T[]> {
        return Model.retrieveAll(this as unknown as ModelConstructor<T>, service, channel, undefined, optional_param);
    }

    static async retrieve<T extends Model>(model_const: ModelConstructor<T>, service: string, channel: string, where: Where, optional_param?: string): Promise<T|null> {
        return this.retrieveAll<T>(model_const, service, channel, where, optional_param).then(models => models.length < 1 ? null : models[0]);
    }

    static async retrieveAll<T extends Model>(model_const: ModelConstructor<T>, service: string, channel: string, where_clause?: Where, optional_param?: string): Promise<T[]> {
        let tableName = getTableName(model_const, service, channel, optional_param);
        if (!where_clause) where_clause = where();
        return new Promise((resolve, reject) => {
            Server.getDatabase().all(`SELECT * FROM ${tableName}` + where_clause.toString(), where_clause.getPreparedValues(),(err, rows) => {
                if (err)
                    reject(err);
                else {
                    resolve(rows.map(row => {
                        let model = new model_const(row.id, service, channel);
                        model.getSchema().importRow(row);
                        return model;
                    }));
                }
            })
        });
    }

    static async make<T extends Model>(model_const: ModelConstructor<T>, service: string, channel: string, data: RawRowData, optional_param?: string): Promise<T|null> {
        let tableName = getTableName(model_const, service, channel, optional_param);
        let { columns, keys, prepared } = prepareData(data);
        return new Promise((resolve, reject) => {
            Server.getDatabase().run(`INSERT OR ABORT INTO ${tableName} (${columns.join(", ")}) VALUES (${keys.join(", ")})`, prepared, function (err) {
                if (err) {
                    if ((err as any).errno === 19 && err.message.indexOf("UNIQUE") >= 0) {
                        resolve(null);
                        return;
                    }

                    reject(err);
                } else {
                    let model = new model_const(this.lastID, service, channel);
                    model.load().then(() => resolve(model)).catch(reject);
                }
            })
        });
    }
}