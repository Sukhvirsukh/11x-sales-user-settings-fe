import { ShoppingBag } from "lucide-react";

export interface ProductRecommendationItem {
  id: string;
  title: string;
  price: string;
  code?: string;
  imageUrl?: string;
  productUrl?: string;
}

interface ProductRecommendationProps {
  product: ProductRecommendationItem;
}

function getSafeProductUrl(value?: string) {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : undefined;
  } catch {
    return undefined;
  }
}

export function ProductRecommendation({ product }: ProductRecommendationProps) {
  const content = (
    <>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt=""
          className="size-12 shrink-0 rounded-md border border-border object-cover"
        />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
          <ShoppingBag className="size-5" aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text text-muted-foreground mb-2.5">
          {product.title}
          {product.code && ` (Code: ${product.code})`}
        </span>
        <span className="block text font-semibold text-foreground">
          {product.price}
        </span>
      </span>
    </>
  );
  const productUrl = getSafeProductUrl(product.productUrl);

  return productUrl ? (
    <a
      href={productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-2">{content}</div>
  );
}
