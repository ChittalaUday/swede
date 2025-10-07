# Wedding Website (Swede)

A beautiful wedding website built with Next.js, React, and TypeScript.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, create a `.env.local` file in the root directory with the required environment variables. You can use `.env.example` as a template:

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local` with your actual configuration.

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

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

To build the application for production:

```bash
npm run build
```

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