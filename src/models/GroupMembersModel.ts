import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_groupMembers`)
export default class GroupMembersModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(GroupMembersModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.INTEGER })
    public user_id: number;

    @Column({ datatype: DataTypes.INTEGER })
    public group_id: number;
}