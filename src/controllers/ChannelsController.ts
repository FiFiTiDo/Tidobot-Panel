import Controller from "./Controller";
import {Get, Update} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import ChannelModel from "../models/ChannelModel";
import DataView from "../views/DataView";
import HttpStatusView from "../views/HttpStatusView";

export default class ChannelsController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let { service } = req.params;
        let channels: ChannelModel[];
        try {
            channels = await ChannelModel.getAll(service);
        } catch (e) {
            next(e);
        }
        new DataView(channels.map(channel => channel.getData())).render(res);
    }

    @Get("/:name")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { name, service } = req.params;
        let channel: ChannelModel|null;
        try {
            channel = await ChannelModel.findByName(name, service);
        } catch (e) {
            next(e);
        }
        new DataView(channel === null ? [] : channel).render(res);
    }

    @Update("/:name")
    async update(req: Request, res: Response, next: NextFunction) {
        let { name, service } = req.params;

        let channel: ChannelModel|null;
        try {
            channel = await ChannelModel.findByName(name, service);
        } catch (e) {
            next(e);
        }

        if (req.body.disabled_modules) channel.setDisabledModules(req.body.disabled_modules);

        try {
            await channel.save();
        } catch (e) {
            next(e);
        }

        new HttpStatusView(200, "Success").render(res);
    }
}