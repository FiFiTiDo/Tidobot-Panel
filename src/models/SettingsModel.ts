import Model from "./Model";
import {Column} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import {where} from "../database/BooleanOperations";

export default class SettingsModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(SettingsModel.getTableName(service, channel), id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public key: string;

    @Column({ datatype: DataTypes.STRING })
    public value: string;

    @Column({ datatype: DataTypes.ENUM, enum: ["string", "integer", "float", "boolean"] })
    public type: string;

    @Column({ name: "default_value", datatype: DataTypes.STRING, null: true })
    public defaultValue: string;

    static async findByKey(key: string, service: string, channel: string) {
        return Model.retrieve(SettingsModel, service, channel, where().eq("key", key));
    }

    static getTableName(service: string, channel: string) {
        return `${service}_${channel}_settings`;
    }
}