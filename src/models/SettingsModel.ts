import Model from "./Model";
import {Column, Table} from "../decorators/database";
import {DataTypes} from "../database/Schema";

@Table((service, channel) => `${service}_${channel}_settings`)
export default class SettingsModel extends Model {
    constructor(id: number, service?: string, channel?: string) {
        super(SettingsModel, id, service, channel);
    }

    @Column({ datatype: DataTypes.STRING, unique: true })
    public key: string;

    @Column({ datatype: DataTypes.STRING })
    public value: string;

    @Column({ datatype: DataTypes.ENUM, enum: ["string", "integer", "float", "boolean"] })
    public type: string;

    @Column({ name: "default_value", datatype: DataTypes.STRING, null: true })
    public defaultValue: string;
}