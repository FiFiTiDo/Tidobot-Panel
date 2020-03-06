import Model from "./Model";
import {Column, ManyToMany, OneToMany, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import ChatterModel from "./ChatterModel";
import GroupMembersModel from "./GroupMembersModel";
import GroupPermissionsModel from "./GroupPermissionsModel";

@Table((service, channel) => `${service}_${channel}_groups`)
export default class GroupsModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(GroupsModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public name: string;

    @ManyToMany(ChatterModel, GroupMembersModel, ["id", "group_id"], ["user_id", "user_id"])
    async members(): Promise<ChatterModel[]> { return []; }

    @OneToMany(GroupPermissionsModel, "id", "group_id")
    async permissions(): Promise<GroupPermissionsModel[]> { return []; }
}