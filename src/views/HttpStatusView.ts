import {Response} from "express";
import JsonView from "./JsonView";

export default class HttpStatusView extends JsonView {
    constructor(private error: number, message: string) {
        super({error, message});
    }

    render(res: Response): void {
        res.status(this.error);
        super.render(res);
    }
}