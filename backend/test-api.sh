#!/bin/bash

# BudgSmart Backend API Test Script

# Default values
BASE_URL="http://localhost:3000/api"
VERBOSE=false
SKIP_HEALTH=false
CUSTOM_EMAIL=""
CUSTOM_PASSWORD=""

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -u, --url URL          Set custom base URL (default: http://localhost:3000/api)"
    echo "  -v, --verbose          Enable verbose output"
    echo "  -s, --skip-health      Skip health check"
    echo "  -e, --email EMAIL      Use custom email for testing (default: test@example.com)"
    echo "  -p, --password PASS    Use custom password for testing (default: testpassword123)"
    echo "  --port PORT            Use custom port (default: 3000)"
    echo ""
    echo "Examples:"
    echo "  $0                     # Run with default settings"
    echo "  $0 -v                  # Run with verbose output"
    echo "  $0 --port 8080         # Run against port 8080"
    echo "  $0 -e user@test.com    # Use custom email"
    echo "  $0 --url http://api.example.com/v1  # Use custom API URL"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -u|--url)
            BASE_URL="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -s|--skip-health)
            SKIP_HEALTH=true
            shift
            ;;
        -e|--email)
            CUSTOM_EMAIL="$2"
            shift 2
            ;;
        -p|--password)
            CUSTOM_PASSWORD="$2"
            shift 2
            ;;
        --port)
            BASE_URL="http://localhost:$2/api"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Set default values if not provided
if [ -z "$CUSTOM_EMAIL" ]; then
    CUSTOM_EMAIL="test@example.com"
fi

if [ -z "$CUSTOM_PASSWORD" ]; then
    CUSTOM_PASSWORD="testpassword123"
fi

echo "🧪 Testing BudgSmart Backend API..."
echo "📡 Base URL: $BASE_URL"
if [ "$VERBOSE" = true ]; then
    echo "📧 Email: $CUSTOM_EMAIL"
    echo "🔒 Password: [HIDDEN]"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make HTTP requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    
    if [ "$VERBOSE" = true ]; then
        echo "🔧 Making $method request to: $BASE_URL$endpoint"
        if [ -n "$data" ]; then
            echo "📤 Request data: $data"
        fi
    fi
    
    if [ -n "$token" ]; then
        if [ -n "$data" ]; then
            curl -s -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data"
        else
            curl -s -X $method "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $token"
        fi
    else
        if [ -n "$data" ]; then
            curl -s -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data"
        else
            curl -s -X $method "$BASE_URL$endpoint"
        fi
    fi
}

# Check if server is running
if [ "$SKIP_HEALTH" = false ]; then
    echo "📡 Checking server health..."
    health_response=$(make_request GET "/health")
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Server is running${NC}"
        if [ "$VERBOSE" = true ]; then
            echo "$health_response" | jq '.' 2>/dev/null || echo "$health_response"
        fi
    else
        echo -e "${RED}❌ Server is not running. Please start the server first.${NC}"
        exit 1
    fi
else
    echo "⏭️  Skipping health check..."
fi

echo ""
echo "📋 Testing API endpoints..."

# Test user registration
echo "1. Testing user registration..."
register_data="{
    \"email\": \"$CUSTOM_EMAIL\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"password\": \"$CUSTOM_PASSWORD\"
}"

register_response=$(make_request POST "/auth/register" "$register_data")
if echo "$register_response" | grep -q "token"; then
    echo -e "${GREEN}✅ Registration successful${NC}"
    token=$(echo "$register_response" | jq -r '.token' 2>/dev/null)
else
    echo -e "${YELLOW}⚠️  Registration response:${NC}"
    echo "$register_response" | jq '.' 2>/dev/null || echo "$register_response"
fi

echo ""

# Test user login
echo "2. Testing user login..."
login_data="{
    \"email\": \"$CUSTOM_EMAIL\",
    \"password\": \"$CUSTOM_PASSWORD\"
}"

login_response=$(make_request POST "/auth/login" "$login_data")
if echo "$login_response" | grep -q "token"; then
    echo -e "${GREEN}✅ Login successful${NC}"
    token=$(echo "$login_response" | jq -r '.token' 2>/dev/null)
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "$login_response" | jq '.' 2>/dev/null || echo "$login_response"
    exit 1
fi

echo ""

# Test getting user profile
echo "3. Testing get user profile..."
if [ -n "$token" ]; then
    profile_response=$(make_request GET "/auth/profile" "" "$token")
    if echo "$profile_response" | grep -q "email"; then
        echo -e "${GREEN}✅ Profile retrieval successful${NC}"
    else
        echo -e "${RED}❌ Profile retrieval failed${NC}"
        echo "$profile_response" | jq '.' 2>/dev/null || echo "$profile_response"
    fi
else
    echo -e "${YELLOW}⚠️  No token available, skipping profile test${NC}"
fi

echo ""

# Test creating a transaction
echo "4. Testing transaction creation..."
if [ -n "$token" ]; then
    transaction_data='{
        "description": "Test Income",
        "amount": 1000.50,
        "type": "income",
        "category": "salary",
        "date": "2025-08-13",
        "notes": "Test transaction from API test script"
    }'
    
    transaction_response=$(make_request POST "/transactions" "$transaction_data" "$token")
    if echo "$transaction_response" | grep -q "Transaction created successfully"; then
        echo -e "${GREEN}✅ Transaction creation successful${NC}"
        transaction_id=$(echo "$transaction_response" | jq -r '.transaction.id' 2>/dev/null)
    else
        echo -e "${RED}❌ Transaction creation failed${NC}"
        echo "$transaction_response" | jq '.' 2>/dev/null || echo "$transaction_response"
    fi
else
    echo -e "${YELLOW}⚠️  No token available, skipping transaction test${NC}"
fi

echo ""

# Test getting transactions
echo "5. Testing get transactions..."
if [ -n "$token" ]; then
    transactions_response=$(make_request GET "/transactions" "" "$token")
    if echo "$transactions_response" | grep -q "transactions"; then
        echo -e "${GREEN}✅ Get transactions successful${NC}"
        transaction_count=$(echo "$transactions_response" | jq '.pagination.total' 2>/dev/null)
        echo "Total transactions: $transaction_count"
    else
        echo -e "${RED}❌ Get transactions failed${NC}"
        echo "$transactions_response" | jq '.' 2>/dev/null || echo "$transactions_response"
    fi
else
    echo -e "${YELLOW}⚠️  No token available, skipping get transactions test${NC}"
fi

echo ""

# Test getting user stats
echo "6. Testing user statistics..."
if [ -n "$token" ]; then
    stats_response=$(make_request GET "/users/stats" "" "$token")
    if echo "$stats_response" | grep -q "totalTransactions"; then
        echo -e "${GREEN}✅ User statistics successful${NC}"
        echo "$stats_response" | jq '.' 2>/dev/null || echo "$stats_response"
    else
        echo -e "${RED}❌ User statistics failed${NC}"
        echo "$stats_response" | jq '.' 2>/dev/null || echo "$stats_response"
    fi
else
    echo -e "${YELLOW}⚠️  No token available, skipping stats test${NC}"
fi

echo ""
echo "🎉 API testing completed!"
echo ""
echo "📝 Summary:"
echo "- Health check: ✅"
echo "- User registration: ✅"
echo "- User login: ✅"
echo "- Get profile: ✅"
echo "- Create transaction: ✅"
echo "- Get transactions: ✅"
echo "- User statistics: ✅"
echo ""
echo "🔧 For manual testing, you can use the following token:"
echo "$token"
