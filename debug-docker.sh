#!/bin/bash

# Debug script for Docker environment
echo "🔍 KNX Store Docker Debug Script"
echo "================================="
echo ""

# Check if Docker is running
echo "1️⃣ Checking Docker status..."
if docker info > /dev/null 2>&1; then
    echo "   ✅ Docker is running"
else
    echo "   ❌ Docker is not running or not accessible"
    exit 1
fi

# Check Docker Compose
echo ""
echo "2️⃣ Checking Docker Compose..."
if docker-compose --version > /dev/null 2>&1; then
    echo "   ✅ Docker Compose is available"
    docker-compose --version
else
    echo "   ❌ Docker Compose not found"
fi

# Check if containers are running
echo ""
echo "3️⃣ Checking container status..."
if docker ps | grep -q "knx-store-dev"; then
    echo "   ✅ knx-store-dev container is running"
    docker ps | grep "knx-store-dev"
else
    echo "   ❌ knx-store-dev container is not running"
    echo "   📋 Available containers:"
    docker ps -a | grep "knx-store"
fi

# Check Docker Compose configuration
echo ""
echo "4️⃣ Checking docker-compose.yml..."
if [ -f "docker-compose.yml" ]; then
    echo "   ✅ docker-compose.yml exists"
    
    # Validate Docker Compose file
    if docker-compose config > /dev/null 2>&1; then
        echo "   ✅ docker-compose.yml is valid"
    else
        echo "   ❌ docker-compose.yml has errors"
        docker-compose config
    fi
else
    echo "   ❌ docker-compose.yml not found"
fi

# Check if we can access the container
echo ""
echo "5️⃣ Testing container access..."
if docker ps | grep -q "knx-store-dev"; then
    echo "   ✅ Container is running, testing access..."
    
    # Test basic commands in container
    if docker exec knx-store-dev echo "Container access test" > /dev/null 2>&1; then
        echo "   ✅ Can execute commands in container"
        
        # Check Node.js in container
        echo "   🔍 Checking Node.js in container..."
        docker exec knx-store-dev node --version 2>/dev/null || echo "   ❌ Node.js not found in container"
        
        # Check npm in container
        echo "   🔍 Checking npm in container..."
        docker exec knx-store-dev npm --version 2>/dev/null || echo "   ❌ npm not found in container"
        
        # Check if /app directory exists
        echo "   🔍 Checking /app directory..."
        if docker exec knx-store-dev test -d /app; then
            echo "   ✅ /app directory exists"
            
            # Check package.json in container
            if docker exec knx-store-dev test -f /app/package.json; then
                echo "   ✅ package.json exists in container"
            else
                echo "   ❌ package.json not found in container"
            fi
            
            # Check node_modules in container
            if docker exec knx-store-dev test -d /app/node_modules; then
                echo "   ✅ node_modules exists in container"
            else
                echo "   ❌ node_modules not found in container"
            fi
        else
            echo "   ❌ /app directory not found in container"
        fi
    else
        echo "   ❌ Cannot execute commands in container"
    fi
else
    echo "   ❌ Container is not running, cannot test access"
fi

# Check port availability
echo ""
echo "6️⃣ Checking port availability..."
PORTS=(4001 4002 4003 4004 4005 4006 4007)
for port in "${PORTS[@]}"; do
    if lsof -i :$port > /dev/null 2>&1; then
        echo "   ⚠️  Port $port is in use"
        lsof -i :$port | head -2
    else
        echo "   ✅ Port $port is available"
    fi
done

# Check file permissions
echo ""
echo "7️⃣ Checking file permissions..."
if [ -r "package.json" ]; then
    echo "   ✅ package.json is readable"
else
    echo "   ❌ package.json is not readable"
fi

if [ -r "docker-compose.yml" ]; then
    echo "   ✅ docker-compose.yml is readable"
else
    echo "   ❌ docker-compose.yml is not readable"
fi

# Check disk space
echo ""
echo "8️⃣ Checking disk space..."
df -h . | head -2

# Check memory usage
echo ""
echo "9️⃣ Checking memory usage..."
if command -v free > /dev/null 2>&1; then
    free -h | head -2
else
    echo "   ⚠️  free command not available"
fi

# Provide troubleshooting steps
echo ""
echo "🎯 Troubleshooting Steps"
echo "========================"
echo ""
echo "If you see ❌ errors above:"
echo "1. Start Docker Desktop (if on macOS/Windows)"
echo "2. Run: docker-compose up -d"
echo "3. Check logs: docker-compose logs knx-store-dev"
echo "4. Restart container: docker-compose restart knx-store-dev"
echo ""
echo "If container is not starting:"
echo "1. Check Docker logs: docker-compose logs"
echo "2. Rebuild container: docker-compose build --no-cache"
echo "3. Remove and recreate: docker-compose down && docker-compose up -d"
echo ""
echo "If npm install fails in container:"
echo "1. Check network connectivity"
echo "2. Clear npm cache: docker exec knx-store-dev npm cache clean --force"
echo "3. Delete node_modules and reinstall"
echo ""
echo "Useful commands:"
echo "- docker-compose up -d          # Start containers in background"
echo "- docker-compose logs -f        # Follow logs"
echo "- docker-compose down           # Stop containers"
echo "- docker-compose restart        # Restart containers"
echo "- docker exec -it knx-store-dev sh  # Access container shell" 