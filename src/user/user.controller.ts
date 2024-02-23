import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AsyncResponseStructure, CreateUserDTO } from '@/dto.types';
import { UserService } from './user.service';
import { clientError, success } from '@/utils/responses';
import { STATUS_CODES } from '@/config/constants';
import { validateFindUser } from './user.validator';
import { AuthenticationGuard } from '@/auth/authentication.guard';
import { catchBlock } from '@/utils/helpers';
import { AuthorizationGuard } from '@/auth/authorization.guard';
import { UserType } from './schemas/user.schema';

@Controller('user')
export class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService
    }

    @Get()
    @UseGuards(AuthenticationGuard, new AuthorizationGuard(['admin']))
    async getAllUsers(@Query('role') role: CreateUserDTO['role']): AsyncResponseStructure<string | CreateUserDTO[]
    > {
        try {
            if (role && (role !== 'admin' && role !== 'user')) {
                return clientError('00006', STATUS_CODES.CLIENT_EXCEPTION.UNAUTHORIZED, `Provided: ${role}`);
            }

            const users = this.userService.getAllUsers(role);
            return success("00007", users)
        } catch (err) {
            return catchBlock(err)
        }
    }

    @Get(':username')
    @UseGuards(AuthenticationGuard, new AuthorizationGuard(['user', 'admin']))
    async findOne(@Param('username') params: string): AsyncResponseStructure<UserType | string> {
        try {
            const { error } = validateFindUser({ username: params })
            if (error) {
                return clientError("00004", STATUS_CODES.CLIENT_EXCEPTION.NOT_FOUND, error.details[0].message)
            }
            const user = await this.userService.getUserByUsername(params)
            if (!user) {
                return clientError("00009", STATUS_CODES.CLIENT_EXCEPTION.NOT_FOUND)
            }
            return success("00007", user)
        } catch (err) {
            return catchBlock(err)
        }
    }
}
