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
        try {
            let users = await UserModel.getAll(service);
            new DataView(users.map(user => user.getSchema().exportRow())).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:name")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = getService(req);
        try {
            let user = await UserModel.findByName(name, service);
            new DataView(user === null ? null : user.getSchema().exportRow()).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Update("/:name")
    async update(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = getService(req);
        try {
            let user = await UserModel.findByName(name, service);
            if (user === null) {
                new HttpStatusView(404, "User not found").render(res);
                return;
            }
            if (req.body.ignore) user.ignore = req.body.ignore;
            await user.save();
        } catch (e) {
            next(e);
        }

        new HttpStatusView(200, "Success").render(res);
    }
}