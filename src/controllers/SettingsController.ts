import Controller from "./Controller";
import {Get, ModelRoutes} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import DataView from "../views/DataView";
import SettingsModel from "../models/SettingsModel";

@ModelRoutes(SettingsModel, "Setting", [], "key", s => s)
export default class SettingsController extends Controller {
    @Get("/reset")
    async reset(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let settings = await SettingsModel.getAll<SettingsModel>(service, channel);

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
