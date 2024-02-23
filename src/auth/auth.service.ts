import { CreateUserDTO, TokenizeUserType } from "@/dto.types";
import { UserType } from "@/user/schemas/user.schema";
import { UserService } from "@/user/user.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt'
import { Model } from "mongoose";
import { TokenType } from "./schemas/token.model";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, @InjectModel('User') private readonly userModel: Model<UserType>, @InjectModel('Token') private readonly tokenModel: Model<TokenType>) { }

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

    async decodeRefreshToken(token: string): Promise<TokenizeUserType | null> {
        try {
            const obj = await this.jwtService.verifyAsync(token, {
                secret: process.env.REFRESH_TOKEN_SECRET
            })
            return obj
        } catch (err) {
            return null
        }
    }



    async findTokenFromDB(token: string): Promise<TokenType | null> {
        try {
            const refreshTokenInstance = await this.tokenModel.findOne({ refreshToken: token, active: true })
            if (!refreshTokenInstance) {
                return null
            }

            return refreshTokenInstance
        } catch (err) {
            return null
        }
    }

    async deactivateRefreshToken(id: string): Promise<boolean> {
        const refreshTokenFound = await this.tokenModel.findById(id)
        if (!refreshTokenFound) {
            return false
        }
        refreshTokenFound.active = false;
        await refreshTokenFound.save()
    }

    async createAccessToken(userObj: TokenizeUserType): Promise<string | null> {
        try {
            delete userObj.exp;
            const accessToken = await this.jwtService.signAsync(userObj, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                secret: process.env.ACCESS_TOKEN_SECRET
            })

            return accessToken
        } catch (err) {
            console.log('error', err.message)
            return null
        }
    }

    async createRefreshToken(userObj: TokenizeUserType): Promise<string | null> {
        try {
            delete userObj.exp;
            const refreshToken = await this.jwtService.signAsync(userObj, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
                secret: process.env.REFRESH_TOKEN_SECRET
            })
            const tokenObj = new this.tokenModel({
                refreshToken
            })

            await tokenObj.save()
            return refreshToken
        } catch (err) {
            console.log('error2', err.message)
            return null
        }
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