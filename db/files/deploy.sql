SET NAMES 'utf8';
SET CHARACTER SET utf8;

CREATE DATABASE test;
USE test;

CREATE TABLE testtab (
	id INTEGER AUTO_INCREMENT,
	name TEXT,
	PRIMARY KEY (id)
) COMMENT='this is my test table';

CREATE DATABASE prod;
USE prod;

CREATE TABLE students (
	student_id INTEGER NOT NULL AUTO_INCREMENT,
	surname VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL,
	third_name VARCHAR(50),
	birthday DATE NOT NULL,
	passport_number CHAR(10) NOT NULL,
	snils CHAR(11),
	sex CHAR(2) NOT NULL,

	group_id INTEGER NOT NULL,

	PRIMARY KEY (student_id),
	UNIQUE (passport_number),
	UNIQUE (snils)
) COMMENT='all school students';

CREATE TABLE groups (
	group_id INTEGER NOT NULL AUTO_INCREMENT,
	group_number VARCHAR(15) NOT NULL,
	begin_date DATE NOT NULL,
	end_date DATE NOT NULL,

	PRIMARY KEY (group_id),
	UNIQUE (group_number)
) COMMENT='studying groups';

CREATE TABLE cars (
	car_id INTEGER NOT NULL AUTO_INCREMENT,
	car_number CHAR(6) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
	region VARCHAR(3) NOT NULL,
	produced_at DATE NOT NULL,
	model VARCHAR(30) NOT NULL,
	akkp TINYINT NOT NULL,
	gur TINYINT NOT NULL,

	PRIMARY KEY (car_id),
	UNIQUE (car_number, region)
) COMMENT='all cars owned by school';

CREATE TABLE teachers (
	teacher_id INTEGER NOT NULL AUTO_INCREMENT,
	surname VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL,
	third_name VARCHAR(50),
	birthday DATE NOT NULL,
	teacher_role VARCHAR(50) NOT NULL,
	experience FLOAT NOT NULL,
	
	car_id INTEGER,

	PRIMARY KEY (teacher_id)
) COMMENT='all school teachers';
