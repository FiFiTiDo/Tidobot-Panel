import Model from "./Model";
import {Column, Id} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import {where} from "../database/BooleanOperations";
import {RawRowData} from "../database/RowData";

export default class GroupsModel extends Model {
    constructor(data: RawRowData, service?: string, channel?: string) {
        super(GroupsModel.getTableName(service, channel), "id", data.id, service, channel);
    }

    @Id
    public id: number;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    static async first(id: string, service?: string, channel?: string): Promise<GroupsModel|null> {
        return Model.retrieve(GroupsModel, service, channel, where().eq("id", id));
    }

    static async get(id: string, service?: string, channel?: string): Promise<GroupsModel[]> {
        return Model.retrieveAll(GroupsModel, service, channel, where().eq("id", id));
    }

    static async getAll(service?: string, channel?: string): Promise<GroupsModel[]> {
        return Model.retrieveAll(GroupsModel, service, channel);
    }

    static async findByName(name: string, service?: string, channel?: string): Promise<GroupsModel|null> {
        return Model.retrieve(GroupsModel, service, channel, where().eq("name", name));
    }

    static getTableName(service?: string, channel?: string): string {
        return service + "_" + channel + "_groups";
    }
}