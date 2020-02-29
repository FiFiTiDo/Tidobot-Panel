import Controller from "./Controller";
import {Del, Get, Put} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import DataView from "../views/DataView";
import GroupsModel from "../models/GroupsModel";
import HttpStatusView from "../views/HttpStatusView";
import Model from "../models/Model";

export default class GroupsController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let groups = await GroupsModel.getAll(service, channel);
            new DataView(groups).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:group")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { user: name } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let group = await GroupsModel.findByName(name, service, channel);
            new DataView(group).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Put("/")
    async create(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let group = await Model.make(GroupsModel, service, channel, req.body);
            if (group === null) {
                new HttpStatusView(400, "That group already exists!").render(res);
                return;
            }
            new DataView(group).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Del("/:group")
    async delete(req: Request, res: Response, next: NextFunction) {
        let { user: name } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let group = await GroupsModel.findByName(name, service, channel);
            if (group === null) {
                new HttpStatusView(404, "Group not found");
                return;
            }
            await group.delete();
            new HttpStatusView(200, "Group successfully deleted");
        } catch (e) {
            next(e);
        }
    }
}