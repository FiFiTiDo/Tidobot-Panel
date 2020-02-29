import Model from "./Model";
import {RawRowData} from "../database/RowData";
import {Column} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import {where} from "../database/BooleanOperations";

export default class UserModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(UserModel.getTableName(service, channel), id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public user_id: string;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.BOOLEAN })
    public ignore: boolean;

    static async findByName(name: string, service?: string, channel?: string): Promise<UserModel|null> {
        return Model.retrieve(UserModel, service, channel, where().eq("name", name));
    }

    static getTableName(service?: string, channel?: string) {
        return service + "_users";
    }
}