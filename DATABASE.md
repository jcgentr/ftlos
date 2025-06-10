# Export tables to CSV files

docker exec -it ftlos-postgres-1 psql -U ftlosuser -d ftlos -c "\COPY athletes TO '/tmp/athletes.csv' WITH (FORMAT CSV, HEADER);"
docker exec -it ftlos-postgres-1 psql -U ftlosuser -d ftlos -c "\COPY teams TO '/tmp/teams.csv' WITH (FORMAT CSV, HEADER);"
docker exec -it ftlos-postgres-1 psql -U ftlosuser -d ftlos -c "\COPY sports TO '/tmp/sports.csv' WITH (FORMAT CSV, HEADER);"
docker exec -it ftlos-postgres-1 psql -U ftlosuser -d ftlos -c "\COPY users TO '/tmp/users.csv' WITH (FORMAT CSV, HEADER);"

# Create data directory if it doesn't exist

mkdir -p ./data

# Copy the CSV files from container to data directory

docker cp ftlos-postgres-1:/tmp/athletes.csv ./data/athletes.csv
docker cp ftlos-postgres-1:/tmp/teams.csv ./data/teams.csv
docker cp ftlos-postgres-1:/tmp/sports.csv ./data/sports.csv
docker cp ftlos-postgres-1:/tmp/users.csv ./data/users.csv
