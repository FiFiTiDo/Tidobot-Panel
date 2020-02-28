import Model from "./Model";
import {removeElements, uniqueArray, where} from "../utils/functions";
import {RawRowData} from "../database/RowData";
import {Column} from "../decorators/column";
import {DataTypes} from "../database/Schema";

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

    static async get(id: string, service: string): Promise<ChannelModel|null> {
        return Model.retrieve(ChannelModel, service + "_channels", where().eq("id", id));
    }

    static async getAll(service: string): Promise<ChannelModel[]> {
        return Model.retrieveAll(ChannelModel, service + "_channels");
    }

    static async findByName(name: string, service: string): Promise<ChannelModel|null> {
        return Model.retrieve(ChannelModel, service + "_channels", where().eq("name", name));
    }
}