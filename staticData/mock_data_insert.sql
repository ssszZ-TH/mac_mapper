-- Copy data from CSV files
COPY gender_types (id, description)
FROM '/staticData/gender_types.csv'
DELIMITER ','
CSV HEADER;

COPY marital_status_types (id, description)
FROM '/staticData/marital_status_types.csv'
DELIMITER ','
CSV HEADER;

COPY countries (id, iso_code, name_en, name_th)
FROM '/staticData/countries.csv'
DELIMITER ','
CSV HEADER;

COPY racial_types (id, description)
FROM '/staticData/racial_types.csv'
DELIMITER ','
CSV HEADER;

COPY income_ranges (id, description)
FROM '/staticData/income_ranges.csv'
DELIMITER ','
CSV HEADER;

COPY organization_types (id, description)
FROM '/staticData/organization_types.csv'
DELIMITER ','
CSV HEADER;

COPY industry_types (id, naisc, description)
FROM '/staticData/industry_types.csv'
DELIMITER ','
CSV HEADER;

COPY contact_mechanism_types (id, description)
FROM '/staticData/contact_mechanism_types.csv'
DELIMITER ','
CSV HEADER;

COPY communication_event_status_types (id, description)
FROM '/staticData/communication_event_status_types.csv'
DELIMITER ','
CSV HEADER;

COPY communication_event_purpose_types (id, description)
FROM '/staticData/communication_event_purpose_types.csv'
DELIMITER ','
CSV HEADER;

COPY users (id, username, password, email, role)
FROM '/staticData/users.csv'
DELIMITER ','
CSV HEADER;

COPY persons (id, personal_id_number, first_name, middle_name, last_name, nick_name, birth_date, gender_type_id, marital_status_type_id, country_id, height, weight, racial_type_id, income_range_id, about_me)
FROM '/staticData/persons.csv'
DELIMITER ','
CSV HEADER;

COPY organizations (id, federal_tax_id, name_en, name_th, organization_type_id, industry_type_id, employee_count, slogan)
FROM '/staticData/organizations.csv'
DELIMITER ','
CSV HEADER;

COPY communication_event (id, title, detail, from_user_id, to_user_id, contact_mechanism_type_id, communication_event_status_type_id)
FROM '/staticData/communication_event.csv'
DELIMITER ','
CSV HEADER;

-- Reset sequence for all tables
DO $$
DECLARE
    r RECORD;
    max_id BIGINT;
    seq_name TEXT;
    curr_val BIGINT;
BEGIN
    FOR r IN 
        SELECT 
            t.table_name,
            c.column_default
        FROM information_schema.tables t
        JOIN information_schema.columns c 
            ON t.table_name = c.table_name 
            AND t.table_schema = c.table_schema
        WHERE t.table_schema = 'public'
          AND c.column_name = 'id'
          AND c.column_default LIKE 'nextval%'
          AND t.table_type = 'BASE TABLE'
    LOOP
        BEGIN
            EXECUTE format('SELECT COALESCE(MAX(id), 0) FROM %I', r.table_name) INTO max_id;
            seq_name := substring(r.column_default FROM 'nextval\(''([^'']+)''');
            IF max_id = 0 THEN
                EXECUTE format('SELECT setval(%L, 1, false)', seq_name);
                RAISE NOTICE 'Table: %, No data, Sequence reset to start at: 1', r.table_name;
            ELSE
                EXECUTE format('SELECT setval(%L, %s, true)', seq_name, max_id);
                RAISE NOTICE 'Table: %, Max ID: %, Sequence reset to start at: %', 
                    r.table_name, max_id, max_id;
            END IF;
            BEGIN
                EXECUTE format('SELECT last_value FROM %s', seq_name) INTO curr_val;
                RAISE NOTICE 'Table: %, Sequence current value after reset: %', 
                    r.table_name, curr_val;
            EXCEPTION
                WHEN OTHERS THEN
                    RAISE NOTICE 'Table: %, Failed to verify sequence: %', r.table_name, SQLERRM;
            END;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error processing table %: %', r.table_name, SQLERRM;
                CONTINUE;
        END;
    END LOOP;
    IF NOT FOUND THEN
        RAISE NOTICE 'No tables with SERIAL id columns found in schema public';
    END IF;
END $$;