import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /text-(6xl|7xl)/,
      variants: ['md', 'lg', 'sm', 'xl'],
    },
    // Add common classes that might be purged
    'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl',
    'font-bold', 'font-semibold', 'font-medium',
    'px-4', 'px-6', 'px-8', 'py-4', 'py-6', 'py-8',
    'mb-4', 'mb-6', 'mb-8', 'mt-4', 'mt-6', 'mt-8',
    'max-w-4xl', 'max-w-6xl', 'mx-auto',
    'bg-white', 'bg-gray-50', 'bg-blue-50', 'bg-indigo-50',
    'text-gray-900', 'text-gray-700', 'text-blue-600', 'text-indigo-900',
    'rounded-xl', 'rounded-2xl', 'rounded-3xl',
    'shadow-lg', 'shadow-xl', 'shadow-2xl',
    'border-2', 'border-4', 'border-gray-200', 'border-blue-200',
    'bg-gradient-to-r', 'bg-gradient-to-br',
    'from-blue-50', 'to-indigo-50', 'from-indigo-600', 'to-blue-600',
    'hover:scale-105', 'transform', 'transition-all', 'duration-200',
    'flex', 'items-center', 'justify-center', 'justify-between',
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
    'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4',
    'md:text-2xl', 'md:text-3xl', 'md:text-4xl', 'md:text-5xl',
    'md:px-6', 'md:py-8', 'md:mb-6', 'md:mt-0',
    'md:block', 'md:flex', 'md:hidden',
    'md:max-w-4xl', 'md:max-w-6xl',
    'md:rounded-2xl', 'md:rounded-3xl',
    'md:shadow-2xl', 'md:border-8',
    'md:bg-gradient-to-br', 'md:from-gray-800', 'md:via-gray-900', 'md:to-black',
    'md:p-12', 'md:p-2', 'md:p-3', 'md:p-6', 'md:p-8',
    'md:px-4', 'md:px-6', 'md:py-12', 'md:py-3', 'md:py-8',
    'md:pb-24', 'md:text-2xl', 'md:text-3xl', 'md:text-4xl', 'md:text-5xl',
    'md:text-6xl', 'md:text-7xl', 'md:text-lg', 'md:text-sm', 'md:text-xl', 'md:text-xs',
    'md:shadow-2xl', 'md:bg-white/80', 'md:bg-gradient-to-br',
    'md:from-gray-800', 'md:via-gray-900', 'md:to-black',
    'lg:col-span-1', 'lg:col-span-2', 'lg:inline-flex', 'lg:h-32',
    'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-5', 'lg:grid-cols-7',
    'lg:px-8', 'lg:text-6xl', 'lg:text-7xl',
    'xl:col-span-1', 'xl:col-span-2', 'xl:grid-cols-3',
    'xl:text-6xl', 'xl:text-7xl',
    'sm:block', 'sm:inline', 'sm:flex', 'sm:h-24', 'sm:flex-none',
    'sm:grid-cols-2', 'sm:flex-row', 'sm:items-center', 'sm:px-6',
    'sm:text-3xl', 'sm:text-6xl', 'sm:text-7xl', 'sm:text-base'
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
