import {Router} from "express";
import GroupsController from "../../../../../controllers/GroupsController";
import {putParameter} from "../../../../../utils/functions";
import GroupPermissionsController from "../../../../../controllers/GroupPermissionsController";
import GroupMembersController from "../../../../../controllers/GroupMembersController";

export default function (router: Router) {
    let group_router = new GroupsController().getRouter();

    router.use("/", group_router);
    group_router.param("groupId", putParameter);
    group_router.use("/:groupId/permissions", new GroupPermissionsController().getRouter());
    group_router.use("/:groupId/members", new GroupMembersController().getRouter());
}