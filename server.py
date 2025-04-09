#!/usr/bin/env python3
"""
Simple HTTP server for the Amharic Learning Web App
"""
import http.server
import socketserver

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    # Use default directory setting
    pass

def main():
    httpd = socketserver.TCPServer(("", PORT), Handler)
    print("Serving at http://localhost:{}".format(PORT))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.server_close()

if __name__ == "__main__":
    main()
