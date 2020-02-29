import JsonView from "./JsonView";
import Model from "../models/Model";

type DataInput = Model|Model[]|null;

function normalizeData(data: DataInput) {
    if (data === null) return { total: 0, data: null };
    if (!Array.isArray(data)) data = [data];
    return {
        total: data.length,
        data: data.map(model => model.getSchema().exportRow())
    }
}

export default class DataView extends JsonView {
    constructor(data: DataInput) {
        super(normalizeData(data));
    }
}