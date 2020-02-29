import Controller from "./Controller";
import {NextFunction, Request, Response} from "express";
import {Get, Patch} from "../decorators/methods";
import DataView from "../views/DataView";
import HttpStatusView from "../views/HttpStatusView";
import ChatterModel from "../models/ChatterModel";

export default class ChattersController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let chatters = await ChatterModel.getAll(service, channel);
            new DataView(chatters).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:user")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { user: name } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let chatter = await ChatterModel.findByName(name, service, channel);
            new DataView(chatter).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Patch("/:user")
    async update(req: Request, res: Response, next: NextFunction) {
        let { user: name } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let chatter = await ChatterModel.findByName(name, service, channel);
            if (chatter === null) {
                new HttpStatusView(404, "Chatter not found").render(res);
                return;
            }
            if (req.body.banned) chatter.banned = req.body.banned;
            if (req.body.balance) chatter.balance = req.body.balance;
            if (req.body.regular) chatter.regular = req.body.regular;
            await chatter.save();
        } catch (e) {
            next(e);
        }

        new HttpStatusView(200, "Success").render(res);
    }
}