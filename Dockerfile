FROM registry.cn-hangzhou.aliyuncs.com/fandow/node:14.4-alpine

ARG buildenv
ARG NODE_ENV

ENV buildenv=${buildenv}
ENV NODE_ENV=${NODE_ENV}
#ENV NODE_ENV=test
#ENV start=${start}
ENV HOST 0.0.0.0

#ARG start

RUN mkdir -p /opt

RUN echo "http://mirrors.aliyun.com/alpine/v3.9/main/" > /etc/apk/repositories

#安装 bash 和 busybox
RUN apk update \
  && apk upgrade \
  && apk add --no-cache bash \
  bash-doc \
  bash-completion \
  && /bin/bash \
  && apk add --no-cache busybox \
  && rm -rf /var/cache/apk/*

ADD . /opt

WORKDIR /opt

RUN sed -i s#"host ="#"// host ="#g             server/index.js
RUN sed -ir s#"let port.*"#"let host = \'0.0.0.0\',port=3000"#g            server/index.js
RUN npm run ${buildenv}
RUN npm run build


EXPOSE 3000

# 在下载依赖后根据部署环境替换CMD命令
CMD npm run start
