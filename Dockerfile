FROM node:10.16.0-alpine
 
WORKDIR /src

COPY node_modules /src/node_modules
COPY .nuxt /src/.nuxt
COPY .build /src/.build
COPY static /src/static
COPY nuxt.config.js /src
COPY package.json /src

EXPOSE 3000

CMD [ "npm", "start" ]