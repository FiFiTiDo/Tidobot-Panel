import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import ChatterModel from "../models/ChatterModel";

@ModelRoutes(ChatterModel, "Chatter", ["create", "delete"], "chatter_id", s => s)
export default class ChattersController extends Controller {
}