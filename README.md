# Wellness Metrics Dashboard

A research dashboard analyzing the relationship between smartphone usage and recovery outcomes in individuals with Substance Use Disorder (SUD).

## Features

- Interactive data visualizations using Chart.js
- Real-time data updates
- Responsive design
- Data entry and management capabilities
- Statistical analysis of trends
- Persistent data storage with PostgreSQL

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Chart.js with react-chartjs-2
- Prisma ORM
- PostgreSQL (Vercel/Neon)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd wellness-metrics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Vercel with PostgreSQL for data storage.

### Deploy to Vercel

1. Create a new project on Vercel and link your GitHub repository
2. Add the following environment variables in the Vercel project settings:
   - `DATABASE_URL`: PostgreSQL connection string (provided by Vercel Postgres or your own)
   - `DIRECT_URL`: Direct connection URL for PostgreSQL (non-pooled version)
   - `NEXT_PUBLIC_APP_URL`: The public URL of your application

3. Deploy your project and Vercel will automatically handle the database migrations

### Setting Up a New Vercel Postgres Database

1. Create a new Postgres database from your Vercel dashboard
2. Add the integration to your project
3. Copy the provided connection strings to your project environment variables

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string (with connection pooling for production)
- `DIRECT_URL`: Direct PostgreSQL connection string (for migrations)
- `NEXT_PUBLIC_APP_URL`: The public URL of your application

For local development, a SQLite database is used by default.

## Database Management

The application uses Prisma ORM for database access. The following commands are available:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations in development
npm run prisma:migrate:dev

# Apply migrations in production
npm run prisma:migrate:deploy

# Open Prisma Studio to view/edit data
npm run prisma:studio
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- Cynthia Lefferts - Research Lead
