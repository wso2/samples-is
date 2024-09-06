CREATE TABLE Pet (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    breed VARCHAR(255) NOT NULL,
    dateOfBirth VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL
);

CREATE TABLE Vaccination (
    id INT AUTO_INCREMENT PRIMARY KEY,
    petId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    lastVaccinationDate VARCHAR(255) NOT NULL,
    nextVaccinationDate VARCHAR(255),
    enableAlerts BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (petId) REFERENCES Pet(id) ON DELETE CASCADE
);

CREATE TABLE Thumbnail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fileName VARCHAR(255) NOT NULL,
    content MEDIUMBLOB NOT NULL,
    petId VARCHAR(255) NOT NULL,
    FOREIGN KEY (petId) REFERENCES Pet(id) ON DELETE CASCADE
);

CREATE TABLE Settings (
    owner VARCHAR(255) NOT NULL,
    notifications_enabled BOOLEAN NOT NULL,
    notifications_emailAddress VARCHAR(255),
    PRIMARY KEY (owner)
);
