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

# Change to dist directory
script_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.join(script_dir, 'dist')

if not os.path.exists(dist_dir):
    print("ERROR: dist folder not found!")
    print("Please run: npm run build")
    input("Press Enter to exit...")
    sys.exit(1)

os.chdir(dist_dir)

print("=" * 50)
print("  TESOURARIA IEAD - Starting...")
print("=" * 50)
print()
print(f"Server running at: http://localhost:{PORT}")
print("Opening browser automatically...")
print()
print("To stop: Press Ctrl+C")
print()

threading.Thread(target=open_browser, daemon=True).start()

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
