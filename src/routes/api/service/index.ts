import {Router} from "express";
import {route_namespace} from "../../../utils/functions";
import UsersController from "../../../controllers/UsersController";
import ChannelRoutes from "./channels"

export default function (router: Router) {
    route_namespace("/channels", router, ChannelRoutes);
    router.use("/users", new UsersController().getRouter());
}