import Controller from "./Controller";
import {Del, Get, Patch, Put} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import DataView from "../views/DataView";
import Model from "../models/Model";
import HttpStatusView from "../views/HttpStatusView";
import SettingsModel from "../models/SettingsModel";

export default class SettingsController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let settings = await SettingsModel.getAll(service, channel);
            new DataView(settings).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:setting")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { setting: key } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let setting = await SettingsModel.findByKey(key, service, channel);
            new DataView(setting).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Put("/")
    async create(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let command = await Model.make(SettingsModel, service, channel, req.body);
            new DataView(command).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Patch("/:setting")
    async update(req: Request, res: Response, next: NextFunction) {
        let { setting: key } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let setting = await SettingsModel.findByKey(key, service, channel);
            if (setting === null) {
                new HttpStatusView(404, "Setting not found").render(res);
                return;
            }
            await setting.update(req.body);
        } catch (e) {
            next(e);
        }

        new HttpStatusView(200, "Success").render(res);
    }

    @Del("/:setting")
    async delete(req: Request, res: Response, next: NextFunction) {
        let { setting: key } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let setting = await SettingsModel.findByKey(key, service, channel);
            if (setting === null) {
                new HttpStatusView(404, "Setting not found");
                return;
            }
            await setting.delete();
            new HttpStatusView(200, "Setting successfully deleted");
        } catch (e) {
            next(e);
        }
    }

    @Get("/reset")
    async reset(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let settings = await Model.getAll<SettingsModel>(service, channel);

            let ops = [];
            for (let setting of settings) {
                setting.value = setting.defaultValue;
                ops.push(setting.save());
            }
            await Promise.all(ops);

            new DataView(settings).render(res);
        } catch (e) {
            next(e);
        }
    }
}
