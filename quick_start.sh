#!/usr/bin/env sh

clean_front(){
  rm -rf front_web/dist
}
build_jar(){
  gradle clean
  gradle build -i --stacktrace
}
build_docker(){
   docker-compose build agensgraph
   docker-compose build --no-cache java_engineer
}
clone_interview(){
  if [ ! -d "interview" ];then
    git clone https://github.com/zxcvbnmzsedr/java_enginner_interview.git && mv  java_enginner_interview interview
    else
    echo "文件夹已经存在"
  fi
}
start(){
  docker compose up -d
}
clean_front
build_jar
build_docker
clone_interview
start
