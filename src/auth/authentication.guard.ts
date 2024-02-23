import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private authService: AuthService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers[process.env.AUTH_HEADER]
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            return false
        }

        const userDetails = await this.authService.decodeAccessToken(token)

        if (!userDetails) {
            return false
        }

        // get user and add to request['user']
        request['user'] = {
            ...userDetails
        }
        return true
    }
}