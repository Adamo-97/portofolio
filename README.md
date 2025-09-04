# Portfolio Website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 🚀 Getting Started

First, run the development server locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

## 🐳 Run with Docker

This project includes a **Docker setup** for both development (with hot-reload) and production.

### Development (hot reload)

Build and start the container with:

```bash
docker compose up --build
```

* App will be available at: [http://localhost:3000](http://localhost:3000)
* Your code changes on the host machine will hot-reload inside the container.
* `node_modules` and `.next` are mounted as Docker volumes to avoid OS-specific issues (Ubuntu/Windows).

To stop the container:

```bash
docker compose down
```

### Production (optimized build)

Build a lean production image:

```bash
docker build -t my-portfolio:prod .
```

Run it:

```bash
docker run --rm -p 3000:3000 my-portfolio:prod
```

App will be available at: [http://localhost:3000](http://localhost:3000)

---

## 📚 Learn More

To learn more about Next.js, check out the following resources:

* [Next.js Documentation](https://nextjs.org/docs) – learn about Next.js features and API.
* [Learn Next.js](https://nextjs.org/learn) – interactive Next.js tutorial.

You can also check out the [Next.js GitHub repository](https://github.com/vercel/next.js) – your feedback and contributions are welcome!

