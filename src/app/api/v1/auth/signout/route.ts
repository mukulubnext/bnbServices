import { NextRequest, NextResponse } from "next/server";

export function POST(){
    const res = NextResponse.json({status: "success"});
    res.cookies.delete("token");
    return res;
}