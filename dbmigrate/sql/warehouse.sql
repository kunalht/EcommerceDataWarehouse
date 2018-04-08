
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
    user_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES user(id)
ON DELETE CASCADE
)ENGINE = InnoDB;

CREATE TABLE Products(id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
image VARCHAR(150),
price double(10,2),
description VARCHAR(200),
longDesc VARCHAR(600),
category_id int,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
isDeleted boolean DEFAULT FALSE,
foreign key (category_id) references categories(id)
 )ENGINE=InnoDB;


CREATE TABLE Cart(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
item_id INT NOT NULL,
quantity INT DEFAULT 1,
FOREIGN KEY (user_id) REFERENCES user(id),
FOREIGN KEY (item_id) REFERENCES products(id)
)ENGINE = InnoDB;

CREATE TABLE Orders(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
addr_id INT NOT NULL,
user_id INT NOT NULL,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
status ENUM('ordered','shipped','delivered','cancelled'),
amount double,
FOREIGN KEY (addr_id) REFERENCES user_addr(id),
FOREIGN KEY (user_id) REFERENCES user(id)
)ENGINE=InnoDB;

CREATE TABLE Order_items(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
order_id INT NOT NULL,
item_id INT NOT NULL,
quantity INT,
itemPrice double(10,2),
FOREIGN KEY (order_id) REFERENCES orders(id),
FOREIGN KEY (item_id) REFERENCES products(id)
)ENGINE=InnoDB;

CREATE TABLE user_fb(
    id varchar(256),
    email varchar(100),
    name varchar(256),
    token varchar(256)
)

CREATE TABLE FactTable(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    time TIMESTAMP UNIQUE,
    addressId INT,
    city VARCHAR(40),
    state VARCHAR(40),
    amount INT,
    orderId INT,
    FOREIGN KEY (addressId) REFERENCES datawarehouse.User_addr(id),
    FOREIGN KEY (orderId) REFERENCES datawarehouse.Orders(id)
)ENGINE=InnoDB;

CREATE TABLE EditHistory(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    newText VARCHAR(50),
    previousText VARCHAR(50),
    editColumn VARCHAR(40),
    editedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;

SELECT * FROM FactTable AS FT JOIN datawarehouse.orders AS O ON FT.orderId = O.id;

INSERT INTO EditHistory(newText, previousText, editColumn) VALUES ("58 61st St", "722 Bridge Ave", "address");
INSERT INTO EditHistory(newText, previousText, editColumn) VALUES ("Windsor", "Toronto", "City");
INSERT INTO EditHistory(newText, previousText, editColumn) VALUES ("Reese", "J. RW", "name");

SELECT * FROM Orders AS O JOIN  User_addr  AS UA ON O.addr_id = UA.id;