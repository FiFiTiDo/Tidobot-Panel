import Controller from "./Controller";
import {ModelRoutes} from "../decorators/methods";
import ChannelModel from "../models/ChannelModel";

@ModelRoutes(ChannelModel, "Channel", ["create", "delete"], "name", s => s)
export default class ChannelsController extends Controller {
}