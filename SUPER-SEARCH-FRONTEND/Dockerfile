FROM public.ecr.aws/bitnami/node:18

WORKDIR /app

COPY package.json .

RUN npm install --loglevel verbose

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "preview", "--", "--host" ]