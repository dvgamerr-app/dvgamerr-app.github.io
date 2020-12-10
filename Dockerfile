FROM node:lts as builder

WORKDIR /src
COPY . /src

RUN npm i \
    npm run build

FROM nginx:alpine
EXPOSE 80
COPY --from=builder /src/dist /usr/share/nginx/html
