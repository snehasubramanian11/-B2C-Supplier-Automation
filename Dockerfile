FROM cypress/included:16.2.1
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN mkdir -p cypress/reports cypress/screenshots cypress/videos
ENTRYPOINT ["./node_modules/.bin/cypress"]
CMD ["run"]
