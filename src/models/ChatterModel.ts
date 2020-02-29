import {Column} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import Model from "./Model";
import {RawRowData} from "../database/RowData";
import {where} from "../database/BooleanOperations";

export default class ChatterModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(ChatterModel.getTableName(service, channel), id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public chatter_id: string;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.INTEGER })
    public balance: number;

    @Column({ datatype: DataTypes.BOOLEAN })
    public banned: boolean;

    @Column({ datatype: DataTypes.BOOLEAN })
    public regular: boolean;

    static async findByName(name: string, service?: string, channel?: string): Promise<ChatterModel|null> {
        return Model.retrieve(ChatterModel, service, channel, where().eq("name", name));
    }

    static getTableName(service?: string, channel?: string) {
        return service + "_" + channel + "_users";
    }
}