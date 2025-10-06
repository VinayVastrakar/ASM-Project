# Use Maven with Java 21 for building
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first (cache-friendly)
COPY Asset-Management-Application/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy source code from the subdirectory
COPY Asset-Management-Application/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage with Java 21 JRE
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy the built JAR file from build stage
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# JVM options optimized for container deployment
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseSerialGC"

# Switch to non-root user
USER appuser

# Expose the port that the application runs on
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
