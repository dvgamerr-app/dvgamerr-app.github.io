FROM node:12.13.0-alpine
LABEL maintainer="Mr.Kananek T. <info@touno.io>"
 
WORKDIR /src
COPY node_modules /src/node_modules
COPY .nuxt /src/.nuxt
COPY .build /src/.build
COPY static /src/static
COPY nuxt.config.js /src
COPY package.json /src

EXPOSE 3000

CMD [ "npm", "start" ]