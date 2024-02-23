import { AsyncResponseStructure, CreateUserDTO, LoginDTO, TokenPayload } from "@/dto.types";
import { UserService } from "@/user/user.service";
import { catchBlock } from "@/utils/helpers";
import { Body, Controller, Post } from "@nestjs/common";
import { validateLogin } from "./auth.validator";
import { clientError, success } from "@/utils/responses";
import { STATUS_CODES } from "@/config/constants";
import { validateCreateUser } from "@/user/user.validator";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    private userService: UserService;
    private authService: AuthService
    constructor(userService: UserService, authService: AuthService) {
        this.userService = userService;
        this.authService = authService
    }

    // Public
    @Post('register')
    async createNewUser(@Body() createUserDto: CreateUserDTO): AsyncResponseStructure<string> {
        try {
            const { error } = validateCreateUser(createUserDto)
            if (error) {
                return clientError("00004", STATUS_CODES.CLIENT_EXCEPTION.VALIDATION, error.details[0].message)
            }

            const userAlreadyExists = await this.userService.getUserByUsername(createUserDto.username)
            if (userAlreadyExists) {
                return clientError("00008", STATUS_CODES.CLIENT_EXCEPTION.CONFLICT)
            }

            await this.authService.createUser(createUserDto);

            return success("00002")
        } catch (err) {
            return catchBlock(err)
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDTO): AsyncResponseStructure<TokenPayload | string> {
        try {
            const { error } = validateLogin(loginDto)
            if (error) {
                return clientError("00012", STATUS_CODES.CLIENT_EXCEPTION.VALIDATION, error.details[0].message)
            }
            const userInformation = await this.userService.getUserByUsername(loginDto.username)
            if (!userInformation) {
                return clientError("00012", STATUS_CODES.CLIENT_EXCEPTION.NOT_FOUND)
            }

            const passwordMatched = await this.authService.comparePassword(loginDto.password, userInformation.password)

            if (!passwordMatched) {
                return clientError("00012", STATUS_CODES.CLIENT_EXCEPTION.NOT_FOUND)
            }

            const accessToken = await this.authService.createAccessToken({
                id: userInformation.id,
                username: userInformation.username,
                role: userInformation.role
            })

            return success("00007", {
                accessToken,
                refreshToken: ''
            })
        } catch (err) {
            return catchBlock(err)
        }
    }
}
