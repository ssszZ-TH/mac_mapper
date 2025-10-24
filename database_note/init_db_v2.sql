-- Drop tables in reverse order to avoid foreign key conflicts
DROP TABLE IF EXISTS communication_event_purpose_history CASCADE;
DROP TABLE IF EXISTS communication_event_purpose CASCADE;
DROP TABLE IF EXISTS communication_event_history CASCADE;
DROP TABLE IF EXISTS communication_event CASCADE;
DROP TABLE IF EXISTS person_history CASCADE;
DROP TABLE IF EXISTS organization_history CASCADE;
DROP TABLE IF EXISTS persons CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS users_history CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS gender_types CASCADE;
DROP TABLE IF EXISTS marital_status_types CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS racial_types CASCADE;
DROP TABLE IF EXISTS income_ranges CASCADE;
DROP TABLE IF EXISTS organization_types CASCADE;
DROP TABLE IF EXISTS industry_types CASCADE;
DROP TABLE IF EXISTS contact_mechanism_types CASCADE;
DROP TABLE IF EXISTS communication_event_status_types CASCADE;
DROP TABLE IF EXISTS communication_event_purpose_types CASCADE;

-- Type Layer: Reference data
CREATE TABLE gender_types (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE marital_status_types (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    iso_code VARCHAR(3) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_th VARCHAR(100)
);

CREATE TABLE racial_types (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE income_ranges (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE organization_types (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE industry_types (
    id SERIAL PRIMARY KEY,
    naisc VARCHAR(10) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE contact_mechanism_types (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE communication_event_status_types (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE communication_event_purpose_types (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

-- Core Layer: Users as supertype
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) CHECK (role IN ('system_admin', 'basetype_admin', 'hr_admin', 'organization_admin', 'organization_user', 'person_user')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- History Layer: Users history
CREATE TABLE users_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(50),
    action VARCHAR(50),
    action_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action_by INT
);

-- Core Layer: Persons
CREATE TABLE persons (
    id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    personal_id_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    nick_name VARCHAR(255),
    birth_date DATE NOT NULL,
    gender_type_id INT REFERENCES gender_types(id) ON DELETE SET NULL,
    marital_status_type_id INT REFERENCES marital_status_types(id) ON DELETE SET NULL,
    country_id INT REFERENCES countries(id) ON DELETE SET NULL,
    height INT NOT NULL,
    weight INT NOT NULL,
    racial_type_id INT REFERENCES racial_types(id) ON DELETE SET NULL,
    income_range_id INT REFERENCES income_ranges(id) ON DELETE SET NULL,
    about_me TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- History Layer: Person history
CREATE TABLE person_history (
    id SERIAL PRIMARY KEY,
    person_id INT REFERENCES persons(id) ON DELETE SET NULL,
    personal_id_number VARCHAR(50),
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    nick_name VARCHAR(255),
    birth_date DATE,
    gender_type_id INT,
    marital_status_type_id INT,
    country_id INT,
    height INT,
    weight INT,
    racial_type_id INT,
    income_range_id INT,
    about_me TEXT,
    action VARCHAR(50),
    action_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action_by INT
);

-- Core Layer: Organizations
CREATE TABLE organizations (
    id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    federal_tax_id VARCHAR(50),
    name_en VARCHAR(255) NOT NULL,
    name_th VARCHAR(255),
    organization_type_id INT REFERENCES organization_types(id) ON DELETE SET NULL,
    industry_type_id INT REFERENCES industry_types(id) ON DELETE SET NULL,
    employee_count INT,
    slogan TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- History Layer: Organization history
CREATE TABLE organization_history (
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id) ON DELETE SET NULL,
    federal_tax_id VARCHAR(50),
    name_en VARCHAR(255),
    name_th VARCHAR(255),
    organization_type_id INT,
    industry_type_id INT,
    employee_count INT,
    slogan TEXT,
    action VARCHAR(50),
    action_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action_by INT
);

-- Communication Layer: Communication events
CREATE TABLE communication_event (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    from_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    to_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    contact_mechanism_type_id INT REFERENCES contact_mechanism_types(id) ON DELETE SET NULL,
    communication_event_status_type_id INT REFERENCES communication_event_status_types(id) ON DELETE SET NULL,
    favorite_flag BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Index for communication_event
CREATE INDEX idx_communication_event_from_to ON communication_event (from_user_id, to_user_id);

-- History Layer: Communication event history
CREATE TABLE communication_event_history (
    id SERIAL PRIMARY KEY,
    communication_event_id INT REFERENCES communication_event(id) ON DELETE SET NULL,
    title VARCHAR(255),
    detail TEXT,
    from_user_id INT,
    to_user_id INT,
    contact_mechanism_type_id INT,
    communication_event_status_type_id INT,
    favorite_flag BOOLEAN NOT NULL DEFAULT FALSE,
    action VARCHAR(50),
    action_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action_by INT
);

-- Communication Layer: Communication event purposes
CREATE TABLE communication_event_purpose (
    id SERIAL PRIMARY KEY,
    detail TEXT,
    communication_event_id INT REFERENCES communication_event(id) ON DELETE SET NULL,
    communication_event_purpose_type_id INT REFERENCES communication_event_purpose_types(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- History Layer: Communication event purpose history
CREATE TABLE communication_event_purpose_history (
    id SERIAL PRIMARY KEY,
    communication_event_purpose_id INT REFERENCES communication_event_purpose(id) ON DELETE SET NULL,
    detail TEXT,
    communication_event_id INT,
    communication_event_purpose_type_id INT,
    action VARCHAR(50),
    action_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action_by INT
);