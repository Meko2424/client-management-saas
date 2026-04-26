-- Create clients table for storing each freelancer's clients
CREATE TABLE clients (
       id BIGSERIAL PRIMARY KEY,

    -- Each client belongs to one registered user
        user_id BIGINT NOT NULL,

    -- Client basic information
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255),
         phone VARCHAR(50),
         company VARCHAR(255),
         notes TEXT,

    -- Timestamps
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key linking client to user
         CONSTRAINT fk_clients_user
             FOREIGN KEY (user_id)
             REFERENCES users(id)
             ON DELETE CASCADE
);