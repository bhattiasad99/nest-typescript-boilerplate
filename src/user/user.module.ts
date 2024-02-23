import { AuthService } from '@/auth/auth.service';
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { AuthModule } from '@/auth/auth.module';
import { TokenSchema } from '@/auth/schemas/token.model';

@Module({
    imports: [MongooseModule.forFeature([{
        name: 'User',
        schema: UserSchema
    }, {
        name: 'Token',
        schema: TokenSchema
    }]), AuthModule],
    providers: [AuthService, UserService],
    controllers: [UserController]
})

export class UserModule { }