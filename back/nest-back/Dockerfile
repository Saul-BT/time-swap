# ETAPA DE CONSTRUCCIÓN
FROM node:22-alpine AS builder

# compila e instala herramientas para bcrypt
RUN apk add --no-cache python3 make g++

# gestor de paquetes npnm
RUN corepack enable

# define la carpeta de trabajo
WORKDIR /app

# copia los paquetes que describen las dependencias. Docker luego guarda el resultado de instalar las dependencias
# en el caché si es necesario
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# instala la versión exacta de las librearías y falla si no coinciden
RUN pnpm install --frozen-lockfile

# copia el resto del código completo que no esté excluido por .dockerignore
COPY . .

# ejecuta el script y genera la carpeta build
RUN pnpm run build

# ETAPA DE PRODUCCIÓN
FROM node:22-alpine AS runner

# reinstalamos herramientas
RUN apk add --no-cache python3 make g++

# reinstalamos el gestor de paquetes
RUN corepack enable

# usamos la misma carpeta de trabajo pero aquí empieza vacía
WORKDIR /app

# definimos la variable de entorno de producción en el contenedor
ENV NODE_ENV=production

# instalamos solo las dependencias necesarias para ejecutar la app con --prod
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# copiamos la carpeta /dist ya compilada de la etapa de builder
COPY --from=builder /app/dist ./dist

# copiamos las carpetas necesarias fuera de la ruta /dist
COPY --from=builder /app/src/templates ./src/templates
COPY --from=builder /app/assets ./assets

# declaramos el puerto
EXPOSE 8001

# comando que ejecuta Node.js una vez arrancado el contenedor
CMD ["node", "dist/main"]