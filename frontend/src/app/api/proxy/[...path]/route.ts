import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] }
) {
  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  // Get request body if present
  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = await request.text();
    } catch {
      // No body
    }
  }

  // Forward cookies from the incoming request
  const cookieHeader = request.headers.get("cookie");

  // Forward Authorization header if present
  const authHeader = request.headers.get("Authorization");

  // Make request to backend
  const response = await fetch(url, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: body || undefined,
  });

  // Get response body
  const responseBody = await response.text();

  // Create response with same status and headers
  const nextResponse = new NextResponse(responseBody, {
    status: response.status,
    statusText: response.statusText,
  });

  // Copy content-type header
  const contentType = response.headers.get("content-type");
  if (contentType) {
    nextResponse.headers.set("Content-Type", contentType);
  }

  // Forward set-cookie headers from backend to client
  const setCookieHeaders = response.headers.getSetCookie();
  for (const cookie of setCookieHeaders) {
    nextResponse.headers.append("Set-Cookie", cookie);
  }

  return nextResponse;
}
