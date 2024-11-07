FROM node

WORKDIR /server

COPY package*.json .

COPY index.js .

RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev"]