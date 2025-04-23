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
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)
import server

class TestFrontend:
    @classmethod
    def setup_class(cls):
        # Kill any running servers on port 8000
        os.system("lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true")
        # Store current directory
        cls.original_dir = os.getcwd()
        # Change to parent directory before starting server
        os.chdir(parent_dir)
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
        # Default to the learn page for most tests
        self.driver.get('http://localhost:8000/learn.html')

    def teardown_method(self):
        self.driver.quit()
        
    @classmethod
    def teardown_class(cls):
        # Change back to original directory
        os.chdir(cls.original_dir)

    def test_page_title(self):
        """Test that the page title is correct"""
        # Test works on both pages as they share the same title
        assert "አማርኛ ለልጆች" in self.driver.title

    def test_menu_buttons(self):
        """Test that all menu buttons are present"""
        menu_items = self.driver.find_elements(By.CLASS_NAME, 'menu-item')
        assert len(menu_items) == 4
        expected_sections = ['alphabet', 'sounds', 'words', 'phrases']
        for item, expected in zip(menu_items, expected_sections):
            assert item.get_attribute('data-section') == expected

    def test_menu_button_click(self):
        """Test that clicking a menu button updates the content"""
        # Click the alphabet button
        alphabet_button = self.driver.find_element(By.CSS_SELECTOR, '[data-section="alphabet"]')
        alphabet_button.click()
        
        # Wait for content to update
        content = WebDriverWait(self.driver, 3).until(
            EC.presence_of_element_located((By.ID, "content"))
        )
        
        # Wait a bit more for content to load
        time.sleep(1)
        
        # Either the actual content should have loaded, or we should find the hidden section title
        section_title = self.driver.find_elements(By.CLASS_NAME, "section-title")
        if section_title:
            assert "Alphabet" in section_title[0].get_attribute("textContent")
        else:
            # Check if the fully loaded content contains the title
            assert "Alphabet" in content.text

    def test_responsive_design(self):
        """Test that the page is responsive"""
        # Test mobile width
        self.driver.set_window_size(375, 812)  # iPhone X dimensions
        time.sleep(1.5)  # Wait longer for CSS to apply properly

        # For mobile view, check if the menu buttons are displayed properly
        menu = self.driver.find_element(By.CLASS_NAME, 'main-menu')
        computed_style = self.driver.execute_script(
            "return window.getComputedStyle(arguments[0]).getPropertyValue('display')", 
            menu
        )
        
        # On mobile, the menu should have either grid or flex display
        assert computed_style in ['grid', 'flex', '-webkit-flex', '-ms-grid'], "Menu should have appropriate display on mobile"

        # Test desktop width
        self.driver.set_window_size(1024, 768)
        time.sleep(0.5)  # Wait for CSS to apply

        # Re-get elements after resize
        menu_items = self.driver.find_elements(By.CLASS_NAME, 'menu-item')
        item1_rect = menu_items[0].rect
        item2_rect = menu_items[1].rect

        # On desktop, first two items should be side by side
        assert item1_rect['y'] == item2_rect['y'], "Menu items should be on same row on desktop"
        assert item2_rect['x'] > item1_rect['x'], "Second item should be to the right of first item"
