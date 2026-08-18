# Estiva docs — production image.
#
# Static HTML behind nginx, served at the root of `docs.estiva.app`. Same shape
# as Estiva Ship's image, with one deliberate difference: **this package stays
# private on GHCR.**
#
# The other three services publish their packages so the box needs no registry
# credentials. That works because their images contain a bundle whose contents
# are meant to be fetched by any browser anyway. This one contains the documents
# themselves, so a public package would make the password decorative — anyone
# who knows the package name could `docker pull` the whole site. The gate has to
# cover the image as well as the origin, or it covers neither.

FROM node:24-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY site ./site
COPY README.md ./README.md
COPY protocol ./protocol
COPY local-dev ./local-dev
COPY repos ./repos

# `operations/` is deliberately NOT copied. site/nav.mjs decides what is
# published, and not shipping the private documents into the image at all means
# a future nav mistake cannot expose what was never there.
RUN npm run build


FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache apache2-utils

COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/entrypoint.sh /entrypoint.sh
COPY deploy/healthcheck.sh /healthcheck.sh
RUN chmod +x /entrypoint.sh /healthcheck.sh

EXPOSE 80

# Checks the container is serving *in the mode it was started in*. Health that
# cannot tell "serving" from "serving to anyone" is the wrong check here — a
# dropped gate would otherwise report perfectly healthy.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD /healthcheck.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
