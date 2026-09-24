#!/bin/bash

clear

echo ""
echo "================================================"
echo "   TESOURARIA IEAD - Starting..."
echo "================================================"
echo ""

# Check if Python3 is available
if command -v python3 &> /dev/null; then
    echo "[OK] Python3 found. Starting local server..."
    echo ""
    echo "The app will open automatically in your browser."
    echo "To stop: press Ctrl+C"
    echo ""
    echo "------------------------------------------------"
    echo ""
    
    # Open browser after 2 seconds (background)
    (sleep 2 && xdg-open http://localhost:8080 2>/dev/null || open http://localhost:8080 2>/dev/null) &
    
    # Start server in dist folder
    cd dist
    python3 -m http.server 8080
    exit 0
fi

# Check if Python is available
if command -v python &> /dev/null; then
    echo "[OK] Python found. Starting local server..."
    echo ""
    echo "The app will open automatically in your browser."
    echo "To stop: press Ctrl+C"
    echo ""
    echo "------------------------------------------------"
    echo ""
    
    # Open browser after 2 seconds (background)
    (sleep 2 && xdg-open http://localhost:8080 2>/dev/null || open http://localhost:8080 2>/dev/null) &
    
    # Start server in dist folder
    cd dist
    python -m http.server 8080
    exit 0
fi

# If Python not found, show instructions
echo ""
echo "[ERROR] Python not found!"
echo ""
echo "================================================"
echo ""
echo "To use this app, you need to install Python."
echo ""
echo "STEP 1: Install Python:"
echo "  - Ubuntu/Debian: sudo apt install python3"
echo "  - Fedora: sudo dnf install python3"
echo "  - Mac: brew install python3"
echo "  - Or download from: https://python.org"
echo ""
echo "STEP 2: Run this file again"
echo ""
echo "================================================"
echo ""
