import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import UserPermissionsModel from "../models/UserPermissionsModel";
import GroupPermissionsModel from "../models/GroupPermissionsModel";

@ModelRoutes(GroupPermissionsModel, "Group permission", [], "permission", s => s, "groupId")
export default class GroupPermissionsController extends Controller {

}