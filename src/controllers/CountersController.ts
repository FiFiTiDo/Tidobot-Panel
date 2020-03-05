import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import CountersModel from "../models/CountersModel";

@ModelRoutes(CountersModel, "Counter", [], "name", s => s)
export default class CountersController extends Controller {

}