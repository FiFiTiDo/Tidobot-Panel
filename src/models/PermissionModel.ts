import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_permissions`)
export default class PermissionModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(PermissionModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public permission: string;

    @Column({ datatype: DataTypes.STRING })
    public level: string;
}