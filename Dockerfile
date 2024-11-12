FROM node

WORKDIR /server

COPY package*.json .

RUN npm install

COPY index.js .

EXPOSE 8000

CMD ["npm", "run", "dev"]