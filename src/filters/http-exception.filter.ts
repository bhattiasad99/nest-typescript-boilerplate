import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const status = exception.getStatus();
        const message = exception.getResponse()
        const responsePayload = {
            error: true,
            statusCode: status,
            dateTime: new Date(),
            message: ''
        }
        if (typeof message === 'string') {
            responsePayload.message = message
        } else {
            responsePayload.message = message['message']
        }
        response.status(status).json(responsePayload)
    }

}