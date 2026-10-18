FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG SITE_URL=http://127.0.0.1:3006
ENV SITE_URL=${SITE_URL}
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3006

CMD ["node", "node_modules/@docusaurus/core/bin/docusaurus.mjs", "serve", "--host", "0.0.0.0", "--port", "3006", "--no-open"]
