import UserModel from "./UserModel";
import {Column} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import Model from "./Model";
import {where} from "../utils/functions";
import {Where} from "../database/BooleanOperations";
import {RawRowData} from "../database/RowData";

export default class ChatterModel extends Model {
    constructor(tableName: string, data: RawRowData) {
        super(tableName, "id", data.id);
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

    static async first(id: string, service: string): Promise<ChatterModel|null> {
        return this.findFirstBy(service, where().eq("id", id));
    }

    static async get(id: string, service: string): Promise<ChatterModel[]> {
        return this.findBy(service, where().eq("id", id));
    }

    static async getAll(service: string): Promise<ChatterModel[]> {
        return this.findBy(service);
    }

    static async findFirstBy(service: string, where?: Where): Promise<ChatterModel|null> {
        return Model.retrieve(ChatterModel, service + "_users", where);
    }

    static async findBy(service: string, where?: Where): Promise<ChatterModel[]> {
        return Model.retrieveAll(ChatterModel, service + "_users", where);
    }

    static async findByName(name: string, service: string): Promise<ChatterModel|null> {
        return this.findFirstBy(service, where().eq("name", name));
    }
}