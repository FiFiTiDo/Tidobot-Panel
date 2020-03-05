import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_groupPermissions`)
export default class GroupPermissionsModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(GroupPermissionsModel, id, service, channel);
    }

    public permission: string;

    @Column({ datatype: DataTypes.INTEGER })
    public group_id: number;

    @Column({ datatype: DataTypes.BOOLEAN })
    public allowed: boolean;
}