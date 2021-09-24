FROM bitnine/agensgraph
RUN apk update \
  && apk add wget tar gcc git postgresql-dev openssl  g++  make libffi-dev openssl-dev\
	&& rm -rf /var/lib/apt/lists/*
RUN wget -q -O - "http://www.xunsearch.com/scws/down/scws-1.2.3.tar.bz2" | tar xjf - \
  && wget -O zhparser.zip "https://github.com/amutu/zhparser/archive/master.zip" \
  && unzip zhparser.zip \
  && cd scws-1.2.3 \
  && ./configure \
  && make install \
  && cd /zhparser-master \
  && SCWS_HOME=/usr/local make && make install

ADD init.sql /docker-entrypoint-initdb.d/
