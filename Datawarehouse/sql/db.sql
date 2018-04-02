CREATE TABLE Products(id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
image VARCHAR(150),
price double(10,2),
description VARCHAR(200),
createdAt TIMESTAMP,
isDeleted boolean DEFAULT FALSE,
mongoId VARCHAR(256) UNIQUE,
mysqlId INT UNIQUE
 )ENGINE=InnoDB;


CREATE TABLE Orders(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
address VARCHAR(256),
city VARCHAR(256),
state VARCHAR(256),
createdAt TIMESTAMP,
status ENUM('ordered','shipped','delivered','cancelled'),
amount double,
mongoId VARCHAR(256) UNIQUE,
mysqlId INT UNIQUE
)ENGINE=InnoDB;

CREATE TABLE Order_items(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
order_id INT NOT NULL,
item_id INT NOT NULL,
quantity INT
)ENGINE=InnoDB;
-- CREATE TABLE User(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
-- email VARCHAR(256),
-- password VARCHAR(256),
-- fullname VARCHAR(256),
-- loginwith varchar(50), 
-- nickname varchar(50),
-- facebook_id VARCHAR(256));

-- CREATE TABLE categories(
--     id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     name VARCHAR(256),
--     slug VARCHAR(256),
--     parent_id INT,
--     FOREIGN KEY (parent_id) REFERENCES categories(id)
-- )ENGINE=InnoDB;



-- CREATE TABLE User_addr(
--     id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     fname VARCHAR(30),
--     lname VARCHAR(30),
--     address VARCHAR(255),
--     city VARCHAR(40),
--     state VARCHAR(40),
--     zip VARCHAR(40),
--     country VARCHAR(40),
--     phone VARCHAR(20),
--     user_id INT NOT NULL,
-- FOREIGN KEY (user_id) REFERENCES user(id)
-- ON DELETE CASCADE
-- )ENGINE = InnoDB;

-- CREATE TABLE Cart(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
-- user_id INT NOT NULL,
-- item_id INT NOT NULL,
-- quantity INT DEFAULT 1,
-- FOREIGN KEY (user_id) REFERENCES user(id),
-- FOREIGN KEY (item_id) REFERENCES products(id)
-- )ENGINE = InnoDB;

-- CREATE TABLE Orders(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
-- addr_id INT NOT NULL,
-- user_id INT NOT NULL,
-- createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- status ENUM('ordered','shipped','delivered','cancelled'),
-- amount double,
-- FOREIGN KEY (addr_id) REFERENCES user_addr(id),
-- FOREIGN KEY (user_id) REFERENCES user(id)
-- )ENGINE=InnoDB;

-- CREATE TABLE Order_items(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
-- order_id INT NOT NULL,
-- item_id INT NOT NULL,
-- quantity INT,
-- itemPrice double(10,2),
-- FOREIGN KEY (order_id) REFERENCES orders(id),
-- FOREIGN KEY (item_id) REFERENCES products(id)
-- )ENGINE=InnoDB;

-- CREATE TABLE user_fb(
--     id varchar(256),
--     email varchar(100),
--     name varchar(256),
--     token varchar(256)
-- )

