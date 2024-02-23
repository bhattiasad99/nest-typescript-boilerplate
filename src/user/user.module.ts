import { AuthService } from '@/auth/auth.service';
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";

@Module({
    imports: [MongooseModule.forFeature([{
        name: 'User',
        schema: UserSchema
    }])],
    providers: [AuthService, UserService],
    controllers: [UserController]
})

export class UserModule { }