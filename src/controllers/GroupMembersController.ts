import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import UserPermissionsModel from "../models/UserPermissionsModel";
import GroupPermissionsModel from "../models/GroupPermissionsModel";
import GroupMembersModel from "../models/GroupMembersModel";

@ModelRoutes(GroupMembersModel, "Group member", ["update"], "user_id", s => parseInt(s), "groupId")
export default class GroupMembersController extends Controller {

}