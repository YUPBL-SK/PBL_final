FROM node:21.1.0

WORKDIR pbl

COPY client/package.json client/package-lock.json ./

RUN npm install

FROM python:3.11

COPY server/requirements.txt requirements.txt

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "-u", "server/server.py", "34.22.109.222:5000"]