# Borabyte - Electronics Marketplace

Borabyte is a full-stack e-commerce application for new, refurbished, and used electronics. It features a modern React frontend with TailwindCSS and a Node.js/Express backend.

![Borabyte Banner](https://images.unsplash.com/photo-1468495244123-6c6c332eeece)

## Features

- **Product Browsing**: Browse a wide range of electronics products
- **Category Filtering**: Filter products by categories, conditions, price ranges, and more
- **User Authentication**: Register and log in to access personalized features
- **Shopping Cart**: Add products to cart and manage your shopping experience
- **Checkout Process**: Complete purchases with various payment methods
- **Admin Dashboard**: Manage products, inventory, and marketplace integrations
- **Marketplace Integration**: Support for Amazon and eBay marketplace connections
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**:
  - React 18 with TypeScript
  - Vite for fast development and building
  - TailwindCSS for styling
  - shadcn/ui component library
  - React Query for data fetching
  - Wouter for routing
  - Lucide React for icons

- **Backend**:
  - Node.js with Express
  - TypeScript
  - In-memory storage (for development)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/borabyte.git
   cd borabyte
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

This will launch the application with hot-reloading enabled. The app will be available at http://localhost:5000.

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `/client`: Frontend React application
  - `/src`: Source code
    - `/components`: Reusable UI components
    - `/hooks`: Custom React hooks
    - `/lib`: Utility functions
    - `/pages`: Application pages
- `/server`: Backend Express server
  - `index.ts`: Server entry point
  - `routes.ts`: API routes
  - `storage.ts`: In-memory data storage
  - `auth.ts`: Authentication logic
- `/shared`: Shared code between frontend and backend
  - `schema.ts`: TypeScript types and Zod validation schemas

## Default Credentials

The application is initialized with a default admin user:

- Username: `admin`
- Password: `admin123`

## Demo Features

### For Customers
- Browse products by categories
- Filter products by condition, price, brand, etc.
- View detailed product information
- Add products to the shopping cart
- Complete checkout process

### For Administrators
- Manage product inventory
- Add, edit, and remove products
- View and update marketplace integrations
- Track orders and sales

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [Express](https://expressjs.com/)
- [Vite](https://vitejs.dev/)
