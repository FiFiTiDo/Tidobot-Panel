import Controller from "./Controller";
import {Get, Update} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import ChannelModel from "../models/ChannelModel";
import DataView from "../views/DataView";
import HttpStatusView from "../views/HttpStatusView";
import {getService} from "../utils/functions";

export default class ChannelsController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = getService(req);
        try {
            let channels = await ChannelModel.getAll(service);
            new DataView(channels.map(channel => channel.getSchema().exportRow())).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:name")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = getService(req);
        try {
            let channel = await ChannelModel.findByName(name, service);
            new DataView(channel === null ? null : channel.getSchema().exportRow()).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Update("/:name")
    async update(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = getService(req);
        let channel: ChannelModel|null;
        try {
            channel = await ChannelModel.findByName(name, service);
        } catch (e) {
            next(e);
        }

        if (req.body.disabled_modules) channel.disabled_modules = req.body.disabled_modules;

        try {
            await channel.save();
        } catch (e) {
            next(e);
        }

        new HttpStatusView(200, "Success").render(res);
    }
}