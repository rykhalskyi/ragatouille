from threading import Event
from app.internal.simple_crawler import simple_crawl
import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_requests_get():
    with patch('requests.get') as mock_get:
        yield mock_get

def mock_response(content, status_code=200):
    mock = MagicMock()
    mock.text = content
    mock.status_code = status_code
    mock.raise_for_status = MagicMock()
    if status_code != 200:
        mock.raise_for_status.side_effect = Exception("Failed")
    return mock

def test_simple_crawl_no_filter(mock_requests_get):
    mock_requests_get.side_effect = [
        mock_response('<html><body><a href="http://example.com/page2">Page 2</a></body></html>'),
        mock_response('<html><body>Content of page 2</body></html>')
    ]
    
    results = simple_crawl('http://example.com', Event(), max_depth=1)
    
    assert len(results) == 2
    assert results[0]['url'] == 'http://example.com'
    assert results[1]['url'] == 'http://example.com/page2'

def test_simple_crawl_with_valid_filter(mock_requests_get):
    mock_requests_get.side_effect = [
        mock_response('<html><body><a href="http://example.com/page2">Page 2</a><a href="http://example.com/page3">Page 3</a></body></html>'),
        mock_response('<html><body>Content of page 2</body></html>'),
    ]

    # Test case where start_url matches and it finds another matching url
    results = simple_crawl('http://example.com', Event(), max_depth=1, filter_regex=r'http://example\.com/page2')
    assert len(results) == 0 # start_url does not match

    mock_requests_get.side_effect = [
        mock_response('<html><body><a href="http://example.com/page2">Page 2</a><a href="http://example.com/page3">Page 3</a></body></html>'),
        mock_response('<html><body>Content of page 2</body></html>'),
    ]
    # Test case where start_url matches and it finds another matching url
    results = simple_crawl('http://example.com/page2', Event(), max_depth=1, filter_regex=r'http://example\.com/page2')
    assert len(results) == 1
    assert results[0]['url'] == 'http://example.com/page2'
    

def test_simple_crawl_with_invalid_filter(mock_requests_get):
    mock_requests_get.side_effect = [
        mock_response('<html><body><a href="http://example.com/page2">Page 2</a></body></html>'),
        mock_response('<html><body>Content of page 2</body></html>')
    ]
    
    results = simple_crawl('http://example.com', Event(), max_depth=1, filter_regex='*')
    
    assert len(results) == 2
    assert results[0]['url'] == 'http://example.com'
    assert results[1]['url'] == 'http://example.com/page2'

def test_simple_crawl_empty_filter(mock_requests_get):
    mock_requests_get.side_effect = [
        mock_response('<html><body><a href="http://example.com/page2">Page 2</a></body></html>'),
        mock_response('<html><body>Content of page 2</body></html>')
    ]
    
    results = simple_crawl('http://example.com', Event(), max_depth=1, filter_regex='')
    
    assert len(results) == 2
    assert results[0]['url'] == 'http://example.com'
    assert results[1]['url'] == 'http://example.com/page2'