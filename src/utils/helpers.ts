import { HttpException } from "@nestjs/common";
import { serverError } from "./responses";

export const catchBlock = (err: any) => {
    if (err instanceof HttpException) {
        throw err; // Let HttpExceptionFilter handle HTTP exceptions
    }

    return serverError(err.message)
}

export function removePrefix(inputString: string, prefix: string) {
    if (inputString.startsWith(prefix)) {
        return inputString.slice(prefix.length);
    }
    return inputString;
}