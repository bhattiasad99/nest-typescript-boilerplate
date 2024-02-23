import { AuthService } from './auth.service';
import { UserSchema } from "@/user/schemas/user.schema";
import { UserService } from "@/user/user.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { TokenSchema } from './schemas/token.model';


@Module({
    imports: [MongooseModule.forFeature([{
        name: 'User',
        schema: UserSchema
    }, {
        name: 'Token',
        schema: TokenSchema
    }]), JwtModule.register({
        global: true
    })],
    providers: [AuthService, UserService],
    controllers: [AuthController]
})

export class AuthModule { }