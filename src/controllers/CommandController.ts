import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import CommandModel from "../models/CommandModel";

@ModelRoutes(CommandModel, "Command")
export default class CommandController extends Controller {
}