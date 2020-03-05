import {Database, OPEN_CREATE, OPEN_READWRITE} from "sqlite3";
import * as winston from "winston";
import * as path from "path";
import {error_format} from "./utils/functions";
import {Application} from "express";
import express from "express";
import HttpStatusView from "./views/HttpStatusView";
import AllRoutes from "./routes"
require('winston-daily-rotate-file');

export default class Server {
    private static database: Database;
    private static logger: winston.Logger;
    private static app: Application;
    public static getDatabase(): Database {
        return this.database;
    }

    public static getLogger(): winston.Logger {
        return this.logger;
    }

    constructor() {
        Server.database = new Database(path.join(process.cwd(), process.env.DATABASE_FILE), OPEN_READWRITE | OPEN_CREATE);
        Server.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                error_format()
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }),
                new (winston.transports as any).DailyRotateFile({
                    filename: 'logs/application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: winston.format.json()
                }),
            ]
        });
        Server.app = express();
    }

    init() {
        AllRoutes(Server.app);
        Server.app.use(function (err, req, res, next) {
            Server.logger.error("Unable to serve page due to an error", { cause: err });
            new HttpStatusView(500, "Internal server error.").render(res);
        });
        Server.app.use((req, res) => {
           new HttpStatusView(404, "Page not found.").render(res);
        });
    }

    start() {
        let port = 3000 || process.env.PORT;
        Server.app.listen(port, () => Server.logger.info(`Now listening on port ${port}.`));
    }
}