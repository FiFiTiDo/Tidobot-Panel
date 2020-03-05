import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_groups`)
export default class GroupsModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(GroupsModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public name: string;
}