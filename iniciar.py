import http.server
import socketserver
import webbrowser
import os
import sys
import threading

PORT = 8080

def open_browser():
    import time
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{PORT}')

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.join(script_dir, 'dist')

print("=" * 60)
print("  TESOURARIA IEAD - Diagnosticando...")
print("=" * 60)
print()
print(f"Script location: {script_dir}")
print(f"Looking for dist at: {dist_dir}")
print()

# Check if dist directory exists
if not os.path.exists(dist_dir):
    print("ERROR: dist folder not found!")
    print()
    print("Please run: npm run build")
    print()
    input("Press Enter to exit...")
    sys.exit(1)

# List files in dist directory
print("Files in dist folder:")
for item in os.listdir(dist_dir):
    full_path = os.path.join(dist_dir, item)
    if os.path.isdir(full_path):
        print(f"  [DIR]  {item}/")
        for subitem in os.listdir(full_path):
            print(f"         - {subitem}")
    else:
        print(f"  [FILE] {item}")
print()

# Check if index.html exists
index_path = os.path.join(dist_dir, 'index.html')
if not os.path.exists(index_path):
    print("ERROR: index.html not found in dist folder!")
    print()
    print("Please run: npm run build")
    print()
    input("Press Enter to exit...")
    sys.exit(1)

print(f"OK: index.html found at: {index_path}")
print()

print("=" * 60)
print("  Starting server...")
print("=" * 60)
print()
print(f"Server will run at: http://localhost:{PORT}")
print(f"Serving files from: {dist_dir}")
print("Browser will open automatically...")
print()
print("To stop: Press Ctrl+C")
print()

# Start browser in a separate thread
threading.Thread(target=open_browser, daemon=True).start()

# Create custom handler that serves from dist directory
class DistHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=dist_dir, **kwargs)
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")

try:
    with socketserver.TCPServer(("", PORT), DistHandler) as httpd:
        print(f"Server started successfully!")
        print(f"Ready to serve requests...")
        print()
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n\nServer stopped.")
except OSError as e:
    if "Address already in use" in str(e):
        print(f"ERROR: Port {PORT} is already in use!")
        print()
        print("Please close other programs using port 8080")
        print("Or edit iniciar.py to use a different port")
        print()
        input("Press Enter to exit...")
    else:
        raise
