import {Router} from "express";
import {putParameter} from "../../../../../utils/functions";
import ChattersController from "../../../../../controllers/ChattersController";
import UserPermissionsController from "../../../../../controllers/UserPermissionsController";

export default function (router: Router) {
    let chatter_router = new ChattersController().getRouter();

    router.use("/", chatter_router);
    chatter_router.param("userId", putParameter);
    chatter_router.use("/:userId/permissions", new UserPermissionsController().getRouter());
}