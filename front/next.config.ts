import type { NextConfig } from "next";
import { localizedSlugPairs } from "./src/i18n/routes";

const nextConfig: NextConfig = {
  reactCompiler: true,

  /** Translated slugs map onto the English folder without changing the URL. */
  async rewrites() {
    return localizedSlugPairs().map(({ publicPath, folderPath }) => ({
      source: publicPath,
      destination: folderPath,
    }));
  },
};

export default nextConfig;
