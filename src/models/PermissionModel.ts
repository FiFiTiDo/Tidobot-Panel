import Model from "./Model";
import {Column} from "../decorators/database";
import {DataTypes} from "../database/Schema";

export default class PermissionModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(PermissionModel.getTableName(service, channel), id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public permission: string;

    @Column({ datatype: DataTypes.STRING })
    public level: string;

    static getTableName(service: string, channel: string) {
        return `${service}_${channel}_permissions`;
    }
}