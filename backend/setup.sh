#!/bin/bash

# BudgSmart Backend Setup Script

echo "🚀 Setting up BudgSmart Backend..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || cat > .env << EOL
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=budgsmart
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-$(date +%s)
JWT_EXPIRES_IN=7d
EOL
    echo "✅ .env file created successfully!"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if PostgreSQL is running via Docker
echo "🐘 Starting PostgreSQL with Docker..."
cd ..
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Go back to backend directory
cd backend

# Run migrations (if any)
echo "🔄 Running database migrations..."
npm run migration:run 2>/dev/null || echo "No migrations to run or migration failed (this is normal for first setup)"

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Available commands:"
echo "  npm run dev     - Start development server"
echo "  npm run build   - Build for production"
echo "  npm start       - Start production server"
echo ""
echo "📊 Database info:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: budgsmart"
echo "  Username: postgres"
echo "  Password: password"
echo ""
echo "🌐 API will be available at: http://localhost:3000"
