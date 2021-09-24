#!/usr/bin/env sh

build_docker(){
   docker-compose build --no-cache
}
start(){
  docker-compose -f docker-compose-quick.yml up -d
}
build_docker
start
