FROM node:lts-slim

WORKDIR /app
COPY . .
RUN npm install -g http-server && \
    npm ci --only=production

EXPOSE 8080
CMD ["sh", "-c", "node scripts/build_dashboard_no_playwright.js && http-server . -p 8080"]