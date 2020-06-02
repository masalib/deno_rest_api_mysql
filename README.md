# deno_rest_api_mysql
This is a simple REST API using Deno and Oak and Mysql

[My Blog](https://masalib.hatenablog.com/)

## Preparation

### mysql table create 

```
CREATE TABLE `Product` (
  `id` varchar(64) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```


### env setting 

windows
```
set MYSQL_HOST_ENV=XXX.XXX.XXX.XXX
set MYSQL_USERNAME_ENV=XXXXXXXXXX
set MYSQL_DB_ENV=XXXXXXXXXX
set MYSQL_PASSWORD_ENV=XXXXXXXXXX
set MYSQL_PORT_ENV=3306
```

Linux
```
export MYSQL_HOST_ENV=XXX.XXX.XXX.XXX
export MYSQL_USERNAME_ENV=XXXXXXXXXX
export MYSQL_DB_ENV=XXXXXXXXXX
export MYSQL_PASSWORD_ENV=XXXXXXXXXX
export MYSQL_PORT_ENV=3306
```

## Run
```
deno run --allow-net --allow-env server.ts
```

## Routes
```
GET      /api/v1/products
GET      /api/v1/products/:id
POST     /api/v1/products
PUT      /api/v1/products/:id
DELETE   /api/v1/products/:id
```


