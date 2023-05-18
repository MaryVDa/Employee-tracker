INSERT INTO department (name)
VALUES 
    ("sales"),
    ("engineering"),
    ("finance"),
    ("legal");

SELECT * FROM DEPARTMENT;

-- engineering department: software engineer, lead engineer
-- finance department: account manager, accountant
-- sales department:sales lead, salesperson
-- legal department: legal team lead, lawyer
INSERT INTO role (title, salary, department_id)
VALUES 
    ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Account Manager", 160000, 3),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

SELECT * FROM ROLE;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("John", "Doe", 1, null),
    ("Aiden", "Peck", 2, 1),
    ("Ruth", "Winter", 3, null),
    ("Scott", "Reese", 4, 3),
    ("Kira", "Hill", 5, null),
    ("Owen", "Webb", 6, 5),
    ("Isaac", "Hood", 7, null),
    ("Jenna", "Rollins", 8, 7);