-- ==========================================================
-- Employee CRUD App - Database Setup Script
-- ==========================================================
-- This script is OPTIONAL. The Spring Boot app is configured
-- with createDatabaseIfNotExist=true and ddl-auto=update, so
-- it will automatically create the database and table for you
-- on first run. Run this manually only if you prefer to set
-- things up yourself first, or want some sample data.
-- ==========================================================

CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    department VARCHAR(100),
    salary DOUBLE
);

-- Sample data (optional)
INSERT INTO employees (first_name, last_name, email, department, salary) VALUES
('John', 'Doe', 'john.doe@company.com', 'Engineering', 75000.00),
('Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 65000.00),
('Alice', 'Johnson', 'alice.johnson@company.com', 'Human Resources', 58000.00);
