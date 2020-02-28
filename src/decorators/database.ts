import {ColumnSettings} from "../database/Schema";
import Model, {RetrievableModel} from "../models/Model";
import {where} from "../utils/functions";

export function Column(settings: ColumnSettings) {
    return function (target: any, propertyKey: string) {
        if (!(target instanceof Model)) throw new Error("Column decorator can only be used in a model.");

        target.getSchema().addColumn(propertyKey, settings);
    }
}

export function OneToOne<T extends Model>(model_const: RetrievableModel<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T|null>>): any {
        if (!obj.hasOwnProperty(localKey)) throw new Error("Model does not have the specified foreignKey.");
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        let model = Model.retrieve(model_const, obj.getService(), obj.getChannel(), where().eq(foreignKey, obj[localKey]));
        descriptor.value = () => model;
        return descriptor;
    }
}

export function ManyToOne<T extends Model>(model_const: RetrievableModel<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T|null>>): any {
        if (!obj.hasOwnProperty(localKey)) throw new Error("Model does not have the specified foreignKey.");
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        let model = Model.retrieve(model_const, obj.getService(), obj.getChannel(), where().eq(foreignKey, obj[localKey]));
        descriptor.value = () => model;
        return descriptor;
    }
}

export function OneToMany<T extends Model>(model_const: RetrievableModel<T>, localKey: string, foreignKey: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<() => Promise<T[]>>): any {
        if (!obj.hasOwnProperty(localKey)) throw new Error("Model does not have the specified foreignKey.");
        if (!(obj instanceof Model)) throw new Error("Model needs the service to retrieve the data.");
        let models = Model.retrieveAll(model_const, obj.getService(), obj.getChannel(), where().eq(foreignKey, obj[localKey]));
        descriptor.value = () => models;
        return descriptor;
    }
}