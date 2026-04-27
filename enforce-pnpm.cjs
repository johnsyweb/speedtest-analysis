#!/usr/bin/env node

const userAgent = process.env.npm_config_user_agent || "";
const isPnpm = userAgent.includes("pnpm/");

if (!isPnpm) {
  console.error("This project uses pnpm only.");
  console.error("Use: pnpm install");
  process.exit(1);
}
