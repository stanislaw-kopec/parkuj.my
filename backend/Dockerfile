# --- Etap budowania: kompilacja do JAR-a (obraz z gotowym Mavenem) ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Najpierw pom — warstwa zaleznosci cache'owana osobno od zrodel.
COPY pom.xml .
# Cache mount na repozytorium .m2 — zaleznosci pobierane raz, reuzywane miedzy buildami.
RUN --mount=type=cache,target=/root/.m2 mvn -B dependency:go-offline

# Zrodla i pakowanie (testy pomijane w obrazie).
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B clean package -DskipTests

# --- Etap uruchomieniowy: lekki obraz tylko z JRE ---
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
