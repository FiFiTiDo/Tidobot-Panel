import Controller from "./Controller";
import {Get, Patch} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import JsonView from "../views/JsonView";
import HttpStatusView from "../views/HttpStatusView";
import FiltersModel from "../models/FiltersModel";

export default class FiltersController extends Controller {
    @Get("/")
    async get(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let filters = await FiltersModel.getByChannelId(channel, service);
            (await JsonView.fromData(filters)).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Patch("/")
    async update(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let filters = await FiltersModel.getByChannelId(channel, service);
            await filters.update(req.body);
            new HttpStatusView(200, "Updated filters.").render(res);
        } catch (e) {
            next(e);
        }
    }
}