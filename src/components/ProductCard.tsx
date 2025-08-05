import React from 'react';
import type { WooCommerceProduct } from '../lib/api/woocommerce';

export interface ProductCardProps {
  product: WooCommerceProduct;
  showDescription?: boolean;
  showPrice?: boolean;
  showAddToCart?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showDescription = true,
  showPrice = true,
  showAddToCart = true,
  className = '',
}) => {
  // Extract product data
  const {
    id,
    name,

    short_description,
    description,
    price,
    regular_price,
    sale_price,
    on_sale,
    images,
  } = product;

  // Format content
  const formattedDescription = showDescription 
    ? (short_description || description || '').replace(/<[^>]*>/g, '').substring(0, 120)
    : '';

  // Get product image
  const productImage = images && images.length > 0 
    ? images[0].src 
    : '/placeholder-product.jpg';

  // Price display
  const displayPrice = on_sale && sale_price ? sale_price : price;
  const originalPrice = on_sale ? regular_price : null;

  // Format price
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '';
    return `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={productImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {on_sale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {name}
          </h3>

          {/* Product Description */}
          {showDescription && formattedDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {formattedDescription}
            </p>
          )}

          {/* Price */}
          {showPrice && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(displayPrice)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          {showAddToCart && (
            <div className="mt-auto">
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                data-track-event="add_to_cart"
                data-track-category="ecommerce"
                data-track-label={name}
                data-product-id={id}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 