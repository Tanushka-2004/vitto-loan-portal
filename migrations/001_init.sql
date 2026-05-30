CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    language VARCHAR(20) NOT NULL CHECK (language IN ('Hindi', 'Tamil', 'Telugu', 'Marathi', 'English')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW()
);