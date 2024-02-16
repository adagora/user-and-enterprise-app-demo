CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS enterprises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  tax_id VARCHAR(20) UNIQUE NOT NULL,
  address TEXT
);

CREATE TABLE IF NOT EXISTS user_enterprise_relations (
  user_id INT,
  enterprise_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (enterprise_id) REFERENCES enterprises(id),
  PRIMARY KEY (user_id, enterprise_id)
);