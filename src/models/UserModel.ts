import Model from "./Model";
import {RawRowData} from "../database/RowData";
import {Column} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import {where} from "../utils/functions";
import {Where} from "../database/BooleanOperations";

export default class UserModel extends Model {
    constructor(tableName: string, data: RawRowData) {
        super(tableName, "id", data.id);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public id: string;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.BOOLEAN })
    public ignored: boolean;

    static async first(id: string, service: string): Promise<UserModel|null> {
        return this.findFirstBy(service, where().eq("id", id));
    }

    static async get(id: string, service: string): Promise<UserModel[]> {
        return this.findBy(service, where().eq("id", id));
    }

    static async getAll(service: string): Promise<UserModel[]> {
        return this.findBy(service);
    }

    static async findFirstBy(service: string, where?: Where): Promise<UserModel|null> {
        return Model.retrieve(UserModel, service + "_users", where);
    }

    static async findBy(service: string, where?: Where): Promise<UserModel[]> {
        return Model.retrieveAll(UserModel, service + "_users", where);
    }

    static async findByName(name: string, service: string): Promise<UserModel|null> {
        return this.findFirstBy(service, where().eq("name", name));
    }
}