import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import PermissionModel from "../models/PermissionModel";

@ModelRoutes(PermissionModel, "Permission", [], "permission", s => s)
export default class PermissionController extends Controller {
}