FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm list axios > /dev/null 2>&1 || npm install axios
RUN npm list react-router-dom > /dev/null 2>&1 || npm install react-router-dom
COPY . .
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
