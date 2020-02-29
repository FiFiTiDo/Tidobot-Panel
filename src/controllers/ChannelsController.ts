import Controller from "./Controller";
import {Get, Patch} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import ChannelModel from "../models/ChannelModel";
import DataView from "../views/DataView";
import HttpStatusView from "../views/HttpStatusView";

export default class ChannelsController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        try {
            let channels = await ChannelModel.getAll(service);
            new DataView(channels).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:channel")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { channel: name } = req.params;
        let service = this.getParameter(req, "service");
        try {
            let channel = await ChannelModel.findByName(name, service);
            new DataView(channel).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Patch("/:channel")
    async update(req: Request, res: Response, next: NextFunction) {
        let { channel: name } = req.params;
        let service = this.getParameter(req, "service");
        try {
            let channel = await ChannelModel.findByName(name, service);
            if (channel === null) {
                new HttpStatusView(404, "Channel not found").render(res);
                return;
            }
            if (req.body.disabled_modules) channel.disabled_modules = req.body.disabled_modules;
            await channel.save();
        } catch (e) {
            next(e);
        }

        new HttpStatusView(200, "Success").render(res);
    }
}