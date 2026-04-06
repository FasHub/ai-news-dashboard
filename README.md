# AI News Dashboard

This project demonstrates how to combine the full set of MCP tools to build a **real‑time AI news aggregator**.

## What it does
1. **Search** the web for the latest AI stories (SearxNG).
2. **Navigate** to each article, take a screenshot and fetch the raw HTML.
3. Convert the raw page into **Markdown** (markdownify).
4. Store metadata in a **MySQL** database.
5. Generate a quick **summary** using an embedded Node sandbox.
6. Serve the result as a static HTML page (`index.html`) with CSS styling.

## How it works
Each step is implemented as a separate function call that can be executed from the MCP console.  The workflow can be orchestrated by a simple Node script or shell wrapper.

## Getting Started
```bash
# 1. Create a database table:
mysql -u admin -ppassword emc -e "CREATE TABLE articles (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), url TEXT, date DATE);"

# 2. Run the pipeline (pseudo‑code):
#   - searxng_web_search
#   - loop over results:
#       browser_navigate, browser_take_screenshot, web_url_read
#       markdownify
#       write_file (article.md)
#       mysql_query (INSERT)
#   - generate summary with run_js_ephemeral
#   - update index.html (append article sections)
```

## Future Enhancements
- Add a simple search bar on the front‑end.
- Use a static site generator (e.g., Eleventy) to build the site.
- Deploy to GitHub Pages or Netlify.

## Run with Docker (one command)
If you have Docker installed, you can build and run the dashboard in a single step:

```bash
docker build -t ai-news-dashboard .
docker run --rm -p 8080:8080 ai-news-dashboard
```
The container will:
1. Run `node scripts/build_dashboard_no_playwright.js` to scrape the three example articles, generate screenshots and Markdown files, and build `index.html`.
2. Start a lightweight HTTP server (`http-server`) that serves the dashboard on port **8080**.

Open <http://localhost:8080> in your browser to see the result.

Happy hacking!