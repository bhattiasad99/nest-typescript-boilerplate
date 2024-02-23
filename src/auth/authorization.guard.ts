import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

export class AuthorizationGuard implements CanActivate {
    private readonly allowedRoles: string[];
    constructor(allowedRoles: string[]) {
        this.allowedRoles = allowedRoles
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest()

        const user = request['user']

        if (!user) {
            return false
        }

        const userRole = user.role;

        const userIsAuthorized = this.allowedRoles.includes(userRole)

        // get user from the request and then tally the roles from the roles array
        return userIsAuthorized
    }
}