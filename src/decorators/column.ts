import {ColumnSettings} from "../database/Schema";
import Model from "../models/Model";


export function Column(settings: ColumnSettings) {
    return function (target: any, propertyKey: string) {
        if (!(target instanceof Model)) throw new Error("Column decorator can only be used in a model.");

        target.getSchema().addColumn(propertyKey, settings);
    }
}