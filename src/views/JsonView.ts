import View from "./View";
import {Response} from "express";

export default class JsonView extends View {
    constructor(protected data: any) {
        super();
    }

    render(res: Response): void {
        res.json(this.data);
    }
}