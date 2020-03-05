import {Router} from "express";
import {route_namespace} from "../utils/functions";
import ApiRoutes from "./api"

export default function (router: Router) {
    route_namespace("/api", router, ApiRoutes);
}