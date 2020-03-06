import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import Model from "./Model";
import {RawRowData} from "../database/RowData";
import {where} from "../database/BooleanOperations";

@Table((service, channel) => `${service}_${channel}_chatters`)
export default class ChatterModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(ChatterModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public user_id: string;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.INTEGER })
    public balance: number;

    @Column({ datatype: DataTypes.BOOLEAN })
    public banned: boolean;

    @Column({ datatype: DataTypes.BOOLEAN })
    public regular: boolean;
}