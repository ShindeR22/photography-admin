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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Admin login configuration

The admin dashboard is protected by a signed, HTTP-only session cookie. On the first successful login, the configured administrator is provisioned into the MongoDB `admins` collection with a salted scrypt password hash. Later logins are checked against that database record. Configure these environment variables in each environment (the local `.env.local` file is ignored by git):

```env
ADMIN_LOGIN_ID=your-admin-id
ADMIN_LOGIN_PASSWORD=use-a-unique-password
ADMIN_SESSION_SECRET=use-a-long-random-secret
VIEWER_LOGIN_ID=your-viewer-id
VIEWER_LOGIN_PASSWORD=use-a-unique-password
```

The full-access account uses `ADMIN_LOGIN_ID` and `ADMIN_LOGIN_PASSWORD`. The view-only account uses `VIEWER_LOGIN_ID` and `VIEWER_LOGIN_PASSWORD`; its database record is created with the `viewer` role on first login. Viewer sessions can read dashboard data but cannot make changes. Set all five variables in the hosting provider before deploying.
