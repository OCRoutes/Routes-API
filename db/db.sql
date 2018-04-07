DROP TABLE IF EXISTS stops;
CREATE TABLE stops(
    stop_id VARCHAR(15) NOT NULL,
    stop_code CHAR(4),
    stop_name VARCHAR(100) NOT NULL,
    stop_desc VARCHAR(100),
    stop_lat DECIMAL NOT NULL,
    stop_lon DECIMAL NOT NULL,
    zone_id SMALLINT,
    stop_url VARCHAR(100),
    location_type SMALLINT,
    PRIMARY KEY(stop_id)
);

COPY stops FROM '/usr/db/google_transit/stops.txt' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS routes;
CREATE TABLE routes(
    route_id VARCHAR(15) NOT NULL,
    route_short_name VARCHAR(15) NOT NULL,
    route_long_name VARCHAR(100),
    route_desc VARCHAR(100),
    route_type SMALLINT NOT NULL,
    route_url VARCHAR(100),
    PRIMARY KEY(route_id)
);

COPY routes FROM '/usr/db/google_transit/routes.txt' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS calendar;
CREATE TABLE calendar(
    service_id VARCHAR(50) NOT NULL,
    monday BIT(1),
    tuesday BIT(1),
    wednesday BIT(1),
    thursday BIT(1),
    friday BIT(1),
    saturday BIT(1),
    sunday BIT(1),
    start_date DATE,
    end_date DATE,
    PRIMARY KEY(service_id)
);

COPY calendar FROM '/usr/db/google_transit/calendar.txt' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS trips;
CREATE TABLE trips(
    route_id VARCHAR(15) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    trip_id VARCHAR(150) NOT NULL,
    trip_headsign VARCHAR(100) NOT NULL,
    direction_id BIT(1),
    block_id INTEGER NOT NULL,
    PRIMARY KEY(trip_id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    FOREIGN KEY (service_id) REFERENCES calendar(service_id)
);

COPY trips FROM '/usr/db/google_transit/trips.txt' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS stop_times;
CREATE TABLE stop_times(
    trip_id VARCHAR(150) NOT NULL,
    arrival_time CHAR(8) NOT NULL,
    departure_time CHAR(8) NOT NULL,
    stop_id VARCHAR(15) NOT NULL,
    stop_sequence SMALLINT NOT NULL,
    pickup_type SMALLINT NOT NULL,
    drop_off_type SMALLINT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id),
    FOREIGN KEY (stop_id) REFERENCES stops(stop_id)
);

COPY stop_times FROM '/usr/db/google_transit/stop_times.txt' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS calendar_dates;
CREATE TABLE calendar_dates(
    service_id VARCHAR(50) NOT NULL,
    date DATE,
    exception_type SMALLINT,
    FOREIGN KEY (service_id) REFERENCES calendar(service_id)
);

COPY calendar_dates FROM '/usr/db/google_transit/calendar_dates.txt' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS routes_extended;
CREATE TABLE routes_extended(
    route_id VARCHAR(15),
    direction_id BIT(1),
    trip_headsign VARCHAR(100),
    route_short_name VARCHAR(15),
    FOREIGN KEY(route_id) REFERENCES routes(route_id),
    PRIMARY KEY(route_id, route_direction)
);

INSERT INTO routes_extended(route_id, route_name, route_headsign, route_direction)
SELECT DISTINCT trips.route_id, routes.route_short_name, trips.trip_headsign, trips.direction_id
FROM trips
INNER JOIN routes ON routes.route_id = trips.route_id
GROUP BY trips.route_id, routes.route_short_name, trips.trip_headsign, trips.direction_id;

ALTER TABLE stops ADD COLUMN stop_routes JSON[];
UPDATE stops
SET stop_routes = subquery.routes_array
FROM (SELECT stop_id, ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('route_id', trips.route_id, 'route_short_name', route_short_name, 'trip_headsign', trip_headsign, 'direction_id', direction_id)) AS routes_array
      FROM trips
      INNER JOIN stop_times ON (stop_times.trip_id = trips.trip_id)
      INNER JOIN routes ON (routes.route_id = trips.route_id)
      GROUP BY stop_id) AS subquery
WHERE stops.stop_id = subquery.stop_id;