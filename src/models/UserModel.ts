import Model from "./Model";
import {RawRowData} from "../database/RowData";
import {Column} from "../decorators/column";
import {DataTypes} from "../database/Schema";
import {where} from "../utils/functions";

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

    static async get(id: string, service: string): Promise<UserModel|null> {
        return Model.retrieve(UserModel, service + "_users", where().eq("id", id));
    }

    static async getAll(service: string): Promise<UserModel[]> {
        return Model.retrieveAll(UserModel, service + "_users");
    }

    static async findByName(name: string, service: string): Promise<UserModel|null> {
        return Model.retrieve(UserModel, service + "_users", where().eq("name", name));
    }
}