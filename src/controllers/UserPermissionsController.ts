import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import UserPermissionsModel from "../models/UserPermissionsModel";

@ModelRoutes(UserPermissionsModel, "User permission", [], "permission", s => s, "userId")
export default class UserPermissionsController extends Controller {

}