import type { NextApiResponse } from "next";
import { getSupportedSites } from "@/configs";

export function unsupportedSite(res: NextApiResponse): void {
  const supportedSites = getSupportedSites()
    .map((site) => site.domain)
    .join(", ");
  res.status(400).json({
    error: `Unsupported website. Supported sites: ${supportedSites}`,
  });
}
