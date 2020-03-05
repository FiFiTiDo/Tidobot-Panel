import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_news`)
export default class NewsModel extends Model {
    constructor(id: number, service: string, channel: string) {
        super(NewsModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING })
    public value: string;
}