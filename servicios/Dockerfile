# ---------- Build stage: compila el jar en la nube (az acr build) ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /src
# Cachea dependencias primero
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

# ---------- Runtime: JRE 17 ligero ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /src/target/iudigital-1.0.0.jar app.jar
# Roster CSV horneado en la imagen (antes se montaba por volumen; en Container
# Apps no hay volumen local, así que va dentro de la imagen).
COPY data /app/data

# Tu app corre en 8080 (server.port: 8080)
EXPOSE 8080

# Mejoras pequeñitas al runtime
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
