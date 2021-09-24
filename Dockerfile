FROM openjdk:15
WORKDIR /shiyi_topology
ENV DATADOURSE_URL jdbc:agensgraph://agensgraph:5432/shiyi_topology
ENV DATADOURSE_USERNAME postgres
ENV DATADOURSE_PASSWORD agensgraph
ENV SEARCH_URL http://meilisearch:7700

COPY build/libs/shiyi_topology-1.0-SNAPSHOT.jar shiyi_topology.jar
ENV JAVA_OPTS -Xmx1024m -Xms1024m
ENV SPRING_OPTS=""
CMD java -jar -server -Duser.timezone=GMT+8 -Duser.timezone=GMT+8 -Dserver.port=8080 $JAVA_OPTS \
       shiyi_topology.jar $SPRING_OPTS \
      --spring.datasource.url=$DATADOURSE_URL \
      --spring.datasource.username=$DATADOURSE_USERNAME \
      --spring.datasource.password=$DATADOURSE_PASSWORD \
      --search.url=$SEARCH_URL
EXPOSE 8080