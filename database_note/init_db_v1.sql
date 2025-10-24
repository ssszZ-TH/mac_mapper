-- Drop tables in reverse order to avoid foreign key conflicts
DROP TABLE IF EXISTS mac_text

-- Type Layer: Reference data
CREATE TABLE mac_text (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);
