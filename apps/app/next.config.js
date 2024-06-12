/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  transpilePackages: ["@repo/utils", "database", "posthog-js", "@repo/types"],
  experimental: {
    instrumentationHook: true,
  },
};

export default config;
