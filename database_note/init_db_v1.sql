-- backend/app/models/mac_text.sql
DROP TABLE IF EXISTS mac_text;

CREATE TABLE mac_text (
    id SERIAL PRIMARY KEY,
    mac_address VARCHAR(17) NOT NULL UNIQUE,
    sensor_code VARCHAR(10) NOT NULL UNIQUE,
    sensor_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok'),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mac_text_mac ON mac_text(mac_address);
CREATE INDEX idx_mac_text_sensor ON mac_text(sensor_code);