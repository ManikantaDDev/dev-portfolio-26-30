import { ReturnSuccessResponse } from "../../models/response/response_models";

export async function POST(NextRequest: Request) {
    // const body = await NextRequest.json();
    // console.log("Received registration data:", body);
    return ReturnSuccessResponse(null, "Registration successful. Please check your email to confirm your account.");
}