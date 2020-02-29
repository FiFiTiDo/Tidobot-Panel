import Model from "./Model";
import {removeElements, uniqueArray} from "../utils/functions";
import {RawRowData} from "../database/RowData";
import {Column, OneToMany} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import ChatterModel from "./ChatterModel";
import {where} from "../database/BooleanOperations";

export default class ChannelModel extends Model {
    constructor(tableName: string, data: RawRowData, service?: string, channel?: string) {
        super(tableName, "id", data.id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public id: string;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.ARRAY })
    public disabled_modules: string[];

    addDisabledModule(module: string) {
        this.disabled_modules = this.disabled_modules.concat(module).filter(uniqueArray);
    }

    removeDisabledModule(module: string) {
        this.disabled_modules = this.disabled_modules.filter(removeElements(module));
    }

    @OneToMany(ChatterModel, "id", "channel_id")
    async chatters(): Promise<ChatterModel[]> { return []; }

    static async first(id: string, service?: string, channel?: string): Promise<ChannelModel|null> {
        return Model.retrieve(ChannelModel, service, channel, where().eq("id", id));
    }

    static async get(id: string, service?: string, channel?: string): Promise<ChannelModel[]> {
        return Model.retrieveAll(ChannelModel, service, channel, where().eq("id", id));
    }

    static async getAll(service?: string, channel?: string): Promise<ChannelModel[]> {
        return Model.retrieveAll(ChannelModel, service, channel);
    }

    static async findByName(name: string, service?: string, channel?: string): Promise<ChannelModel|null> {
        return Model.retrieve(ChannelModel, service, channel, where().eq("name", name));
    }

    static getTableName(service?: string, channel?: string): string {
        return service + "_channels";
    }
}