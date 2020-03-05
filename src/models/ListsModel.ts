import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import ListModel from "./ListModel";
import {where} from "../database/BooleanOperations";

@Table((service, channel) => `${service}_${channel}_lists`)
export default class ListsModel extends Model {
    constructor(id: number, service: string, channel: string) {
        super(ListsModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    public async addItem(value: string) {
        return Model.make(ListModel, this.getService(), this.getChannel(), { value }, this.name);
    }

    public async getItem(id: number) {
        return ListModel.get(id, this.getService(), this.getChannel(), this.name);
    }

    public async getAllItems() {
        return ListModel.getAll(this.getService(), this.getChannel(), this.name);
    }

    public async getRandomItem() {
        let items = await this.getAllItems();
        return items[Math.floor(Math.random() * items.length)];
    }

    static async findByName(name: string, service: string, channel: string) {
        return Model.retrieve(ListsModel, service, channel, where().eq("name", name));
    }
}