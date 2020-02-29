import {Router, Request} from "express";

export default abstract class Controller {
    protected router: Router;

    public getRouter(): Router {
        if (typeof this.router === "undefined")
            this.router = Router();

        return this.router;
    }

    protected getParameter(req: Request, param: string) {
        let prop = Object.getOwnPropertyDescriptor(req, param);
        return prop && prop.value ? prop.value : null;
    }
}