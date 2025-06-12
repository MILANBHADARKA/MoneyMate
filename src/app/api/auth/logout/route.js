import { clearTokenCookie } from "@/lib/cookies";

export async function POST(req) {
  try {
    const cookie = clearTokenCookie();

    return new Response(JSON.stringify({
      success: true,
      message: "Logged out successfully"
    }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie
      }
    });

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
  }
}
