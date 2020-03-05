import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel, optional_param) => `${service}_${channel}_list_${optional_param}`)
export default class ListModel extends Model {
    constructor(id: number, service: string, channel: string, optional_param: string) {
        super(ListModel, id, service, channel, optional_param);
    }

    @Column({ datatype: DataTypes.STRING })
    public value: string;
}