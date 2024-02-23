import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.group('This is an init logger')
        console.log(new Date().toISOString())
        const time = Date.now()
        console.log('called endpoint: ', req.originalUrl)
        console.log("Start Time: ", new Date(time).toISOString())
        console.groupEnd()
        next()
    }
}