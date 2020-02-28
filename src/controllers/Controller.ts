import {Router} from "express";

export default abstract class Controller {
    protected router: Router;

    public getRouter(): Router {
        if (typeof this.router === "undefined")
            this.router = Router();

        return this.router;
    }
}