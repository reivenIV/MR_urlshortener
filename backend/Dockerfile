# code comes from the bind mount, not COPY
# node22 npm crashes here, use 24
FROM node:24
WORKDIR /app

# cached unless package.json changes
COPY package.json package-lock.json ./
RUN npm ci

EXPOSE 3003

CMD ["npm", "run", "start:dev"]
