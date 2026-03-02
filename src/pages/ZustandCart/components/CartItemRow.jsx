import React from "react";
import useCartStore from "../store/useCartStore";

const CartItemRow = ({ item }) => {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0">
      <span className="text-2xl">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{item.name}</p>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() =>
            item.qty > 1
              ? updateQty(item.id, item.qty - 1)
              : removeItem(item.id)
          }
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 flex items-center justify-center"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold">{item.qty}</span>
        <button
          onClick={() => updateQty(item.id, item.qty + 1)}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 flex items-center justify-center"
        >
          +
        </button>
      </div>
      <p className="w-16 text-right font-semibold text-gray-800">
        ${(item.price * item.qty).toFixed(2)}
      </p>
      <button
        onClick={() => removeItem(item.id)}
        className="text-red-400 hover:text-red-600 ml-1"
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItemRow;
