# Estiva docs — production image.
#
# Static HTML behind nginx, served at the root of `docs.estiva.app`. Same shape
# as Estiva Ship's image, including a **public GHCR package** so the box needs
# no registry credentials.
#
# Be clear about what that means, because it is a decision and not an oversight:
# this image contains the documents themselves, so **the password gates the
# website, not the content.** Anyone who knows to try
# `docker pull ghcr.io/estiva-app/estiva-docs:main` gets the whole site without
# it.
#
# Accepted deliberately (2026-08-19): what is published here is the protocol
# specification, which is intended to become public anyway. The gate exists
# because the docs are unfinished, not because they are confidential, and
# obscurity is a fair match for "not ready yet". The alternative — a private
# package — costs a standing registry credential on the box, which the whole
# deploy posture otherwise avoids.
#
# If something genuinely confidential is ever added to site/nav.mjs, this trade
# stops being valid and the package has to go private. See deploy/README.md.

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
