#!/usr/bin/env sh

clean_front(){
  rm -rf front_web/dist
}
build_jar(){
  gradle clean
  gradle build -i --stacktrace
}
build_docker(){
   docker-compose build --no-cache
}
start(){
  docker-compose up -d
}
clean_front
build_jar
build_docker
start
