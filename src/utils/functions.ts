import * as util from "util";
import * as winston from "winston";
import {IRouter, Request, Router} from "express";
import {Where} from "../database/BooleanOperations";

export const error_format = winston.format(info => {
    if (info.cause && info.cause instanceof Error) {
        if (info.cause instanceof Error) {
            info.message = util.format("%s, caused by:\n%s", info.message, info.cause.stack);
        } else {
            info.message = util.format("%s, caused by:\n%s", info.message, info.cause);
        }
        delete info.cause;
    }

    return info;
});

export function uniqueArray<T>(value: T, index: number, array: T[]) {
    return array.indexOf(value) === index;
}

export function removeElements<T>(value: T|T[]) {
    let values = Array.isArray(value) ? value : [value];
    return (value: T, index: number, array: T[]) => values.indexOf(value) < 0;
}

export function getService(req: Request): string {
    return Object.getOwnPropertyDescriptor(req, "service").value;
}

export function putParameter(req, res, next, value, name) {
    Object.defineProperty(req, name, { value, enumerable: true, configurable: true });
    next();
}

export function route_namespace(path: string, parent: IRouter, f: (router: Router) => void) {
    const router = Router();
    f(router);
    parent.use(path, router);
}