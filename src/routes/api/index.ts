import express, {Router} from "express";
import {putParameter, route_namespace} from "../../utils/functions";
import ServiceRoutes from "./service"

export default function (router: Router) {
    router.use(express.json());
    router.param("service", putParameter);
    route_namespace("/:service", router, ServiceRoutes);
}