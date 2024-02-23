import { CreateUserDTO, TokenizeUserType } from "@/dto.types";
import { UserType } from "@/user/schemas/user.schema";
import { UserService } from "@/user/user.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt'
import { Model } from "mongoose";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, @InjectModel('User') private readonly userModel: Model<UserType>) { }

    async createUser(userInfo: CreateUserDTO): Promise<UserType | undefined> {
        const password = await this.hashPassword(userInfo.password)
        const newUser = {
            password: password,
            role: userInfo.role ? userInfo.role : 'user',
            username: userInfo.username
        }
        const newUserInstance = new this.userModel(newUser)
        const user = await newUserInstance.save()
        if (user) {
            return user
        } else return undefined
    }

    async decodeAccessToken(token: string): Promise<TokenizeUserType | null> {
        try {
            const obj = await this.jwtService.verifyAsync(token, {
                secret: process.env.ACCESS_TOKEN_SECRET
            })
            return obj
        } catch (err) {
            return null
        }
    }

    async createAccessToken(userObj: TokenizeUserType): Promise<string> {
        const accessToken = await this.jwtService.signAsync(userObj, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            secret: process.env.ACCESS_TOKEN_SECRET
        })
        return accessToken
    }

    async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch
    }
}