ARG NODE_VERSION=14.16.0
ARG ALPINE_VERSION=3.13
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}

WORKDIR /zip-build

RUN set -ex \
    && apk --update add --no-cache \
        git \
        bash

COPY package*.json ./
RUN npm install --no-progress --ignore-optional

CMD ["sleep", "infinity"]
