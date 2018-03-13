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

DROP TABLE IF EXISTS trips;
CREATE TABLE trips(
    route_id VARCHAR(15) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    trip_id VARCHAR(150) NOT NULL,
    trip_headsign VARCHAR(100) NOT NULL,
    direction_id BIT(1),
    block_id INTEGER NOT NULL,
    PRIMARY KEY(trip_id)
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
    drop_off_type SMALLINT NOT NULL
);

COPY stop_times FROM '/usr/db/google_transit/stop_times.txt' DELIMITER ',' CSV HEADER;

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

DROP TABLE IF EXISTS calendar_dates;
CREATE TABLE calendar_dates(
    service_id VARCHAR(50) NOT NULL,
    date DATE,
    exception_type SMALLINT
);

COPY calendar_dates FROM '/usr/db/google_transit/calendar_dates.txt' DELIMITER ',' CSV HEADER;