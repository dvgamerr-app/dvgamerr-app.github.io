FROM node:lts AS builder

WORKDIR /app
COPY . /app

RUN npm i
RUN npm run build
RUN rm -Rf ./.github \
  ./assets \
  ./components \
  ./docs \
  ./layouts \
  ./pages \
  ./node_modules

FROM node:lts-alpine  

ENV TZ Asia/Bangkok
ENV NODE_ENV production
ENV API_URL https://mr.touno.io
ENV AXIOS_BASE_URL https://mr.touno.io

WORKDIR /app
COPY --from=builder /app .
RUN npm i

CMD ["npm", "start"]

# FROM golang:1.7.3 AS builder
# WORKDIR /go/src/github.com/alexellis/href-counter/
# RUN go get -d -v golang.org/x/net/html  
# COPY app.go    .
# RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .