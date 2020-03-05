import {Router} from "express";
import ChannelsController from "../../../../controllers/ChannelsController";
import {putParameter, route_namespace} from "../../../../utils/functions";
import CommandController from "../../../../controllers/CommandController";
import SettingsController from "../../../../controllers/SettingsController";
import PermissionController from "../../../../controllers/PermissionController";
import ListsController from "../../../../controllers/ListsController";
import NewsController from "../../../../controllers/NewsController";
import CountersController from "../../../../controllers/CountersController";
import ChattersRoutes from "./chatters"
import GroupsRoutes from "./groups"

export default function (router: Router) {
    let channel_router = new ChannelsController().getRouter();

    router.use("/", channel_router);
    channel_router.param("channel", putParameter);
    route_namespace("/:channel/chatters", channel_router, ChattersRoutes);
    route_namespace("/:channel/groups", channel_router, GroupsRoutes);
    channel_router.use("/:channel/commands", new CommandController().getRouter());
    channel_router.use("/:channel/settings", new SettingsController().getRouter());
    channel_router.use("/:channel/permissions", new PermissionController().getRouter());
    channel_router.use("/:channel/lists", new ListsController().getRouter());
    channel_router.use("/:channel/news", new NewsController().getRouter());
    channel_router.use("/:channel/counters", new CountersController().getRouter());
}