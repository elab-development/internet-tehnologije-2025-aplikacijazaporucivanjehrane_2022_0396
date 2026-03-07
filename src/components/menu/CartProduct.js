import { cartProductPrice } from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import Image from "next/image";

export default function CartProduct({ product, onRemove }) {
  if (!product) return null;

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image
          width={240}
          height={240}
          src={product.image}
          alt={product.name || "Slika proizvoda"}
        />
      </div>

      <div className="grow">
        <h3 className="font-semibold">{product.name}</h3>

        {product.size?.name && (
          <div className="text-sm">
            Veličina: <span>{product.size.name}</span>
          </div>
        )}

        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map((extra, idx) => (
              <div key={`${extra.name || "extra"}-${idx}`}>
                {extra.name} {extra.price} din
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-lg font-semibold">
        {cartProductPrice(product)} din
      </div>

      {typeof onRemove === "function" && (
        <div className="ml-2">
          <button
            type="button"
            onClick={onRemove}
            className="p-2"
            aria-label="Ukloni iz korpe"
            title="Ukloni"
          >
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}
