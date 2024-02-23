import { STATUS_CODES } from "src/config/constants"
import buildResponse from "./responseHelpers";
import { HttpException } from "@nestjs/common";

export type UnifiedResponseType<T = any> = {
    payload?: T;
    message: string;
    error: boolean;
    statusCode: number;
    dateTime: Date;
    length?: number;
};

export const log = async<M = any>(dataObj: UnifiedResponseType<M>): Promise<void> => {
    console.group('End point complete!')
    console.log("End Time: ", new Date().toISOString())
    console.log({ dataObj })
    console.groupEnd()
}

export const success = <T>(responseCode: string = "00007", payload?: T | undefined, created = false,): UnifiedResponseType<T> => {
    const responseMessage = buildResponse(responseCode) ? buildResponse(responseCode) : responseCode;
    const responseObj: UnifiedResponseType<T> = {
        payload, message: responseMessage, error: false, statusCode: created ? STATUS_CODES.SUCCESS.CREATED : STATUS_CODES.SUCCESS.OK, dateTime: new Date()
    }
    if (Array.isArray(payload)) {
        responseObj.length = payload.length
    }
    log(responseObj)
    return responseObj
}

export const serverError = <T>(payload: T): UnifiedResponseType<T> => {
    const responseMessage = buildResponse("00003");
    const responseObj = {
        payload, message: responseMessage, error: true, statusCode: 500, dateTime: new Date()
    }
    log(responseObj)
    throw new HttpException(responseObj.message, responseObj.statusCode)
}

export const clientError = <T>(responseCode: string, statusCode: number, payload?: T | undefined): UnifiedResponseType<T> => {
    const responseMessage = buildResponse(responseCode) ? buildResponse(responseCode) : responseCode || buildResponse('00004');
    const responseObj = {
        payload, message: responseMessage, error: true, statusCode: statusCode, dateTime: new Date()
    }

    log(responseObj)
    throw new HttpException(responseObj.message, responseObj.statusCode)
}
