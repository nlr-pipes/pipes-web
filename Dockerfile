# Public default: builds anywhere with stock nginx (docker build .). Appfleet builds select the
# `split-nginx` stage with target_arg and pass NGINX_REPO / BASE_IMAGE_TAG (the nrel-split-nginx fork and its
# centrally managed version), so the shipped image is the supported ECS base.
ARG NGINX_REPO=nginx
ARG BASE_IMAGE_TAG=1.30-alpine

FROM node:22-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install --omit=dev
RUN npm run build

# Appfleet / ECS: nrel-split-nginx (wodby layout, "html" preset = SPA fallback to index.html)
FROM ${NGINX_REPO}:${BASE_IMAGE_TAG} AS split-nginx

ENV NGINX_BACKEND_HOST="html" \
    NGINX_VHOST_PRESET="html" \
    NGINX_SERVER_ROOT="/var/www/html/web"

USER root
WORKDIR /var/www/html
COPY --from=builder --chown=wodby:wodby /app/build web/
USER wodby

# Default stage (last): stock nginx for public and local builds
FROM nginx:1.30-alpine AS nginx

ENV NODE_ENV development
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/${NODE_ENV}.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
