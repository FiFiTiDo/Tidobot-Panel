import Model from "./Model";
import {Column, ImportModel, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import ChatterModel from "./ChatterModel";
import CommandModel from "./CommandModel";
import SettingsModel from "./SettingsModel";
import GroupsModel from "./GroupsModel";
import PermissionModel from "./PermissionModel";

@Table(service => `${service}_channels`)
export default class ChannelModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(ChannelModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public channel_id: string;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.ARRAY })
    public disabled_modules: string[];

    @ImportModel(ChatterModel)
    async chatters(): Promise<ChatterModel[]> { return []; }

    @ImportModel(CommandModel)
    async commands(): Promise<CommandModel[]> { return []; }

    @ImportModel(SettingsModel)
    async settings(): Promise<SettingsModel[]> { return []; }

    @ImportModel(GroupsModel)
    async groups(): Promise<GroupsModel[]> { return []; }

    @ImportModel(PermissionModel)
    async permissions(): Promise<PermissionModel[]> { return []; }
}