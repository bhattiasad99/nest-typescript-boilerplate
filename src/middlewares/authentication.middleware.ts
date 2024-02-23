import { UserService } from "@/user/user.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    private userService: UserService
    constructor(userService: UserService) {
        this.userService = userService
    }
    use(req: Request, res: Response, next: NextFunction) {
        console.log({ req })
        // const user = this.userService.getUser('user')
        // req.user = user;
        next()
    }
}