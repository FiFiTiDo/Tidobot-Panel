import {Router} from "express";
import GroupsController from "../../../../../controllers/GroupsController";
import {putParameter} from "../../../../../utils/functions";
import ChattersController from "../../../../../controllers/ChattersController";

export default function (router: Router) {
    let chatter_router = new ChattersController().getRouter();

    router.use("/", chatter_router);
    chatter_router.param("userId", putParameter);
}