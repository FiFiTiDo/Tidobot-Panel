import Controller from "./Controller";
import {NextFunction, Request, Response} from "express";
import DataView from "../views/DataView";
import ListModel from "../models/ListModel";
import {Del, Get, Patch, Put} from "../decorators/methods";
import ListsModel from "../models/ListsModel";
import HttpStatusView from "../views/HttpStatusView";

export default class ListsController extends Controller {
    @Get("/")
    async getAll(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let lists = await ListsModel.getAll(service, channel);
            new DataView(lists).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Put("/")
    async createList(req: Request, res: Response, next: NextFunction) {
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let lists = await ListsModel.getAll(service, channel);
            new DataView(lists).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Del("/:name")
    async deleteList(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let list = await ListsModel.findByName(name, service, channel);
            await list.delete();
            new HttpStatusView(200, "Deleted list.").render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:name")
    async getList(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let list = await ListsModel.findByName(name, service, channel);
            let items = await ListModel.getAll(service, channel, name);
            new DataView({
                id: list.id,
                name: list.name,
                items: items.map(model => model.getSchema().exportRow())
            }).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Put("/:name")
    async addItem(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let list = await ListsModel.findByName(name, service, channel);
            await list.addItem(req.body.value);
            new HttpStatusView(200, "Added item.").render(res);
        } catch (e) {
            next(e);
        }
    }

    @Del("/:name/:id")
    async deleteItem(req: Request, res: Response, next: NextFunction) {
        let { name, id } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let list = await ListsModel.findByName(name, service, channel);
            let item = await list.getItem(parseInt(id));
            await item.delete();
            new HttpStatusView(200, "Deleted item.").render(res);
        } catch (e) {
            next(e);
        }
    }

    @Patch("/:name/:id")
    async updateItem(req: Request, res: Response, next: NextFunction) {
        let { name, id } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let list = await ListsModel.findByName(name, service, channel);
            let item = await list.getItem(parseInt(id));
            await item.update(req.body);
            new HttpStatusView(200, "Updated item.").render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:name/random")
    async getRandomItem(req: Request, res: Response, next: NextFunction) {
        let { name } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let list = await ListsModel.findByName(name, service, channel);
            let item = await list.getRandomItem();
            new DataView(item).render(res);
        } catch (e) {
            next(e);
        }
    }

    @Get("/:name/:id")
    async getItem(req: Request, res: Response, next: NextFunction) {
        let { name, id } = req.params;
        let service = this.getParameter(req, "service");
        let channel = this.getParameter(req, "channel");
        try {
            let list = await ListsModel.findByName(name, service, channel);
            let item = await list.getItem(parseInt(id));
            new DataView(item).render(res);
        } catch (e) {
            next(e);
        }
    }
}