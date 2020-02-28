import Model from "./Model";
import {removeElements, uniqueArray, where} from "../utils/functions";
import {RawRowData} from "../database/RowData";
import {Column, OneToMany} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import {Where} from "../database/BooleanOperations";
import UserModel from "./UserModel";
import ChatterModel from "./ChatterModel";

export default class ChannelModel extends Model {
    constructor(tableName: string, data: RawRowData) {
        super(tableName, "id", data.id);
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

    static async first(id: string, service: string): Promise<ChannelModel|null> {
        return this.findFirstBy(service, where().eq("id", id));
    }

    static async get(id: string, service: string): Promise<ChannelModel[]> {
        return this.findBy(service, where().eq("id", id));
    }

    static async getAll(service: string): Promise<ChannelModel[]> {
        return this.findBy(service);
    }

    static async findFirstBy(service: string, where?: Where): Promise<ChannelModel|null> {
        return Model.retrieve(ChannelModel, service + "_channels", where);
    }

    static async findBy(service: string, where?: Where): Promise<ChannelModel[]> {
        return Model.retrieveAll(ChannelModel, service + "_channels", where);
    }

    static async findByName(name: string, service: string): Promise<ChannelModel|null> {
        return this.findFirstBy(service, where().eq("name", name));
    }
}