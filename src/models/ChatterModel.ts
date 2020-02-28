import UserModel from "./UserModel";
import {Column} from "../decorators/column";
import {DataTypes} from "../database/Schema";
import Model from "./Model";
import {where} from "../utils/functions";

export default class ChatterModel extends UserModel {
    @Column({ datatype: DataTypes.STRING, unique: true })
    public id: string;

    @Column({ datatype: DataTypes.STRING })
    public name: string;

    @Column({ datatype: DataTypes.INTEGER })
    public balance: number;

    @Column({ datatype: DataTypes.BOOLEAN })
    public banned: boolean;

    @Column({ datatype: DataTypes.BOOLEAN })
    public regular: boolean;


    static async get(id: string, service: string): Promise<UserModel|null> {
        return Model.retrieve(UserModel, service + "_users", where().eq("id", id));
    }

    static async getAll(service: string): Promise<UserModel[]> {
        return Model.retrieveAll(UserModel, service + "_users");
    }

    static async findByName(name: string, service: string): Promise<UserModel|null> {
        return Model.retrieve(UserModel, service + "_users", where().eq("name", name));
    }
}