import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import NewsModel from "../models/NewsModel";

@ModelRoutes(NewsModel, "News item")
export default class NewsController extends Controller {

}