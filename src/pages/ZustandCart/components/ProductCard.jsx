import React from "react";
import useCartStore from "../store/useCartStore";

const ProductCard = ({ product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.find((i) => i.id === product.id);

  return (
    <div className="border rounded-xl p-4 flex flex-col gap-2 shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="text-4xl text-center">{product.emoji}</div>
      <h3 className="font-semibold text-gray-800 text-center">
        {product.name}
      </h3>
      <p className="text-blue-600 font-bold text-center">
        ${product.price.toFixed(2)}
      </p>
      <button
        onClick={() => addItem(product)}
        className={`mt-auto py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          inCart
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {inCart ? `✓ In Cart (${inCart.qty})` : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;
