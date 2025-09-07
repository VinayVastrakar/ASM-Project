#!/bin/bash

# Asset Management Application - Environment Setup Script
# This script helps you set up your environment variables

echo "🚀 Asset Management Application - Environment Setup"
echo "=================================================="

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Copy env.example to .env
if [ -f "env.example" ]; then
    cp env.example .env
    echo "✅ Created .env file from env.example"
else
    echo "❌ env.example file not found!"
    exit 1
fi

echo ""
echo "📝 Please edit the .env file with your actual values:"
echo "   - Database credentials"
echo "   - Email settings"
echo "   - JWT secret"
echo "   - Google OAuth client ID"
echo ""

# Ask if user wants to open the file
read -p "Do you want to open the .env file for editing? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v code &> /dev/null; then
        code .env
    elif command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    else
        echo "No suitable editor found. Please edit .env manually."
    fi
fi

echo ""
echo "🔒 Setting proper permissions for .env file..."
chmod 600 .env

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your actual values"
echo "2. Run: mvn spring-boot:run"
echo "3. Or run with specific profile: mvn spring-boot:run -Dspring.profiles.active=dev"
echo ""
echo "📚 For more information, see ENVIRONMENT_SETUP.md"
