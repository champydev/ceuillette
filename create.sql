
CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION postgis;
-- Enable Topology
CREATE EXTENSION postgis_topology;
-- Enable PostGIS Advanced 3D
-- and other geoprocessing algorithms
-- sfcgal not available with all distributions
CREATE EXTENSION postgis_sfcgal;
-- fuzzy matching needed for Tiger
CREATE EXTENSION fuzzystrmatch;
CREATE TABLE public."user"
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nom character varying(255) NOT NULL,
  prenom character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  hash character varying(128) NOT NULL,
  activated boolean NOT NULL DEFAULT FALSE,
  created_at date not null default CURRENT_DATE,
  updated_at date not null default CURRENT_DATE,
  deleted_at date default null,
  CONSTRAINT user_pk PRIMARY KEY (id),
  CONSTRAINT user_uk UNIQUE (email)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."user"
  OWNER TO postgres;
