import {ColumnSettings} from "../database/Schema";
import Model, {RetrievableModel} from "../models/Model";
import {where} from "../utils/functions";

export function Column(settings: ColumnSettings) {
    return function (target: any, propertyKey: string) {
        if (!(target instanceof Model)) throw new Error("Column decorator can only be used in a model.");

        target.getSchema().addColumn(propertyKey, settings);
    }
}

export function OneToOne<T extends Model>(model: RetrievableModel<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T|null>>): any {
        if (!obj.hasOwnProperty(localKey)) throw new Error("Model does not have the specified foreignKey.");
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        descriptor.value = () => Model.retrieve(model, obj.getService(), obj.getChannel(), where().eq(foreignKey, obj[localKey]));
        return descriptor;
    }
}

export function ManyToOne<T extends Model>(model: RetrievableModel<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T|null>>): any {
        if (!obj.hasOwnProperty(localKey)) throw new Error("Model does not have the specified foreignKey.");
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        descriptor.value = () => Model.retrieve(model, obj.getService(), obj.getChannel(), where().eq(foreignKey, obj[localKey]));
        return descriptor;
    }
}

export function OneToMany<T extends Model>(model: RetrievableModel<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T[]>>): any {
        if (!obj.hasOwnProperty(localKey)) throw new Error("Model does not have the specified foreignKey.");
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        descriptor.value = () => Model.retrieveAll(model, obj.getService(), obj.getChannel(), where().eq(foreignKey, obj[localKey]));
        return descriptor;
    }
}