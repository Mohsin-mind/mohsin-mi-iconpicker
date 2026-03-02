import React from "react";
import ProductCard from "./components/ProductCard";
import CartPanel from "./components/CartPanel";
import StoreDebug from "./components/StoreDebug";

// ─── Static data (could live in a separate constants/products.js file) ────────
const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 59.99, emoji: "🎧" },
  { id: 2, name: "Mechanical Keyboard", price: 89.99, emoji: "⌨️" },
  { id: 3, name: "USB-C Hub", price: 34.99, emoji: "🔌" },
  { id: 4, name: "Webcam HD", price: 49.99, emoji: "📷" },
  { id: 5, name: "Mouse Pad XL", price: 19.99, emoji: "🖱️" },
];

const ZustandCart = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto w-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Zustand — Shopping Cart Example
        </h1>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products */}
        <div className="md:col-span-2">
          <h2 className="font-semibold text-gray-700 mb-3">Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Cart */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Your Cart</h2>
          <CartPanel />
        </div>
      </div>

      {/* Debug */}
      <div className="mt-6">
        <StoreDebug />
      </div>
    </div>
  );
};

export default ZustandCart;
