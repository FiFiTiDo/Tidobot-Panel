import Controller from "../controllers/Controller";
import {NextFunction, Request, Response} from "express";

export type RequestHandler = (req: Request, res: Response, next?: NextFunction) => void;

function route(path: string, method: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<RequestHandler>): any {
        if (!(obj instanceof Controller)) throw new Error("Cannot use " + method + " descriptor on a method outside of a controller.");

        obj.getRouter()[method](path, descriptor.value);
        return descriptor;
    }
}

export function Get(path: string) {
    return route(path, "get");
}

export function Post(path: string) {
    return route(path, "post");
}

export function Put(path: string) {
    return route(path, "put");
}

export function Update(path: string) {
    return route(path, "update");
}

exports.Delete = function (path: string) {
    return route(path, "delete");
};

