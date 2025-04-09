import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import threading
import time
import sys
import os

# Add parent directory to path so we can import server.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import server

class TestLayout:
    @classmethod
    def setup_class(cls):
        # Start the server in a separate thread
        cls.server_thread = threading.Thread(target=server.main)
        cls.server_thread.daemon = True
        cls.server_thread.start()
        time.sleep(1)  # Wait for server to start

    def setup_method(self):
        # Initialize Chrome in headless mode
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        self.driver = webdriver.Chrome(options=options)

    def teardown_method(self):
        self.driver.quit()

    def test_mobile_layout(self):
        """Test the mobile layout (width < 480px)"""
        self.driver.get('http://localhost:8000')
        self.driver.set_window_size(375, 812)  # iPhone X dimensions
        time.sleep(1)  # Wait for CSS to apply

        # Test main container padding
        main = self.driver.find_element(By.TAG_NAME, 'main')
        main_style = main.value_of_css_property('padding')
        padding_value = int(main_style.replace('px', ''))
        assert padding_value <= 16, "Main padding should be 16px or less on mobile"

        # Test menu container layout behavior
        menu = self.driver.find_element(By.CLASS_NAME, 'main-menu')
        menu_items = menu.find_elements(By.CLASS_NAME, 'menu-item')
        assert len(menu_items) == 4, "Should have exactly 4 menu items"

        # Get the menu's bounding box
        menu_rect = menu.rect
        menu_center = menu_rect['x'] + menu_rect['width'] / 2
        
        # Check each menu item's position and size
        for i, item in enumerate(menu_items):
            item_rect = item.rect
            # Item should not overflow container
            assert item_rect['width'] <= menu_rect['width'], f"Item {i} should not overflow container width"
            # Item should be roughly centered
            item_center = item_rect['x'] + item_rect['width'] / 2
            assert abs(item_center - menu_center) < 20, f"Item {i} should be roughly centered"
            # If not the first item, should be below previous item
            if i > 0:
                prev_item = menu_items[i-1]
                assert item_rect['y'] > prev_item.rect['y'], f"Item {i} should be below item {i-1}"
            # Width should not exceed screen width
            assert item_rect['width'] <= 375, f"Item {i} width should not exceed screen width"

    def test_desktop_layout(self):
        """Test the desktop layout (width > 480px)"""
        self.driver.get('http://localhost:8000')
        self.driver.set_window_size(1024, 768)
        time.sleep(1)  # Wait for CSS to apply

        # Test main container max-width
        main = self.driver.find_element(By.TAG_NAME, 'main')
        main_style = main.value_of_css_property('max-width')
        assert '1200px' in main_style, "Main should have max-width of 1200px on desktop"

        # Test menu container
        menu = self.driver.find_element(By.CLASS_NAME, 'main-menu')
        menu_style = menu.value_of_css_property('display')
        assert menu_style == 'grid', "Menu should use grid on desktop"

        # Test menu items layout
        menu_items = self.driver.find_elements(By.CLASS_NAME, 'menu-item')
        
        # First two items should be on the same row
        item1 = menu_items[0]
        item2 = menu_items[1]
        
        assert abs(item1.rect['y'] - item2.rect['y']) < 5, "First two items should be on same row"
        assert item2.rect['x'] > item1.rect['x'], "Second item should be to the right of first item"

        # Menu width should not exceed max-width
        menu_width = menu.rect['width']
        assert menu_width <= 800, "Menu width should not exceed 800px on desktop"
