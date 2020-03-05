import JsonView from "./JsonView";
import Model from "../models/Model";

type RawData = { [key: string]: any };
type DataInput = Model|Model[]|null|RawData|RawData[];

function normalizeData(data: DataInput) {
    if (data === null) return { total: 0, data: null };
    if (!Array.isArray(data)) data = [data];
    return {
        total: data.length,
        data: data.map(item => (item instanceof Model) ? item.getSchema().exportRow() : item)
    }
}

export default class DataView extends JsonView {
    constructor(data: DataInput) {
        super(normalizeData(data));
    }
}