import unittest
import http.client
import threading
import time
import sys
import os

# Add parent directory to path so we can import server.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import server

class TestServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Start the server in a separate thread
        cls.server_thread = threading.Thread(target=server.main)
        cls.server_thread.daemon = True
        cls.server_thread.start()
        # Wait for server to start
        time.sleep(1)

    def setUp(self):
        self.conn = http.client.HTTPConnection("localhost", 8000)

    def tearDown(self):
        self.conn.close()

    def test_index_page(self):
        """Test that the index page is served correctly"""
        self.conn.request("GET", "/")
        response = self.conn.getresponse()
        content = response.read().decode()
        
        self.assertEqual(response.status, 200)
        self.assertIn("<!DOCTYPE html>", content)
        self.assertIn("አማርኛ ለልጆች", content)

    def test_css_file(self):
        """Test that the CSS file is served correctly"""
        self.conn.request("GET", "/static/css/styles.css")
        response = self.conn.getresponse()
        content = response.read().decode()
        
        self.assertEqual(response.status, 200)
        self.assertIn("--eth-green", content)

    def test_js_file(self):
        """Test that the JavaScript file is served correctly"""
        self.conn.request("GET", "/static/js/script.js")
        response = self.conn.getresponse()
        content = response.read().decode()
        
        self.assertEqual(response.status, 200)
        self.assertIn("DOMContentLoaded", content)

    def test_404_response(self):
        """Test that non-existent paths return 404"""
        self.conn.request("GET", "/nonexistent")
        response = self.conn.getresponse()
        self.assertEqual(response.status, 404)

if __name__ == '__main__':
    unittest.main()
