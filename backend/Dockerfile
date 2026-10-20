# code comes from the bind mount, not COPY
# node22 npm crashes here, use 24
FROM node:24
WORKDIR /app

# cached unless package.json changes
COPY package.json package-lock.json ./
RUN npm ci

EXPOSE 3003

# generate client + apply migrations before starting, every time
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start:dev"]
