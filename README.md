# Employee CRUD Application

A full-stack CRUD (Create, Read, Update, Delete) web application built with:

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA (Hibernate)
- **Database:** MySQL
- **Frontend:** Plain HTML, CSS, and JavaScript (no framework, served as static files by Spring Boot)

It manages **Employee** records (first name, last name, email, department, salary) through a REST API and a simple, responsive web UI.

---

## 1. Project Structure

```
employee-crud-app/
├── pom.xml
├── database.sql                 # optional manual DB setup script
├── README.md
└── src/
    └── main/
        ├── java/com/example/crudapp/
        │   ├── CrudAppApplication.java     # main entry point
        │   ├── model/Employee.java         # JPA entity
        │   ├── repository/EmployeeRepository.java
        │   ├── service/EmployeeService.java
        │   ├── controller/EmployeeController.java  # REST endpoints
        │   └── exception/                  # error handling
        └── resources/
            ├── application.properties      # DB config
            └── static/                     # frontend
                ├── index.html
                ├── css/style.css
                └── js/script.js
```

---

## 2. Prerequisites

Install these before running the app:

1. **Java JDK 17 or later**
   Check with: `java -version`
   Download: https://adoptium.net/

2. **Apache Maven 3.6+**
   Check with: `mvn -version`
   Download: https://maven.apache.org/download.cgi
   *(If you use an IDE like IntelliJ IDEA or Eclipse, Maven is usually bundled already.)*

3. **MySQL Server 8.x** (MySQL Community Server)
   Check with: `mysql --version`
   Download: https://dev.mysql.com/downloads/mysql/
   Make sure the MySQL service is running locally on port `3306`.

4. **(Optional)** A REST client like Postman, or just your browser, to test the API directly.

---

## 3. Database Setup

You have two options — pick either one.

### Option A — Let Spring Boot create it automatically (easiest)

The app's `application.properties` is already configured with:

```
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db?createDatabaseIfNotExist=true...
spring.jpa.hibernate.ddl-auto=update
```

This means when you start the app for the first time, it will **automatically create** the `employee_db` database and the `employees` table for you. You don't have to run any SQL manually — just make sure your MySQL server is running and your credentials are correct (see Step 4).

### Option B — Create it manually using the provided script

If you prefer to set it up yourself first (and optionally load sample data):

1. Log into MySQL:
   ```bash
   mysql -u root -p
   ```
2. Run the provided script:
   ```sql
   source /path/to/employee-crud-app/database.sql;
   ```
   Or from your terminal directly:
   ```bash
   mysql -u root -p < database.sql
   ```

This creates the `employee_db` database, the `employees` table, and inserts 3 sample rows.

---

## 4. Configure Database Credentials

Open `src/main/resources/application.properties` and update the username/password to match your local MySQL setup:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```

Replace `root` / `root` with your actual MySQL username and password.

---

## 5. Build and Run the Application

Open a terminal in the project's root folder (the folder containing `pom.xml`) and run:

### Step 1 — Build the project
```bash
mvn clean install
```

### Step 2 — Run the application

Option 1 (recommended for development):
```bash
mvn spring-boot:run
```

Option 2 (run the packaged jar):
```bash
java -jar target/employee-crud-app.jar
```

You should see Spring Boot's startup log, ending with something like:
```
Tomcat started on port(s): 8080 (http)
Started CrudAppApplication in X.XXX seconds
```

---

## 6. Open the Application

Once running, open your browser and go to:

```
http://localhost:8080
```

You'll see the **Employee Management System** UI where you can:
- **Add** a new employee using the form
- **View** all employees in the table
- **Edit** an employee (click "Edit" — the form pre-fills, click "Update Employee")
- **Delete** an employee (click "Delete" and confirm in the popup)

---

## 7. REST API Reference

The frontend talks to these endpoints. You can also test them directly (e.g., with `curl` or Postman):

| Method | Endpoint                  | Description             |
|--------|----------------------------|--------------------------|
| GET    | `/api/employees`           | Get all employees       |
| GET    | `/api/employees/{id}`      | Get one employee by ID  |
| POST   | `/api/employees`           | Create a new employee   |
| PUT    | `/api/employees/{id}`      | Update an employee      |
| DELETE | `/api/employees/{id}`      | Delete an employee      |

**Example — create an employee with curl:**
```bash
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Mark","lastName":"Lee","email":"mark.lee@company.com","department":"Sales","salary":60000}'
```

**Example — get all employees:**
```bash
curl http://localhost:8080/api/employees
```

---

## 8. Troubleshooting

**"Communications link failure" / can't connect to MySQL**
- Confirm MySQL is running: `sudo service mysql status` (Linux) or check Services (Windows) or `brew services list` (Mac).
- Confirm the port in `application.properties` matches your MySQL port (default `3306`).

**"Access denied for user 'root'@'localhost'"**
- Your username/password in `application.properties` doesn't match your MySQL credentials. Update them accordingly.

**Port 8080 already in use**
- Change the port in `application.properties`:
  ```properties
  server.port=8081
  ```
  Then open `http://localhost:8081` instead.

**"Unknown database 'employee_db'"**
- Make sure the JDBC URL contains `createDatabaseIfNotExist=true`, or run `database.sql` manually (see Section 3, Option B).

**Table not updating after changing the Employee entity**
- `spring.jpa.hibernate.ddl-auto=update` will add new columns automatically but won't remove/rename old ones. For a clean slate during development, you can drop the table and let Hibernate recreate it.

---

## 9. Tech Notes

- The frontend is pure HTML/CSS/JS with no build step — it's served directly by Spring Boot from `src/main/resources/static/`, so there's nothing extra to install for the UI.
- Validation (e.g., required fields, valid email format, positive salary) is enforced both in the frontend form and on the backend via Bean Validation (`@NotBlank`, `@Email`, `@Positive`).
- Duplicate emails are rejected with a clear error message.
- CORS is enabled on the controller (`@CrossOrigin(origins = "*")`) in case you want to serve the frontend separately during development.

Enjoy building on top of this project!
