import http.server
import socketserver
import webbrowser
import os
import threading

PORT = 8080
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def open_browser():
    import time
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{PORT}')

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

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
