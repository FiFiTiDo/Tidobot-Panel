import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_news`)
export default class CountersModel extends Model {
    constructor(id: number, service: string, channel: string) {
        super(CountersModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.INTEGER })
    public value: number;
}