FROM node:20-alpine
RUN npm install -g @nestjs/cli
WORKDIR /api
COPY package*.json ./
RUN npm install
RUN npm list @nestjs/jwt > /dev/null 2>&1 || npm install @nestjs/jwt
RUN npm list @nestjs/passport > /dev/null 2>&1 || npm install @nestjs/passport
RUN npm list passport > /dev/null 2>&1 || npm install passport
RUN npm list passport-jwt > /dev/null 2>&1 || npm install passport-jwt
RUN npm list bcrypt > /dev/null 2>&1 || npm install bcrypt
RUN npm list cookie-parser > /dev/null 2>&1 || npm install cookie-parser
RUN npm list @nestjs/config > /dev/null 2>&1 || npm install @nestjs/config
RUN npm list @nestjs/mongoose > /dev/null 2>&1 || npm install @nestjs/mongoose
RUN npm list mongoose > /dev/null 2>&1 || npm install mongoose
RUN npm list class-validator > /dev/null 2>&1 || npm install class-validator
RUN npm list class-transformer > /dev/null 2>&1 || npm install class-transformer
RUN npm list @types/bcrypt > /dev/null 2>&1 || npm install -D @types/bcrypt
RUN npm list @types/passport-jwt > /dev/null 2>&1 || npm install -D @types/passport-jwt
RUN npm list @types/cookie-parser > /dev/null 2>&1 || npm install -D @types/cookie-parser
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
