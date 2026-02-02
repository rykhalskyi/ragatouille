from threading import Event
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from collections import deque
import trafilatura
import re

def simple_crawl(start_url, cancel_event: Event, max_depth=1, filter_regex: str | None = None):
    visited = set()
    queue = deque([(start_url, 0)])
    domain = urlparse(start_url).netloc

    results = []   # ← list of {url, text}

    compiled_regex = None
    if filter_regex:
        try:
            compiled_regex = re.compile(filter_regex)
        except re.error:
            # Invalid regex, ignore it
            pass

    while queue:
        if cancel_event.is_set():
            return

        url, depth = queue.popleft()
        if url in visited or depth > max_depth:
            continue

        if compiled_regex and not compiled_regex.match(url):
            continue

        visited.add(url)
        print(f"[Depth {depth}] {url}")

        # Fetch page
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
        except Exception:
            continue

        soup = BeautifulSoup(response.text, "html.parser")

        # Extract text from the page
        text = trafilatura.extract(response.text)
        if text:
            results.append({"url": url, "text": text})

        # If already at max depth, don't collect more links
        if depth == max_depth:
            continue

        # Extract and process internal links
        for a in soup.find_all("a", href=True):
            if cancel_event.is_set():
                return 

            link = urljoin(url, a["href"])
            parsed = urlparse(link)

            # Only follow links inside same domain
            if parsed.netloc == domain:
                link = link.split("#")[0]  # remove fragments
                if link not in visited:
                    queue.append((link, depth + 1))

    return results