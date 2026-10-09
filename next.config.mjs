import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Static HTML export for Hostinger; every page is written as <path>/index.html.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default withMDX(config);
