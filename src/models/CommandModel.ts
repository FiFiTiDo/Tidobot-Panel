import Model from "./Model";
import {where} from "../database/BooleanOperations";
import {Moment} from "moment";
import {Column} from "../decorators/database";
import {DataTypes} from "../database/Schema";

export default class CommandModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(CommandModel.getTableName(service, channel), id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING })
    public trigger: string;

    @Column({ datatype: DataTypes.STRING })
    public response: string;

    @Column({ datatype: DataTypes.STRING })
    public condition: string;

    @Column({ datatype: DataTypes.FLOAT })
    public price: number;

    @Column({ datatype: DataTypes.INTEGER })
    public cooldown: number;

    @Column({ datatype: DataTypes.DATE })
    public created_at: Moment;

    @Column({ datatype: DataTypes.DATE })
    public updated_at: Moment;

    static getTableName(service?: string, channel?: string): string {
        return service + "_" + channel + "_commands";
    }
}