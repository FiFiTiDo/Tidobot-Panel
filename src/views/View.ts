import {Response} from "express";

export default abstract class View {
    abstract render(res: Response): void;
}