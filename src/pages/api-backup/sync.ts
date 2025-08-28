import type { APIRoute } from "astro";
import { getWooCommerceSync } from "../../lib/api/woocommerce-sync";

export const prerender = false;

// Note: Auto-sync initialization removed to prevent build issues
// Auto-sync will be triggered on first API call instead

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "sync";

    const sync = getWooCommerceSync();

    switch (action) {
      case "sync": {
        // Manual sync
        console.log("[WooCommerce Sync API] Manual sync requested");
        const products = await sync.fetchProducts();
        const status = await sync.getSyncStatus();

        return new Response(
          JSON.stringify({
            success: true,
            action: "sync",
            productsCount: products.length,
            status,
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        );
      }

      case "status": {
        // Get sync status
        const syncStatus = await sync.getSyncStatus();

        return new Response(
          JSON.stringify({
            success: true,
            action: "status",
            status: syncStatus,
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        );
      }

      case "health": {
        // Health check
        const isHealthy = await sync.healthCheck();

        return new Response(
          JSON.stringify({
            success: isHealthy,
            action: "health",
            healthy: isHealthy,
            timestamp: new Date().toISOString(),
          }),
          {
            status: isHealthy ? 200 : 503,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        );
      }

      case "start": {
        // Start auto sync
        sync.startAutoSync();

        return new Response(
          JSON.stringify({
            success: true,
            action: "start",
            message: "Auto sync started",
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        );
      }

      case "stop": {
        // Stop auto sync
        sync.stopAutoSync();

        return new Response(
          JSON.stringify({
            success: true,
            action: "stop",
            message: "Auto sync stopped",
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        );
      }

      default: {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid action",
            validActions: ["sync", "status", "health", "start", "stop"],
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
    }
  } catch (error: any) {
    console.error("[WooCommerce Sync API] Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, params } = body;

    const sync = getWooCommerceSync();

    switch (action) {
      case "sync": {
        // Sync with custom parameters
        const products = await sync.fetchProducts(params);
        const status = await sync.getSyncStatus();

        return new Response(
          JSON.stringify({
            success: true,
            action: "sync",
            productsCount: products.length,
            status,
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        );
      }

      default: {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid action",
            validActions: ["sync"],
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
    }
  } catch (error: any) {
    console.error("[WooCommerce Sync API] POST Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};

// Note: Process cleanup handlers removed for Vercel compatibility
