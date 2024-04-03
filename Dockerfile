FROM node:20-alpine

WORKDIR /app

# root pjson
COPY package.json .
# pkgs
COPY . .

EXPOSE 3000
EXPOSE 8080

# ARG NODE_ENV=production
RUN npm i -g pnpm
RUN npm i -g turbo
RUN pnpm install
RUN turbo build
CMD ["pnpm", "run", "start"]