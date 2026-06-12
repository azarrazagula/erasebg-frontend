/**
 * PostCSS Configuration
 * 
 * Configures the PostCSS process utilized by Next.js during compilation to parse utility classes.
 * Includes tailwindcss mapping and autoprefixer to append vendor prefixes for multi-browser compatibility.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
