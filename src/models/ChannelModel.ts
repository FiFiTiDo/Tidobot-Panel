import Model, {RowData} from "./Model";
import {removeElements, uniqueArray} from "../utils/functions";

export default class ChannelModel extends Model {
    constructor(tableName: string, data: RowData) {
        super(tableName, data, "id", data.id);
    }

    getName(): string {
        return this.data.name as string;
    }

    setName(name: string): this {
        this.data.name = name;
        return this;
    }

    getDisabledModules(): string[] {
        return (this.data.disabled_modules as string).split(",");
    }

    addDisabledModule(module: string): this {
        return this.setDisabledModules(this.getDisabledModules().concat(module).filter(uniqueArray));
    }

    removeDisabledModule(module: string): this {
        return this.setDisabledModules(this.getDisabledModules().filter(removeElements(module)));
    }

    setDisabledModules(disabled_modules: string[]): this {
        this.data.disabled_modules = disabled_modules.join(",");
        return this;
    }

    static async get(id: string, service: string): Promise<ChannelModel|null> {
        return Model.retrieve(ChannelModel, service + "_channels", "id", id);
    }

    static async getAll(service: string): Promise<ChannelModel[]> {
        return Model.retrieveAll(ChannelModel, service + "_channels");
    }

    static async findByName(name: string, service: string): Promise<ChannelModel|null> {
        return Model.retrieve(ChannelModel, service + "_channels", "name", name);
    }
}