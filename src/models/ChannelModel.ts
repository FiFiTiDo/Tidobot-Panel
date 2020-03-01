import Model from "./Model";
import {removeElements, uniqueArray} from "../utils/functions";
import {RawRowData} from "../database/RowData";
import {Column, ImportModel, OneToMany} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import ChatterModel from "./ChatterModel";
import {where} from "../database/BooleanOperations";
import CommandModel from "./CommandModel";
import SettingsModel from "./SettingsModel";
import GroupsModel from "./GroupsModel";
import PermissionModel from "./PermissionModel";

export default class ChannelModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(ChannelModel.getTableName(service, channel), id, service, channel);
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

    static async findByName(name: string, service?: string, channel?: string): Promise<ChannelModel|null> {
        return Model.retrieve(ChannelModel, service, channel, where().eq("name", name));
    }

    static getTableName(service?: string, channel?: string): string {
        return service + "_channels";
    }
}