# Use an official Java 21 runtime image as the base image
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper files first
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission to the Maven wrapper
RUN chmod +x mvnw

# Download dependencies first to improve Docker layer caching
RUN ./mvnw dependency:go-offline

# Copy the rest of the backend source code
COPY src src

# Build the Spring Boot application and skip tests for now
RUN ./mvnw clean package -DskipTests

# Expose the application port
EXPOSE 8080

# Run the packaged Spring Boot jar file
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]