# base image
FROM node:18.2.0-alpine

# set working directory
WORKDIR /app

RUN npm install -g vite

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY . .

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install

RUN mkdir node_modules/.vite && chmod -R 777 node_modules/.vite

EXPOSE 3000
# start app
CMD ["npm", "run", "dev"]
