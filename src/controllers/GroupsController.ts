import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import GroupsModel from "../models/GroupsModel";

@ModelRoutes(GroupsModel, "Group", ["update"])
export default class GroupsController extends Controller {
}