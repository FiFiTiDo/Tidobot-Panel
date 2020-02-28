import {Column} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import Model from "./Model";
import {where} from "../utils/functions";
import {RawRowData} from "../database/RowData";

export default class ChatterModel extends Model {
    constructor(tableName: string, data: RawRowData, service?: string, channel?: string) {
        super(tableName, "id", data.id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public id: string;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.INTEGER })
    public balance: number;

    @Column({ datatype: DataTypes.BOOLEAN })
    public banned: boolean;

    @Column({ datatype: DataTypes.BOOLEAN })
    public regular: boolean;

    static async first(id: string, service?: string, channel?: string): Promise<ChatterModel|null> {
        return Model.retrieve(ChatterModel, service, channel, where().eq("id", id));
    }

    static async get(id: string, service?: string, channel?: string): Promise<ChatterModel[]> {
        return Model.retrieveAll(ChatterModel, service, channel, where().eq("id", id));
    }

    static async getAll(service?: string, channel?: string): Promise<ChatterModel[]> {
        return Model.retrieveAll(ChatterModel, service, channel);
    }

    static async findByName(name: string, service?: string, channel?: string): Promise<ChatterModel|null> {
        return Model.retrieve(ChatterModel, service, channel, where().eq("name", name));
    }

    static getTableName(service?: string, channel?: string) {
        return service + "_" + channel + "_users";
    }
}