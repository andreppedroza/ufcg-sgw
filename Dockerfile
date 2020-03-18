# Build stage
FROM node:current-alpine as build

RUN apk update; \
    apk add git;  \
    apk add yarn; \
    apk add python2;
WORKDIR /tmp
COPY package*.json ./
RUN yarn install --silent
COPY . .
RUN yarn build

# Release stage
FROM node:current-alpine as release

RUN apk update; \
    apk add git;  \
    apk add yarn;

WORKDIR /bot

COPY package*.json ./

RUN yarn install --production --ignore-scripts --silent

COPY --from=build /tmp/dist ./

USER node

ENTRYPOINT ["node", "bot"]
