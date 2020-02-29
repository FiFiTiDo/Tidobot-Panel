import Controller from "./Controller";
import {Get, Update} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import {getService} from "../utils/functions";
import DataView from "../views/DataView";
import HttpStatusView from "../views/HttpStatusView";
import UserModel from "../models/UserModel";

export default class UsersController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = getService(req);
        let users: UserModel[];
        try {
            users = await UserModel.getAll(service);
        } catch (e) {
            next(e);
        }
        new DataView(users.map(user => user.getSchema().exportRow())).render(res);
    }

    @Get("/:name")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = getService(req);
        let user: UserModel|null;
        try {
            user = await UserModel.findByName(name, service);
        } catch (e) {
            next(e);
        }
        new DataView(user === null ? null : user.getSchema().exportRow()).render(res);
    }

    @Update("/:name")
    async update(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = getService(req);
        let user: UserModel|null;
        try {
            user = await UserModel.findByName(name, service);
        } catch (e) {
            next(e);
        }

        if (req.body.ignore) user.ignore = req.body.ignore;

        try {
            await user.save();
        } catch (e) {
            next(e);
        }

        new HttpStatusView(200, "Success").render(res);
    }
}