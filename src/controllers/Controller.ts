import {Application, Router} from "express";

export default abstract class Controller {
    protected router: Router;

    public constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        return this.router;
    }
}