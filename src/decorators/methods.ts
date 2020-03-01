import Controller from "../controllers/Controller";
import {NextFunction, Request, Response} from "express";
import Model, {RetrievableModel} from "../models/Model";
import DataView from "../views/DataView";
import {where} from "../database/BooleanOperations";
import HttpStatusView from "../views/HttpStatusView";

export type RequestHandler = (req: Request, res: Response, next?: NextFunction) => void;

function route(path: string, method: string) {
    return function (obj: Object, key: string|symbol, descriptor: TypedPropertyDescriptor<RequestHandler>): any {
        if (!(obj instanceof Controller)) throw new Error("Cannot use " + method + " descriptor on a method outside of a controller.");

        obj.getRouter()[method](path, descriptor.value.bind(obj));
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

export function Patch(path: string) {
    return route(path, "patch");
}

export function Del(path: string) {
    return route(path, "delete");
};

type StringToAnyConverter = (s: string) => any;
type ModelMethods = "getOne" | "getAll" | "update" | "delete" | "create";
export function ModelRoutes<T extends Model>(model_const: RetrievableModel<T>, name: string, disabled: ModelMethods[] = [], column = "id", converter: StringToAnyConverter = s => parseInt(s)) {
    return function (obj: any) {
        const isDisabled = (type: ModelMethods) => disabled.indexOf(type) >= 0;
        let original = obj;
        function construct(constructor) {
            const c: any = function () {
                if (!isDisabled("getAll"))
                    this.getRouter().get("/", async (req, res, next) => {
                        let service = this.getParameter(req, "service");
                        let channel = this.getParameter(req, "channel");
                        try {
                            let models = await Model.retrieveAll<T>(model_const, service, channel);
                            new DataView(models).render(res);
                        } catch (e) {
                            next(e);
                        }
                    });

                if (!isDisabled("getOne"))
                    this.getRouter().get("/:id", async (req, res, next) => {
                        let { id } = req.params;
                        let service = this.getParameter(req, "service");
                        let channel = this.getParameter(req, "channel");
                        try {
                            let model = await Model.retrieve<T>(model_const, service, channel, where().eq(column, converter(id)));
                            new DataView(model).render(res);
                        } catch (e) {
                            next(e);
                        }
                    });

                if (!isDisabled("update"))
                    this.getRouter().patch("/:id", async (req, res, next) => {
                        let { id } = req.params;
                        let service = this.getParameter(req, "service");
                        let channel = this.getParameter(req, "channel");
                        try {
                            let model = await Model.retrieve<T>(model_const, service, channel, where().eq(column, converter(id)));
                            if (model === null) {
                                new HttpStatusView(404, name + " not found").render(res);
                                return;
                            }
                            await model.update(req.body);
                        } catch (e) {
                            next(e);
                        }

                        new HttpStatusView(200, "Success").render(res);
                    });

                if (!isDisabled("delete"))
                    this.getRouter().delete("/:id", async (req, res, next) => {
                        let { id } = req.params;
                        let service = this.getParameter(req, "service");
                        let channel = this.getParameter(req, "channel");
                        try {
                            let model = await Model.retrieve<T>(model_const, service, channel, where().eq(column, converter(id)));
                            if (model === null) {
                                new HttpStatusView(404, name + " not found").render(res);
                                return;
                            }
                            await model.delete();
                            new HttpStatusView(200, name + " successfully deleted");
                        } catch (e) {
                            next(e);
                        }
                    });

                if (!isDisabled("create"))
                    this.getRouter().put("/", async (req, res, next) => {
                        let service = this.getParameter(req, "service");
                        let channel = this.getParameter(req, "channel");
                        try {
                            let command = await Model.make(model_const, service, channel, req.body);
                            new DataView(command).render(res);
                        } catch (e) {
                            next(e);
                        }
                    });
                constructor.apply(this);
            };
            c.prototype = constructor.prototype;
            return new c();
        }

        const f: any = function () {
            return construct(original);
        };
        f.prototype = original.prototype;
        return f;
    }
}

