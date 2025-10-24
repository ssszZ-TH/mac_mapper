DROP TABLE IF EXISTS mac_text;

CREATE TABLE mac_text (
    id SERIAL PRIMARY KEY,
    mac_address VARCHAR(17) NOT NULL UNIQUE,
    description TEXT NOT NULL
);

CREATE INDEX idx_mac_text_mac ON mac_text(mac_address);