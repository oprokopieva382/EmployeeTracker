DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) 
  REFERENCES department(id)
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL,
  manager_id INT DEFAULT NULL,
  FOREIGN KEY (role_id) 
  REFERENCES role(id),
  FOREIGN KEY (manager_id) 
  REFERENCES employees(id)
  ON DELETE SET NULL
)