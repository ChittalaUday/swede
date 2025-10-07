This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

This project requires environment variables for database and Google Drive integration. Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for detailed information about required environment variables.

## Wedding Website Features

### Public Pages

- **Homepage**: Wedding countdown and couple introduction
- **Wedding Details**: Comprehensive information about the wedding (restructured into sections)
- **Media Gallery**: View published photos and videos with category filtering

### Admin Features

- **Admin Dashboard**: Secure area for managing wedding media
- **Media Management**: Upload, edit, and delete photos and videos with Google Drive integration
- **Category Management**: Create and manage custom categories for organizing media
- **Multi-Account Storage**: Automatic distribution of media across multiple Google Drive accounts
- **Authentication**: Secure login system for authorized access

For detailed information about admin features, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
