import type { PaymentProvider } from "./provider";
import { devProvider } from "./dev";
import { infiniProvider } from "./infini";
import { stripeProvider } from "./stripe";

export function getPaymentProvider(): PaymentProvider {
  const name = process.env.PAYMENT_PROVIDER ?? "dev";
  switch (name) {
    case "stripe":
      return stripeProvider;
    case "infini":
    case "infinimoney": // alias
      return infiniProvider;
    case "dev":
      if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production") {
        console.warn(
          "[payments] WARNING: dev payment provider active in production. Set PAYMENT_PROVIDER=stripe or infini.",
        );
      }
      return devProvider;
    default:
      throw new Error(`Unknown PAYMENT_PROVIDER: ${name}`);
  }
}
