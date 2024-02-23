import { CreateUserDTO } from "@/dto.types";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserType } from "./schemas/user.schema";

@Injectable()
export class UserService {
    private readonly users: CreateUserDTO[];

    constructor(@InjectModel('User') private readonly userModel: Model<UserType>) { }

    getAllUsers(role: CreateUserDTO['role']): CreateUserDTO[] | string {
        if (role) {
            return this.users.filter(eachUser => eachUser.role === role);
        }

        return this.users;
    }

    async getUserByUsername(username: string): Promise<UserType | undefined> {
        const user = await this.userModel.findOne({ username })
        return user;
    }
}