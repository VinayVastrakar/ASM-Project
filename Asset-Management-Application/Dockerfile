# ====== Build stage ======
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first (cache-friendly)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build only the runnable jar
COPY src ./src
RUN mvn clean package -DskipTests -Pprod

# ====== Runtime stage ======
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Copy only the thin runnable jar, not original/test jars
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# JVM options tuned for low-memory (Render free tier)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseSerialGC"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
