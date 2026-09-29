import { NextResponse } from "next/server";

export interface BasicResponseModel<T = null> {
  success: boolean;
  message: string;
  data?: T | null;
  error?: string | null;
}


export async function ReturnResponse<T = null>(data: T | null, message: string, success: boolean = true, error: string | null = null) {
    const response: BasicResponseModel<T> = {
        success,
        message,
        data,
        error
    };
    return NextResponse.json(response);
}

// DEFINE A FUNCTION TO RETURN A SUCCESS RESPONSE
export async function ReturnSuccessResponse<T = null>(data: T | null, message: string) {
    return ReturnResponse(data, message, true, null);
}

// DEFINE A FUNCTION TO RETURN AN ERROR RESPONSE
export async function ReturnErrorResponse<T = null>(data: T | null, message: string, error: string) {
    return ReturnResponse(data, message, false, error);
}

// DEFINE A FUNCTION TO RETURN A NOT FOUND RESPONSE
export async function ReturnNotFoundResponse<T = null>(data: T | null, message: string) {
    return ReturnResponse(data, message, false, "Not Found");
}

// DEFINE A FUNCTION TO RETURN A UNAUTHORIZED RESPONSE
export async function ReturnUnauthorizedResponse<T = null>(data: T | null, message: string) {
    return ReturnResponse(data, message, false, "Unauthorized");
}

// DEFINE A FUNCTION TO RETURN A FORBIDDEN RESPONSE
export async function ReturnForbiddenResponse<T = null>(data: T | null, message: string) {
    return ReturnResponse(data, message, false, "Forbidden");
}

// DEFINE A FUNCTION TO RETURN A BAD REQUEST RESPONSE
export async function ReturnBadRequestResponse<T = null>(data: T | null, message: string) {
    return ReturnResponse(data, message, false, "Bad Request");
}

// DEFINE A FUNCTION TO RETURN A INTERNAL SERVER ERROR RESPONSE
export async function ReturnInternalServerErrorResponse<T = null>(data: T | null, message: string) {
    return ReturnResponse(data, message, false, "Internal Server Error");
}

// DEFINE A FUNCTION TO RETURN A SERVICE UNAVAILABLE RESPONSE
export async function ReturnServiceUnavailableResponse<T = null>(data: T | null, message: string) {
    return ReturnResponse(data, message, false, "Service Unavailable");
}

// DEFINE A FUNCTION TO RETURN A GATEWAY TIMEOUT RESPONSE
export async function ReturnGatewayTimeoutResponse<T = null>(data: T | null, message: string) {
    return ReturnResponse(data, message, false, "Gateway Timeout");
}
