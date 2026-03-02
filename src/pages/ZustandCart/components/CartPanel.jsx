import React from "react";
import useCartStore from "../store/useCartStore";
import CartItemRow from "./CartItemRow";

const CartPanel = () => {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3 h-fit">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          🛒 Cart{" "}
          {totalQty > 0 && (
            <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              {totalQty}
            </span>
          )}
        </h2>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-700 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          Your cart is empty. Add some products!
        </p>
      ) : (
        <>
          <div>
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold text-blue-600">
              ${total.toFixed(2)}
            </span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
            Checkout →
          </button>
        </>
      )}
    </div>
  );
};

export default CartPanel;
