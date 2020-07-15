FROM node:12.13.0-alpine

RUN mkdir -p /microservice
ADD . /microservice
WORKDIR /microservice

RUN npm install --production
RUN npm run build:prod
EXPOSE ${APPLICATION_PORT}

CMD ["npm", "run", "prod"]
