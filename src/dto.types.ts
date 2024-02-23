import { UnifiedResponseType } from "./utils/responses";

export class CreateUserDTO {
    username: string;
    password: string;
    role?: 'admin' | 'user';
}

export class RefreshTokenDTO {
    refreshToken: string;
}

export class LoginDTO {
    username: string;
    password: string;
}

export class CreateToDoDTO {
    action: string;
    complete?: boolean;
    createdBy?: string;
}

export class TokenPayload {
    accessToken: string;
    refreshToken: string
}

export class TokenizeUserType {
    id: string;
    username: string;
    role?: 'admin' | 'user';
    exp?: any;
}

export type AsyncResponseStructure<PayloadType> = Promise<UnifiedResponseType<PayloadType>>