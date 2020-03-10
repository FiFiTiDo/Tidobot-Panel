import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";
import {where} from "../database/BooleanOperations";

@Table(service => `${service}_filters`)
export default class FiltersModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(FiltersModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING })
    public channel_id: string;

    @Column({ datatype: DataTypes.ARRAY })
    public domains: string[];

    @Column({ datatype: DataTypes.ARRAY })
    public bad_words: string[];

    @Column({ datatype: DataTypes.ARRAY })
    public emotes: string[];

    static getByChannelId(id: string, service: string) {
        return Model.retrieve(FiltersModel, service, null, where().eq("channel_id", id));
    }
}