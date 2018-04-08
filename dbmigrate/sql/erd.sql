
CREATE TABLE User(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
email VARCHAR(256),
password VARCHAR(256),
fullname VARCHAR(256),
loginwith varchar(50), 
nickname varchar(50),
facebook_id VARCHAR(256));

CREATE TABLE User_addr(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(30),
    lname VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(40),
    state VARCHAR(40),
    zip VARCHAR(40),
    country VARCHAR(40),
    phone VARCHAR(20),
    user_id INT NOT NULL
)ENGINE = InnoDB;

CREATE TABLE Products(id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
image VARCHAR(150),
price double(10,2),
description VARCHAR(200),
longDesc VARCHAR(600),
category_id int,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
isDeleted boolean DEFAULT FALSE
 )ENGINE=InnoDB;

CREATE TABLE Orders(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
addr_id INT NOT NULL,
user_id INT NOT NULL,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
status ENUM('ordered','shipped','delivered','cancelled'),
amount double
)ENGINE=InnoDB;

CREATE TABLE Order_items(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
order_id INT NOT NULL,
item_id INT NOT NULL,
quantity INT,
itemPrice double(10,2)
)ENGINE=InnoDB;


CREATE TABLE FactTable(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    time TIMESTAMP,
    addressId INT,
    city VARCHAR(40),
    state VARCHAR(40),
    amount INT,
    orderId INT UNIQUE,
    productId INT,
    FOREIGN KEY (addressId) REFERENCES User_addr(id),
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
)ENGINE=InnoDB;
