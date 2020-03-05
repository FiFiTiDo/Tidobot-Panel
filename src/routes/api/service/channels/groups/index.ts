import {Router} from "express";
import GroupsController from "../../../../../controllers/GroupsController";
import {putParameter} from "../../../../../utils/functions";

export default function (router: Router) {
    let group_router = new GroupsController().getRouter();

    router.use("/", group_router);
    group_router.param("groupId", putParameter);
}