import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import UserModel from "../models/UserModel";

@ModelRoutes(UserModel, "User", ["create", "delete"], "user_id", s => s)
export default class UsersController extends Controller {
}