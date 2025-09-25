#!/bin/bash

# SecureContact Deployment Script
# This script helps deploy the SecureContact application

set -e

echo "🚀 SecureContact Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client not found. Make sure you have access to a PostgreSQL database."
    fi
    
    print_status "Requirements check completed ✅"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_status "Dependencies installed ✅"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        print_status "Creating backend .env file..."
        cp backend/.env.example backend/.env
        print_warning "Please edit backend/.env with your actual configuration!"
    else
        print_status "Backend .env already exists"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        print_status "Creating frontend .env file..."
        cp frontend/.env.example frontend/.env
        print_warning "Please edit frontend/.env with your actual configuration!"
    else
        print_status "Frontend .env already exists"
    fi
    
    print_status "Environment setup completed ✅"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    npm run build
    cd ..
    print_status "Frontend build completed ✅"
}

# Run database migrations
setup_database() {
    print_status "Setting up database..."
    
    if command -v psql &> /dev/null; then
        read -p "Enter your PostgreSQL database name (default: securecontact): " db_name
        db_name=${db_name:-securecontact}
        
        read -p "Do you want to create the database schema? (y/N): " create_schema
        if [[ $create_schema =~ ^[Yy]$ ]]; then
            print_status "Creating database schema..."
            psql $db_name < database/schema.sql
            print_status "Database schema created ✅"
        fi
    else
        print_warning "PostgreSQL client not found. Please run the schema manually:"
        print_warning "psql your_database < database/schema.sql"
    fi
}

# Start development servers
start_dev() {
    print_status "Starting development servers..."
    print_status "Backend will run on http://localhost:5000"
    print_status "Frontend will run on http://localhost:3000"
    print_warning "Make sure to configure your .env files first!"
    
    # Start backend in background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend in background
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Development servers started ✅"
    print_status "Backend PID: $BACKEND_PID"
    print_status "Frontend PID: $FRONTEND_PID"
    
    # Wait for user input to stop
    read -p "Press Enter to stop the servers..."
    
    # Kill the processes
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    print_status "Servers stopped"
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Install dependencies"
    echo "2) Setup environment files"
    echo "3) Setup database"
    echo "4) Build frontend"
    echo "5) Start development servers"
    echo "6) Full setup (1-4)"
    echo "7) Exit"
    echo ""
}

# Main script logic
main() {
    check_requirements
    
    while true; do
        show_menu
        read -p "Enter your choice (1-7): " choice
        
        case $choice in
            1)
                install_dependencies
                ;;
            2)
                setup_environment
                ;;
            3)
                setup_database
                ;;
            4)
                build_frontend
                ;;
            5)
                start_dev
                ;;
            6)
                install_dependencies
                setup_environment
                setup_database
                build_frontend
                print_status "Full setup completed! ✅"
                print_status "You can now start the development servers with option 5"
                ;;
            7)
                print_status "Goodbye! 👋"
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please enter 1-7."
                ;;
        esac
    done
}

# Run the script
main
