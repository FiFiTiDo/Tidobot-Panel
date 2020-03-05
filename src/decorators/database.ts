import {ColumnProp, ColumnSettings, DataTypes} from "../database/Schema";
import Model, {ModelConstructor} from "../models/Model";
import {where} from "../database/BooleanOperations";

const columns_map: Map<string, ColumnProp[]> = new Map();
function addColumn(model: Model, propertyKey: string, settings: ColumnSettings): void {
    let arr = getColumns(model);
    arr.push({ property: propertyKey, settings });
    columns_map.set(model.constructor.name, arr);
}

export function getColumns(model: Model): ColumnProp[] {
    return columns_map.get(model.constructor.name) || [];
}

export function Column(settings: ColumnSettings) {
    return function (target: any, propertyKey: string) {
        addColumn(target, propertyKey, settings);
    }
}

type TableNameFormatter = (service: string, channel: string, optional_param?: string) => string;
const tableName_map: Map<string, TableNameFormatter> = new Map();
export function Table(tableNameFormatter: TableNameFormatter) {
    return function (target: any) {
        tableName_map.set(target.constructor.name, tableNameFormatter);
    }
}

export function getTableName(model_const: ModelConstructor<any>, service: string, channel: string, optional_param?: string) {
    const f = tableName_map.get(model_const.name);
    if (f === null) return null;
    return f(service, channel, optional_param);
}

export function Id(target: any, propertyKey: string) {
    addColumn(target, propertyKey, { datatype: DataTypes.INTEGER, increment: true, primary: true });
}

function getOrSetProp<T>(obj: Object, key: string, f: () => T) {
    let varKey = "_" + key;
    let prop = Object.getOwnPropertyDescriptor(this, varKey);
    if (!prop || !prop.value) Object.defineProperty(this, varKey, { value: f(), configurable: true, enumerable: true });
    return Object.getOwnPropertyDescriptor(this, varKey).value;
}

export function OneToOne<T extends Model>(model_const: ModelConstructor<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T|null>>): any {
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        descriptor.value = function () {
            return getOrSetProp(this, localKey, () => Model.retrieve(model_const, obj.getService(), obj.getChannel(), where().eq(foreignKey, this[localKey])));
        };
        return descriptor;
    }
}

export function ManyToOne<T extends Model>(model_const: ModelConstructor<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T|null>>): any {
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        descriptor.value = function () {
            return getOrSetProp(this, localKey, () => Model.retrieve(model_const, obj.getService(), obj.getChannel(), where().eq(foreignKey, this[localKey])));
        };
        return descriptor;
    }
}

export function OneToMany<T extends Model>(model_const: ModelConstructor<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T[]>>): any {
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        descriptor.value = function () {
            return getOrSetProp(this, localKey, () => Model.retrieveAll(model_const, obj.getService(), obj.getChannel(), where().eq(foreignKey, this[localKey])));
        };
        return descriptor;
    }
}

export function ImportModel<T extends Model>(model_const: ModelConstructor<T>) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T[]>>): any {
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        descriptor.value = async () => Model.retrieveAll(model_const, obj.getService(), obj.getChannel());
        return descriptor;
    }
}