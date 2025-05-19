Borabyte Quick Start Guide
This guide provides essential information to get the Borabyte Electronics Marketplace application up and running as quickly as possible.
Prerequisites

Node.js (v18 or later)
npm or yarn

Quick Setup

Clone and install dependencies

bash# Clone the repository (replace with your repository URL)
git clone https://github.com/yourusername/borabyte.git
cd borabyte

# Install dependencies
npm install

Set up environment

Create a .env file in the project root:
SESSION_SECRET=your-secret-key
NODE_ENV=development

Start the development server

bashnpm run dev
The application will be available at: http://localhost:5000
Default Admin Account
To access the admin dashboard:

Username: admin
Password: admin123

Key URLs

Home Page: http://localhost:5000/
Admin Dashboard: http://localhost:5000/admin
Product Category: http://localhost:5000/category/[category-slug]
Product Detail: http://localhost:5000/product/[product-id]
Authentication: http://localhost:5000/auth

Basic Commands
bash# Start development server
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Start production server
npm run start

# Update database schema (if configured)
npm run db:push
Project Structure Overview
/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Application pages
│   │   └── main.tsx         # Application entry point
│   └── index.html           # HTML template
├── server/                  # Backend Express server
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── storage.ts           # In-memory data storage
│   ├── auth.ts              # Authentication logic
│   └── vite.ts              # Development server config
├── shared/                  # Shared code
│   └── schema.ts            # TypeScript types and schemas
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
Common Issues
If you encounter any of these common issues:

"Cannot find module '@shared/schema'"

Create the shared/schema.ts file if it doesn't exist
See the TROUBLESHOOTING.md file for the schema content


"Port 5000 is already in use"

Change the port in server/index.ts or set PORT environment variable:

bashPORT=3000 npm run dev

Authentication fails

Ensure cookies are enabled in your browser
Check that you're using the correct credentials


Page styling issues

Make sure TailwindCSS is properly installed and configured
Check browser console for CSS errors


API calls failing

Check that the server is running
Look for CORS errors in browser console



Next Steps

Browse the application to see sample products
Create a user account to test the shopping experience
Log in to the admin dashboard (using admin credentials) to manage products
Check the full README.md and DEVELOPMENT_GUIDE.md for more detailed information

For more details, troubleshooting help, and configuration options, refer to:

README.md - Full project documentation
DEVELOPMENT_GUIDE.md - Detailed development information
TROUBLESHOOTING.md - Solutions to common issues
