import { NextRequest, NextResponse } from "next/server";
import { publicConfig } from "@/config/public-config";

// Cache for 1 hour - query strings create separate cache entries
export const revalidate = 3600;

const { heroImageUrl, imageUrl } = publicConfig;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const directImageUrl = type === "og" ? heroImageUrl : imageUrl;
  return NextResponse.redirect(directImageUrl, {
    status: 302,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
