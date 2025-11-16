#!/bin/bash

# ZenCab Network/API Test Script

echo "🌐 ZENCAB NETWORK/API TESTING"
echo "=================================="

# 1. BASIC CONNECTIVITY
echo -e "\n1. BASIC CONNECTIVITY\n--------------------"
echo -n "Internet connectivity... "
curl -s --head https://www.google.com | head -n 1 | grep "200 OK" > /dev/null && echo "✅ PASS" || echo "❌ FAIL"
echo -n "DNS resolution... "
nslookup google.com > /dev/null && echo "✅ PASS" || echo "❌ FAIL"

# 2. LOCAL DEVELOPMENT SERVERS
FRONTEND_PORT=3000
BACKEND_PORT=5000
MONGO_PORT=27017

echo -e "\n2. LOCAL DEVELOPMENT SERVERS\n----------------------------"
echo -n "Testing Frontend server (port $FRONTEND_PORT)... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:$FRONTEND_PORT | grep 200 > /dev/null && echo "✅ PASS" || echo "❌ FAIL"
echo -n "Testing Backend server (port $BACKEND_PORT)... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:$BACKEND_PORT/api/health | grep 200 > /dev/null && echo "✅ PASS" || echo "❌ FAIL"

# 3. EXTERNAL SERVICES
echo -e "\n3. EXTERNAL SERVICES\n-------------------"
echo -n "Testing Clerk API... "
curl -s -o /dev/null -w "%{http_code}" https://api.clerk.dev | grep 200 > /dev/null && echo "✅ PASS" || echo "❌ FAIL"
echo -n "Testing Mappls API... "
curl -s -o /dev/null -w "%{http_code}" https://apis.mappls.com/advancedmaps/v1 | grep 200 > /dev/null && echo "✅ PASS" || echo "❌ FAIL"
echo -n "Testing Google Maps API... "
curl -s -o /dev/null -w "%{http_code}" https://maps.googleapis.com/maps/api/js | grep 200 > /dev/null && echo "✅ PASS" || echo "❌ FAIL"

echo -e "\n4. ZENCAB API ENDPOINTS\n----------------------"
echo -n "Testing Health check... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:$BACKEND_PORT/api/health | grep 200 > /dev/null && echo "✅ PASS" || echo "❌ FAIL"
echo -n "Testing Book Ride endpoint... "
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:$BACKEND_PORT/api/bookRide | grep 200 > /dev/null && echo "✅ PASS" || echo "❌ FAIL"
echo -n "Testing Student Verification endpoint... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:$BACKEND_PORT/api/student/verify | grep 200 > /dev/null && echo "✅ PASS" || echo "❌ FAIL"

echo -e "\n5. DATABASE PORTS\n-----------------"
echo -n "MongoDB (port $MONGO_PORT)... "
if nc -z localhost $MONGO_PORT; then echo "✅ OPEN"; else echo "❌ CLOSED"; fi

echo -e "\n=================================="
echo "🎯 ZenCab network/API testing complete!"
