/**
 * High-Performance Product Search API
 * Optimized for 10x SERP performance with caching and indexing
 */
import type { APIRoute } from "astro";
import { getWooCommerceSync } from "../../../lib/api/woocommerce-sync";

export interface SearchParams {
  q?: string; // Search query
  category?: string; // Category filter
  tag?: string; // Tag filter
  min_price?: number; // Minimum price
  max_price?: number; // Maximum price
  sort?: "name" | "price" | "date" | "popularity" | "rating";
  order?: "asc" | "desc";
  page?: number; // Page number
  per_page?: number; // Items per page
  lang?: string; // Language
  featured?: boolean; // Featured products only
}

export interface SearchResponse {
  products: any[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_more: boolean;
  filters: {
    categories: Array<{ id: number; name: string; count: number }>;
    price_range: { min: number; max: number };
    tags: Array<{ id: number; name: string; count: number }>;
  };
  search_time_ms: number;
}

/**
 * GET /api/products/search - High-performance product search
 */
export const GET: APIRoute = async ({ url }) => {
  const startTime = Date.now();

  try {
    // Parse search parameters and filter out null/undefined values
    const searchParams: SearchParams = {
      q: url.searchParams.get("q") || "",
      category: url.searchParams.get("category") || undefined,
      tag: url.searchParams.get("tag") || undefined,
      min_price: url.searchParams.get("min_price")
        ? parseFloat(url.searchParams.get("min_price")!)
        : undefined,
      max_price: url.searchParams.get("max_price")
        ? parseFloat(url.searchParams.get("max_price")!)
        : undefined,
      sort: (url.searchParams.get("sort") as any) || "name",
      order: (url.searchParams.get("order") as any) || "asc",
      page: parseInt(url.searchParams.get("page") || "1"),
      per_page: Math.min(
        parseInt(url.searchParams.get("per_page") || "20"),
        100,
      ), // Max 100 per page
      lang: url.searchParams.get("lang") || "en",
      featured: url.searchParams.get("featured") === "true",
    };

    // Clean undefined values to prevent "undefined" in URL
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(
        ([_, value]) => value !== undefined && value !== null && value !== "",
      ),
    ) as SearchParams;

    console.log("[Search API] Search params:", cleanParams);

    // Get WooCommerce sync instance
    const wooCommerceSync = getWooCommerceSync();

    // Fetch products with filters (with caching) - use cleaned params
    const allProducts = await wooCommerceSync.fetchProducts({
      per_page: 100, // Maximum allowed by WooCommerce API
      search: cleanParams.q,
      category: cleanParams.category,
      tag: cleanParams.tag,
      featured: cleanParams.featured,
      lang: cleanParams.lang || "en",
    });

    console.log(
      `[Search API] Fetched ${allProducts.length} products from WooCommerce`,
    );

    // Apply client-side filtering for better performance
    let filteredProducts = allProducts.filter((product) => {
      // Price filtering
      const price = parseFloat(product.price || "0");
      if (cleanParams.min_price && price < cleanParams.min_price) return false;
      if (cleanParams.max_price && price > cleanParams.max_price) return false;

      // Text search in name and description
      if (cleanParams.q) {
        const query = cleanParams.q.toLowerCase();
        const searchText =
          `${product.name} ${product.description} ${product.short_description}`.toLowerCase();
        if (!searchText.includes(query)) return false;
      }

      return true;
    });

    // Sorting
    filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (cleanParams.sort) {
        case "price":
          aValue = parseFloat(a.price || "0");
          bValue = parseFloat(b.price || "0");
          break;
        case "date":
          aValue = new Date(a.date_created || 0);
          bValue = new Date(b.date_created || 0);
          break;
        case "popularity":
          aValue = a.total_sales || 0;
          bValue = b.total_sales || 0;
          break;
        case "rating":
          aValue = parseFloat(a.average_rating || "0");
          bValue = parseFloat(b.average_rating || "0");
          break;
        case "name":
        default:
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
      }

      if (cleanParams.order === "desc") {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / cleanParams.per_page!);
    const startIndex = (cleanParams.page! - 1) * cleanParams.per_page!;
    const endIndex = startIndex + cleanParams.per_page!;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Generate filter data for faceted search
    const categories = new Map<
      string,
      { id: number; name: string; count: number }
    >();
    const tags = new Map<string, { id: number; name: string; count: number }>();
    let minPrice = Infinity;
    let maxPrice = 0;

    filteredProducts.forEach((product) => {
      // Categories
      product.categories?.forEach((cat) => {
        const existing = categories.get(cat.slug) || {
          id: cat.id,
          name: cat.name,
          count: 0,
        };
        existing.count++;
        categories.set(cat.slug, existing);
      });

      // Tags
      product.tags?.forEach((tag) => {
        const existing = tags.get(tag.slug) || {
          id: tag.id,
          name: tag.name,
          count: 0,
        };
        existing.count++;
        tags.set(tag.slug, existing);
      });

      // Price range
      const price = parseFloat(product.price || "0");
      if (price > 0) {
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
      }
    });

    // Prepare response
    const response: SearchResponse = {
      products: paginatedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description:
          product.short_description ||
          product.description?.substring(0, 200) + "...",
        price: product.price,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        on_sale: product.on_sale,
        image: product.images?.[0]?.src || null,
        categories:
          product.categories?.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          })) || [],
        tags:
          product.tags?.map((tag) => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
          })) || [],
        rating: parseFloat(product.average_rating || "0"),
        rating_count: product.rating_count || 0,
        permalink: product.permalink,
        featured: product.featured,
        stock_status: product.stock_status,
      })),
      total,
      page: cleanParams.page!,
      per_page: cleanParams.per_page!,
      total_pages: totalPages,
      has_more: cleanParams.page! < totalPages,
      filters: {
        categories: Array.from(categories.values()).sort(
          (a, b) => b.count - a.count,
        ),
        price_range: {
          min: minPrice === Infinity ? 0 : Math.floor(minPrice),
          max: Math.ceil(maxPrice),
        },
        tags: Array.from(tags.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 20), // Top 20 tags
      },
      search_time_ms: Date.now() - startTime,
    };

    console.log(
      `[Search API] Search completed in ${response.search_time_ms}ms, returning ${response.products.length} products`,
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600", // 5min cache, 10min stale
        "X-Search-Time": `${response.search_time_ms}ms`,
        "X-Total-Results": total.toString(),
      },
    });
  } catch (error: any) {
    console.error("[Search API] Search error:", error);

    return new Response(
      JSON.stringify({
        error: "Search failed",
        message: error.message,
        search_time_ms: Date.now() - startTime,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

/**
 * POST /api/products/search - Batch search for multiple queries
 */
export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const startTime = Date.now();

  try {
    const { queries } = await request.json();

    if (!Array.isArray(queries) || queries.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid queries array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Limit batch size for performance
    if (queries.length > 10) {
      return new Response(
        JSON.stringify({ error: "Maximum 10 queries per batch" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const results = await Promise.all(
      queries.map(async (query: SearchParams) => {
        try {
          // Create a fake URL for parameter parsing
          const url = new URL("http://localhost/api/products/search");
          Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              url.searchParams.set(key, value.toString());
            }
          });

          // Call the GET function internally
          const response = await GET({ url } as any);
          return await response.json();
        } catch (error) {
          console.error("Batch query error:", error);
          return { products: [], total: 0, error: "Query failed" };
        }
      }),
    );

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("Batch processing error:", error);
    return new Response(
      JSON.stringify({
        error: "Batch search failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
