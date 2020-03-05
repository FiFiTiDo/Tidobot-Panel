import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_userPermissions`)
export default class UserPermissionsModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(UserPermissionsModel, id, service, channel);
    }

    public permission: string;

    @Column({ datatype: DataTypes.INTEGER })
    public user_id: number;

    @Column({ datatype: DataTypes.BOOLEAN })
    public allowed: boolean;
}