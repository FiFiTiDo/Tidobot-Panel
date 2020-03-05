import Model from "./Model";
import {where} from "../database/BooleanOperations";
import {Moment} from "moment";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_commands`)
export default class CommandModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(CommandModel, id, service, channel);
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
}