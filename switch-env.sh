#!/bin/bash
# =====================================
# Asset Management System - Environment Switcher
# =====================================
# Script to easily switch between different environment configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Available environments
ENVIRONMENTS=("testing" "production" "development")
CURRENT_ENV=""

# Function to detect current environment
detect_current_env() {
    if [ -f .env ]; then
        if grep -q "SPRING_PROFILES_ACTIVE=testing" .env 2>/dev/null; then
            CURRENT_ENV="testing"
        elif grep -q "SPRING_PROFILES_ACTIVE=production" .env 2>/dev/null; then
            CURRENT_ENV="production"
        else
            CURRENT_ENV="custom"
        fi
    else
        CURRENT_ENV="none"
    fi
}

# Function to switch environment
switch_environment() {
    local target_env=$1

    print_info "Switching to $target_env environment..."

    # Backup current .env if it exists
    if [ -f .env ]; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        print_info "Backed up current .env file"
    fi

    # Copy new environment file
    if [ -f ".env.$target_env" ]; then
        cp ".env.$target_env" .env
        print_success "Switched to $target_env environment"

        # Show next steps
        echo
        print_info "Next steps:"
        echo "1. Review .env file and update any credentials if needed"
        echo "2. Run: docker-compose -f docker-compose.fullstack.yml up -d"
        echo "3. Check logs: docker-compose -f docker-compose.fullstack.yml logs -f"
    else
        print_error "Environment file .env.$target_env not found!"
        exit 1
    fi
}

# Function to show current environment
show_current_env() {
    detect_current_env
    if [ "$CURRENT_ENV" = "none" ]; then
        print_warning "No .env file found"
    else
        print_info "Current environment: $CURRENT_ENV"
    fi
}

# Function to show available environments
show_environments() {
    echo
    print_info "Available environments:"
    for env in "${ENVIRONMENTS[@]}"; do
        if [ -f ".env.$env" ]; then
            echo -e "  ${GREEN}✓${NC} $env"
        else
            echo -e "  ${RED}✗${NC} $env (file missing)"
        fi
    done
    echo
}

# Function to show environment comparison
show_env_comparison() {
    echo
    print_info "Environment comparison:"
    echo

    printf "%-12s %-10s %-15s %-s\n" "Service" "Testing" "Production" "Notes"
    printf "%-12s %-10s %-15s %-s\n" "--------" "--------" "----------" "-----"

    printf "%-12s %-10s %-15s %-s\n" "Database" "Local" "Production" "PostgreSQL instance"
    printf "%-12s %-10s %-15s %-s\n" "Email" "Test SMTP" "Prod SMTP" "Gmail/Brevo"
    printf "%-12s %-10s %-15s %-s\n" "Logging" "DEBUG" "WARN/INFO" "Performance"
    printf "%-12s %-10s %-15s %-s\n" "CORS" "Localhost" "Domain only" "Security"
    printf "%-12s %-10s %-15s %-s\n" "JWT Exp" "1 hour" "12 hours" "Security vs UX"

    echo
}

# Main menu
show_menu() {
    echo
    echo "===================================="
    echo "🚀 Asset Management System"
    echo "    Environment Manager"
    echo "===================================="
    echo

    detect_current_env
    if [ "$CURRENT_ENV" != "none" ]; then
        print_info "Current environment: $CURRENT_ENV"
    fi

    echo "Available options:"
    echo "1) Switch to testing environment"
    echo "2) Switch to production environment"
    echo "3) Show current environment"
    echo "4) Show available environments"
    echo "5) Compare environments"
    echo "6) Exit"
    echo
}

# Main script logic
main() {
    while true; do
        show_menu
        read -p "Enter your choice (1-6): " choice

        case $choice in
            1)
                switch_environment "testing"
                break
                ;;
            2)
                switch_environment "production"
                break
                ;;
            3)
                show_current_env
                echo "Press Enter to continue..."
                read
                ;;
            4)
                show_environments
                echo "Press Enter to continue..."
                read
                ;;
            5)
                show_env_comparison
                echo "Press Enter to continue..."
                read
                ;;
            6)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please try again."
                sleep 1
                ;;
        esac
    done
}

# Run main function
main
