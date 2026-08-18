
const LICENSE_KEY = "VIKY-365-ABC123";
const EXPIRY_DATE = "2027-08-18T23:59:59Z";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only /vip/connect is available
    if (url.pathname !== "/vip/connect") {
      return json({
        status: false,
        message: "Endpoint not found"
      }, 404);
    }

    // Get key from URL
    let key = url.searchParams.get("key");

    // Also accept JSON POST requests
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body.key) key = body.key;
      } catch {
        // No JSON body
      }
    }

    // Check license key
    if (key !== LICENSE_KEY) {
      return json({
        status: false,
        data: {
          status: "Invalid",
          message: "Invalid license key"
        }
      }, 401);
    }

    // Check expiry
    const now = new Date();
    const expiry = new Date(EXPIRY_DATE);

    if (now >= expiry) {
      return json({
        status: false,
        data: {
          key: LICENSE_KEY,
          status: "Expired",
          expired_date: EXPIRY_DATE
        }
      }, 403);
    }

    // Valid license
    return json({
      status: true,
      data: {
        key: LICENSE_KEY,
        status: "Active",
        expired_date: "2027-08-18 23:59:59",
        device_limit: 1
      }
    });
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
