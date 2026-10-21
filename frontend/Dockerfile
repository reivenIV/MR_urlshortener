# DEV image: runs `next dev`. docker-compose mounts the source code over /app,
# so saving a file on your machine updates the browser instantly.
FROM node:24
WORKDIR /app

# Install dependencies inside the image (cached until package*.json change).
COPY package.json package-lock.json ./
RUN npm ci

# Copy the code too, so the image also works without the mount.
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
