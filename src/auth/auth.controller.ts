import { AsyncResponseStructure, CreateUserDTO, LoginDTO, RefreshTokenDTO, TokenPayload } from "@/dto.types";
import { UserService } from "@/user/user.service";
import { catchBlock } from "@/utils/helpers";
import { Body, Controller, Post } from "@nestjs/common";
import { validateLogin } from "./auth.validator";
import { clientError, success } from "@/utils/responses";
import { STATUS_CODES } from "@/config/constants";
import { validateCreateUser, validateRefreshToken } from "@/user/user.validator";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    private userService: UserService;
    private authService: AuthService
    constructor(userService: UserService, authService: AuthService) {
        this.userService = userService;
        this.authService = authService
    }

    @Post('refresh')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDTO): AsyncResponseStructure<TokenPayload | string> {
        const { error } = validateRefreshToken(refreshTokenDto)
        if (error) {
            return clientError("00004", STATUS_CODES.CLIENT_EXCEPTION.VALIDATION, error.details[0].message)
        }

        const token = await this.authService.findTokenFromDB(refreshTokenDto.refreshToken)
        if (!token) {
            return clientError("00013", STATUS_CODES.CLIENT_EXCEPTION.NOT_FOUND)
        }

        const isActive = token.active;

        if (!isActive) {
            return clientError("00005", STATUS_CODES.CLIENT_EXCEPTION.UNAUTHORIZED)
        }

        const userObj = await this.authService.decodeRefreshToken(token.refreshToken)
        const newAccessToken = await this.authService.createAccessToken(userObj)
        const newRefreshToken = await this.authService.createRefreshToken(userObj)
        await this.authService.deactivateRefreshToken(token.id)
        return success("00007", {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
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

            const refreshToken = await this.authService.createRefreshToken({
                id: userInformation.id,
                username: userInformation.username,
                role: userInformation.role
            })

            return success("00007", {
                accessToken,
                refreshToken
            })
        } catch (err) {
            return catchBlock(err)
        }
    }
}
