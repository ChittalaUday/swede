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

This project requires several environment variables to function properly. Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret
GOOGLE_DRIVE_ACCESS_TOKEN_1=your_google_drive_access_token_1
GOOGLE_DRIVE_REFRESH_TOKEN_1=your_google_drive_refresh_token_1
GOOGLE_DRIVE_ACCESS_TOKEN_2=your_google_drive_access_token_2
GOOGLE_DRIVE_REFRESH_TOKEN_2=your_google_drive_refresh_token_2
GOOGLE_DRIVE_ACCESS_TOKEN_3=your_google_drive_access_token_3
GOOGLE_DRIVE_REFRESH_TOKEN_3=your_google_drive_refresh_token_3
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
ENCRYPTION_SECRET=your_encryption_secret
SESSION_SECRET=your_session_secret
```

### Vercel Deployment

For Vercel deployment, you'll need to configure these environment variables in your Vercel project dashboard:

1. Go to your Vercel project settings
2. Navigate to the "Environment Variables" section
3. Add each of the above variables with their respective values
4. Redeploy your application

The vercel.json file no longer contains direct references to secrets to avoid deployment errors. All environment variables should be configured through the Vercel dashboard.

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

## Deployment to Vercel

This project is configured for deployment to Vercel. If you encounter build errors related to native Node.js modules like `odbc`, it's likely due to unused dependencies that require system-level libraries.

### Troubleshooting Build Issues

If you see errors like:
```
../src/odbc.h:30:10: fatal error: sql.h: No such file or directory
```

This indicates that a dependency is trying to compile a native module that requires system libraries not available in Vercel's build environment.

To fix this:
1. Check for unused dependencies that might be pulling in native modules
2. Remove them from package.json
3. Run `npm install` to update the lock file
4. Deploy again

The `magic-ui` package was previously causing this issue as it pulls in `odbc` and `odbc-pool` as dependencies. These have been removed since they were not being used in the project.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
