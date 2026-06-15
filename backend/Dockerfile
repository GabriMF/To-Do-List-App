FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY . .
RUN chmod +x ./backend/mvnw
RUN ./backend/mvnw clean package -DskipTests
CMD ["sh", "-c", "java -jar target/*.jar"]