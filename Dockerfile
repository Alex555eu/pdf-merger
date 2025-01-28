########build stage########
FROM maven:3.9.4-eclipse-temurin-21 as maven_build
WORKDIR /app

COPY pom.xml .
# To resolve dependencies in a safe way (no re-download when the source code changes)
RUN mvn clean package -Dmaven.main.skip -Dmaven.test.skip && rm -r target

# To package the application
COPY src ./src
RUN mvn clean package -Dmaven.test.skip

########run stage########
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=maven_build /app/target/*.jar .

#run the app
ENV JAVA_OPTS ""
CMD [ "bash", "-c", "java ${JAVA_OPTS} -jar *.jar -v"]