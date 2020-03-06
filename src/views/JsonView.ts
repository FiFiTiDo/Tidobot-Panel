import View from "./View";
import {Response} from "express";
import Model from "../models/Model";

type RawData = { [key: string]: any };
type DataInput = Model|Model[]|null|RawData|RawData[];

export default class JsonView extends View {
    constructor(protected data: any) {
        super();
    }

    render(res: Response): void {
        res.json(this.data);
    }

    static async fromData(data: DataInput) {
        if (data === null) return new JsonView({ total: 0, data: null });
        if (!Array.isArray(data)) data = [data];
        return new JsonView({
            total: data.length,
            data: await Promise.all(data.map(async item => (item instanceof Model) ? await item.getSchema().export() : item))
        });
    }
}