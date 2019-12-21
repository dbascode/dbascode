FROM node:12-slim

WORKDIR /dbascode

RUN seq 1 8 | xargs -I{} mkdir -p /usr/share/man/man{} \
	&& apt-get update \
	&& apt-get -y install postgresql-client yarn \
	&& rm -rf /var/lib/apt/lists/*

RUN node -v

ADD fix-modules.mjs fix-modules.mjs
ADD package.json package.json
ADD app.mjs app.mjs
ADD src/ src/
ADD bin/ bin/

RUN yarn install --prod \
	&& chmod +x /dbascode/bin/dbascode.sh \
	&& yarn fix-modules

ENV DBASCODE_DOCKER=1

RUN mkdir /source
RUN mkdir /output
VOLUME /source
VOLUME /output

ENTRYPOINT ["/dbascode/bin/dbascode.sh"]
