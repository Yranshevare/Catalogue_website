import { NextResponse } from "next/server";

type Response = {
    status: number;
    message?: string;
    error?: any;
    data?: any;
};


export default function response({message,status,error,data}:Response) {
    return NextResponse.json({message,error,data},{status})
}