import React, { useState, useEffect } from "react";
import useCartStore from "../store/useCartStore";

const STORAGE_KEY = "cart-storage";

/**
 * StoreDebug — shows both the live Zustand state and the persisted
 * localStorage value so you can verify persistence is working.
 *
 * NOTE: We select `items` directly (not wrapped in an object literal) to avoid
 * creating a new reference on every render, which would cause an infinite loop
 * with Zustand's default reference-equality check.
 */
const StoreDebug = () => {
  const items = useCartStore((s) => s.items);
  const [persisted, setPersisted] = useState(null);

  // Refresh the localStorage snapshot whenever items change
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setPersisted(raw ? JSON.parse(raw) : null);
  }, [items]);

  return (
    <div className="border rounded-xl p-4 bg-gray-50 text-xs space-y-3">
      <p className="font-semibold text-gray-600">
        🔍 Zustand Debug — persistence key:{" "}
        <code className="bg-white border rounded px-1">{STORAGE_KEY}</code>
      </p>

      <details open>
        <summary className="cursor-pointer font-medium text-gray-500 select-none mb-1">
          In-memory store state
        </summary>
        <pre className="overflow-auto text-gray-700 bg-white border rounded p-3 max-h-40">
          {JSON.stringify({ items }, null, 2)}
        </pre>
      </details>

      <details>
        <summary className="cursor-pointer font-medium text-gray-500 select-none mb-1">
          localStorage snapshot (what survives a page refresh)
        </summary>
        <pre className="overflow-auto text-gray-700 bg-white border rounded p-3 max-h-40">
          {persisted ? JSON.stringify(persisted, null, 2) : "— empty —"}
        </pre>
      </details>
    </div>
  );
};

export default StoreDebug;
