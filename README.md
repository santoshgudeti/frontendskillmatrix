# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Sitemap

This project includes an automatically generated sitemap for search engine optimization. The sitemap is located at `/public/sitemap.xml` and includes all main pages and individual service detail pages.

### Regenerating the Sitemap

To regenerate the sitemap (e.g., when adding new services), run:

```bash
npm run sitemap
```

This will update the sitemap with the latest pages and service IDs.

## Docker Deployment

This project includes Docker configuration for both production and development environments, serving the application directly with Node.js without Nginx.

### Production Deployment

To build and run the production version using Docker:

```bash
docker-compose up --build
```

This will build the optimized production version and start the frontend service on port 3000, serving the static files directly with Node.js.

### Development with Docker

For development with hot-reloading:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will start the development server with volume mounting for live code updates.

### Manual Docker Build

To manually build the Docker image:

```bash
# Production build
docker build -t skillmatrix-frontend .

# Development build
docker build -f Dockerfile.dev -t skillmatrix-frontend-dev .
```