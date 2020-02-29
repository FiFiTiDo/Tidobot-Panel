import Controller from "./Controller";
import {Get, Update} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import DataView from "../views/DataView";
import HttpStatusView from "../views/HttpStatusView";
import UserModel from "../models/UserModel";

export default class UsersController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        try {
            let users = await UserModel.getAll(service);
            new DataView(users.map(user => user.getSchema().exportRow())).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:user")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { user: name } = req.params;
        let service = this.getParameter(req, "service");
        try {
            let user = await UserModel.findByName(name, service);
            new DataView(user === null ? null : user.getSchema().exportRow()).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Update("/:user")
    async update(req: Request, res: Response, next: NextFunction) {
        let { user: name } = req.params;
        let service = this.getParameter(req, "service");
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