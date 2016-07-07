START TRANSACTION;

DROP DATABASE IF EXISTS `cooking`;
CREATE DATABASE IF NOT EXISTS `cooking`;

DROP TABLE IF EXISTS `cooking`.`recipe`;
CREATE TABLE IF NOT EXISTS `cooking`.`recipe` (
  `idrecipe` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `instructions` TINYBLOB NULL,
  PRIMARY KEY (`idrecipe`));
INSERT INTO `cooking`.`recipe` (name, instructions) VALUES("Bread", "Followed by Instructions");

DROP TABLE IF EXISTS `cooking`.`ingredients`;
CREATE TABLE IF NOT EXISTS `cooking`.`ingredients` (
  `idrecipe` INT NOT NULL,
  `ingredient` VARCHAR(45) NOT NULL,
  `amount` INT NOT NULL,
  `unit` VARCHAR(10) NULL,
  PRIMARY KEY (`idrecipe`, `ingredient`),
  CONSTRAINT FOREIGN KEY(`idrecipe`) REFERENCES `cooking`.`recipe`(`idrecipe`));
INSERT INTO `cooking`.`ingredients` (idrecipe, ingredient, amount, unit) VALUES(1, "eggs", 2, null);
INSERT INTO `cooking`.`ingredients` (idrecipe, ingredient, amount, unit) VALUES(1, "flour", 3, "cups");

COMMIT;