-- Create projects table
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,

  user_id BIGINT NOT NULL,
  client_id BIGINT NOT NULL,

  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'PLANNED',
  budget NUMERIC(10,2),

  start_date DATE,
  due_date DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_projects_user
      FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

  CONSTRAINT fk_projects_client
      FOREIGN KEY (client_id)
          REFERENCES clients(id)
          ON DELETE CASCADE
);