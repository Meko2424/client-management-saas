CREATE TABLE invoices (
      id BIGSERIAL PRIMARY KEY,

      user_id BIGINT NOT NULL,
      client_id BIGINT NOT NULL,
      project_id BIGINT,

      amount NUMERIC(10,2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',

      issue_date DATE,
      due_date DATE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_invoice_user
          FOREIGN KEY (user_id)
              REFERENCES users(id)
              ON DELETE CASCADE,

      CONSTRAINT fk_invoice_client
          FOREIGN KEY (client_id)
              REFERENCES clients(id)
              ON DELETE CASCADE,

      CONSTRAINT fk_invoice_project
          FOREIGN KEY (project_id)
              REFERENCES projects(id)
              ON DELETE SET NULL
);