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
        tableName_map.set(target.name, tableNameFormatter);
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

async function getOrSetProp<T>(obj: Object, key: string, f: () => T | Promise<T>) {
    let varKey = "_" + key;
    let prop = Object.getOwnPropertyDescriptor(obj, varKey);
    if (!prop || !prop.value) {
        let value = f();
        if (value instanceof Promise) await value;
        Object.defineProperty(obj, varKey, { value, configurable: true, enumerable: true });
    }
    return Object.getOwnPropertyDescriptor(obj, varKey).value;
}


const relationships_map: Map<string, (string|symbol)[]> = new Map();
function addRelationship(model: string, key: string|symbol) {
    let relationships = getRelationships(model);
    relationships.push(key);
    relationships_map.set(model, relationships);
}

export function getRelationships(model_name: string) {
    return relationships_map.get(model_name) || [];
}

export function OneToOne<T extends Model>(model_const: ModelConstructor<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string, descriptor: TypedPropertyDescriptor<() => Promise<T|null>>): any {
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        let model = null;
        addRelationship(obj.constructor.name, key);
        descriptor.value = async function () {
            return getOrSetProp(this, key, () => Model.retrieve(model_const, this.getService(), this.getChannel(), where().eq(foreignKey, this[localKey])));
        };
        return descriptor;
    }
}

export function ManyToOne<T extends Model>(model_const: ModelConstructor<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string, descriptor: TypedPropertyDescriptor<() => Promise<T[]>>): any {
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        let model = null;
        addRelationship(obj.constructor.name, key);
        descriptor.value = async function () {
            return getOrSetProp(this, key, () => Model.retrieveAll(model_const, this.getService(), this.getChannel(), where().eq(foreignKey, this[localKey])));
        };
        return descriptor;
    }
}

export function OneToMany<T extends Model>(model_const: ModelConstructor<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string, descriptor: TypedPropertyDescriptor<() => Promise<T[]>>): any {
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        let models = null;
        addRelationship(obj.constructor.name, key);
        descriptor.value = async function () {
            return getOrSetProp(this, key, () => Model.retrieveAll(model_const, this.getService(), this.getChannel(), where().eq(foreignKey, this[localKey])));
        };
        return descriptor;
    }
}

export function ManyToMany<T1 extends Model, T2 extends Model>(foreign_model: ModelConstructor<T1>, joining_model: ModelConstructor<T2>, local: [string, string], foreign: [string, string]) {
    return function (obj: Object, key: string, descriptor: TypedPropertyDescriptor<() => Promise<T1[]>>): any {
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        let [localKey, localJoinKey] = local;
        let [foreignKey, foreignJoinKey] = foreign;
        addRelationship(obj.constructor.name, key);

        descriptor.value = async function () {
            return getOrSetProp(this, key, async () => {
                let joins = await Model.retrieveAll(joining_model, this.getService(), this.getChannel(), where().eq(localJoinKey, this[localKey]));
                let ops = [];
                for (let join of joins)
                    ops.push(Model.retrieve(foreign_model, this.getService(), this.getChannel(), where().eq(foreignKey, join[foreignJoinKey])));
                return await Promise.all(ops);
            });
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