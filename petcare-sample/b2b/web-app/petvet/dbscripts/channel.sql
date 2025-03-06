CREATE DATABASE IF NOT EXISTS CHANNEL_DB;

CREATE TABLE CHANNEL_DB.Doctor (
      id VARCHAR(255) PRIMARY KEY,
      org VARCHAR(255),
      createdAt VARCHAR(255),
      name VARCHAR(255),
      gender VARCHAR(255),
      registrationNumber VARCHAR(255),
      specialty VARCHAR(255),
      emailAddress VARCHAR(255),
      dateOfBirth VARCHAR(255),
      address VARCHAR(255)
);

CREATE TABLE CHANNEL_DB.Availability (
  doctorId VARCHAR(255),
  date VARCHAR(255),
  startTime VARCHAR(255),
  endTime VARCHAR(255),
  availableBookingCount INT,
  PRIMARY KEY (doctorId, date, startTime),
  FOREIGN KEY (doctorId) REFERENCES Doctor(id) ON DELETE CASCADE
);

CREATE TABLE CHANNEL_DB.Thumbnail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fileName VARCHAR(255) NOT NULL,
  content MEDIUMBLOB NOT NULL,
  doctorId VARCHAR(255) NOT NULL,
  FOREIGN KEY (doctorId) REFERENCES Doctor(id) ON DELETE CASCADE
);

CREATE TABLE CHANNEL_DB.Booking (
  id VARCHAR(255) PRIMARY KEY,
  org VARCHAR(255),
  referenceNumber VARCHAR(255),
  emailAddress VARCHAR(255),
  createdAt VARCHAR(255),
  petOwnerName VARCHAR(255),
  mobileNumber VARCHAR(255),
  doctorId VARCHAR(255),
  petId VARCHAR(255),
  petName VARCHAR(255),
  petType VARCHAR(255),
  petDoB VARCHAR(255),
  status VARCHAR(255),
  date VARCHAR(255),
  sessionStartTime VARCHAR(255),
  sessionEndTime VARCHAR(255),
  appointmentNumber INT,
  FOREIGN KEY (doctorId) REFERENCES Doctor(id)
);

CREATE TABLE CHANNEL_DB.OrgInfo (
  orgName VARCHAR(255),
  name VARCHAR(255),
  address VARCHAR(255),
  telephoneNumber VARCHAR(255),
  registrationNumber VARCHAR(255),
  PRIMARY KEY (orgName)
);