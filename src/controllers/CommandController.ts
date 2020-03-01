import Controller from "./Controller";
import {Del, Get, Patch, Put} from "../decorators/methods";
import {NextFunction, Request, Response} from "express";
import DataView from "../views/DataView";
import Model from "../models/Model";
import HttpStatusView from "../views/HttpStatusView";
import CommandModel from "../models/CommandModel";
import moment from "moment";

export default class CommandController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let command = await CommandModel.getAll(service, channel);
            new DataView(command).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:command")
    async getOne(req: Request, res: Response, next: NextFunction) {
        let { command: id } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let command = await CommandModel.get(parseInt(id), service, channel);
            new DataView(command).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Put("/")
    async create(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let data = Object.assign(req.body, {
                created_at: moment().toISOString(),
                updated_at: moment().toISOString()
            });
            let command = await Model.make(CommandModel, service, channel, data);
            new DataView(command).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Patch("/:command")
    async update(req: Request, res: Response, next: NextFunction) {
        let { command: id } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let command = await CommandModel.get<CommandModel>(parseInt(id), service, channel);
            if (command === null) {
                new HttpStatusView(404, "Command not found").render(res);
                return;
            }
            if (req.body.trigger) command.trigger = req.body.trigger;
            if (req.body.response) command.response = req.body.response;
            if (req.body.condition) command.condition = req.body.condition;
            if (req.body.price) command.price = req.body.price;
            if (req.body.trigger) command.cooldown = req.body.cooldown;
            command.updated_at = moment();

            await command.save();
        } catch (e) {
            next(e);
        }

        new HttpStatusView(200, "Success").render(res);
    }

    @Del("/:command")
    async delete(req: Request, res: Response, next: NextFunction) {
        let { command: id } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let command = await CommandModel.get(parseInt(id), service, channel);
            if (command === null) {
                new HttpStatusView(404, "Command not found");
                return;
            }
            await command.delete();
            new HttpStatusView(200, "Command successfully deleted");
        } catch (e) {
            next(e);
        }
    }
}