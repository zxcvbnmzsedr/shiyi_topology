#!/usr/bin/env sh

build_docker(){
   docker-compose build agensgraph
}
start(){
  docker compose up -f docker-compose-quick.yml -d
}
build_docker
start
