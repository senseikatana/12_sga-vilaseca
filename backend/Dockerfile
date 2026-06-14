FROM oven/bun:1.2-alpine

WORKDIR /srv

# Copiar dependencias primero (capa de caché)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copiar fuente
COPY . .

# /app es el disco persistente de Render — la DB vive ahí
# En local simplemente crea la carpeta
RUN mkdir -p /app

# Cambiar el directorio de trabajo a /app para que bun:sqlite
# cree warehouse.db dentro del disco persistente
WORKDIR /app

EXPOSE 10000

CMD ["bun", "/srv/src/index.ts"]
