import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showDescription: {
      control: { type: 'boolean' },
    },
    showPrice: {
      control: { type: 'boolean' },
    },
    showAddToCart: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample product data
const sampleProduct = {
  id: 1,
  name: 'KNX Smart Switch',
  slug: 'knx-smart-switch',
  permalink: 'https://example.com/product/knx-smart-switch',
  date_created: '2024-01-15T10:00:00',
  date_created_gmt: '2024-01-15T10:00:00',
  date_modified: '2024-01-15T10:00:00',
  date_modified_gmt: '2024-01-15T10:00:00',
  type: 'simple',
  status: 'publish',
  featured: false,
  catalog_visibility: 'visible',
  description: 'Professional KNX smart switch for building automation systems. Features advanced control capabilities and seamless integration.',
  short_description: 'Professional KNX smart switch for building automation.',
  sku: 'KNX-SW-001',
  price: '299.99',
  regular_price: '349.99',
  sale_price: '299.99',
  date_on_sale_from: null,
  date_on_sale_from_gmt: null,
  date_on_sale_to: null,
  date_on_sale_to_gmt: null,
  price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>299.99</bdi></span>',
  on_sale: true,
  purchasable: true,
  total_sales: 45,
  virtual: false,
  downloadable: false,
  downloads: [],
  download_limit: -1,
  download_expiry: -1,
  external_url: '',
  button_text: '',
  tax_status: 'taxable',
  tax_class: '',
  manage_stock: true,
  stock_quantity: 25,
  stock_status: 'instock',
  backorders: 'no',
  backorders_allowed: false,
  backordered: false,
  sold_individually: false,
  weight: '0.5',
  dimensions: {
    length: '10',
    width: '5',
    height: '3',
  },
  shipping_required: true,
  shipping_taxable: true,
  shipping_class: '',
  shipping_class_id: 0,
  reviews_allowed: true,
  average_rating: '4.8',
  rating_count: 12,
  related_ids: [],
  upsell_ids: [],
  cross_sell_ids: [],
  parent_id: 0,
  purchase_note: '',
  categories: [
    {
      id: 1,
      name: 'KNX Products',
      slug: 'knx-products',
      parent: 0,
      description: 'KNX building automation products',
      display: 'default',
      image: null,
      menu_order: 0,
      count: 15,
      _links: {},
    },
  ],
  tags: [
    {
      id: 1,
      name: 'Smart Home',
      slug: 'smart-home',
      description: 'Smart home automation products',
      count: 8,
      _links: {},
    },
  ],
  images: [
    {
      id: 1,
      date_created: '2024-01-15T10:00:00',
      date_created_gmt: '2024-01-15T10:00:00',
      date_modified: '2024-01-15T10:00:00',
      date_modified_gmt: '2024-01-15T10:00:00',
      src: 'https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=KNX+Switch',
      name: 'KNX Smart Switch',
      alt: 'KNX Smart Switch',
    },
  ],
  attributes: [],
  default_attributes: [],
  variations: [],
  grouped_products: [],
  menu_order: 0,
  meta_data: [],
  _links: {},
};

const expensiveProduct = {
  ...sampleProduct,
  id: 2,
  name: 'Premium KNX Gateway',
  slug: 'premium-knx-gateway',
  price: '1299.99',
  regular_price: '1299.99',
  sale_price: '',
  on_sale: false,
  images: [
    {
      ...sampleProduct.images[0],
      src: 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=KNX+Gateway',
      name: 'Premium KNX Gateway',
      alt: 'Premium KNX Gateway',
    },
  ],
};

const noImageProduct = {
  ...sampleProduct,
  id: 3,
  name: 'KNX Sensor Module',
  slug: 'knx-sensor-module',
  price: '89.99',
  regular_price: '89.99',
  sale_price: '',
  on_sale: false,
  images: [],
};

export const Default: Story = {
  args: {
    product: sampleProduct,
    showDescription: true,
    showPrice: true,
    showAddToCart: true,
  },
};

export const OnSale: Story = {
  args: {
    product: sampleProduct,
    showDescription: true,
    showPrice: true,
    showAddToCart: true,
  },
};

export const ExpensiveProduct: Story = {
  args: {
    product: expensiveProduct,
    showDescription: true,
    showPrice: true,
    showAddToCart: true,
  },
};

export const NoImage: Story = {
  args: {
    product: noImageProduct,
    showDescription: true,
    showPrice: true,
    showAddToCart: true,
  },
};

export const NoDescription: Story = {
  args: {
    product: sampleProduct,
    showDescription: false,
    showPrice: true,
    showAddToCart: true,
  },
};

export const NoPrice: Story = {
  args: {
    product: sampleProduct,
    showDescription: true,
    showPrice: false,
    showAddToCart: true,
  },
};

export const NoAddToCart: Story = {
  args: {
    product: sampleProduct,
    showDescription: true,
    showPrice: true,
    showAddToCart: false,
  },
};

export const Minimal: Story = {
  args: {
    product: sampleProduct,
    showDescription: false,
    showPrice: true,
    showAddToCart: false,
  },
}; 