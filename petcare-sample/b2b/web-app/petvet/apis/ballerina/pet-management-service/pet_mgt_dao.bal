import ballerinax/java.jdbc;
import ballerina/sql;
import ballerina/log;

function dbGetPetsByOwner(string org, string owner) returns Pet[]|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT p.id, p.name, p.breed, p.dateOfBirth, p.owner, p.org, v.name as vaccinationName,
        v.lastVaccinationDate, v.nextVaccinationDate, v.enableAlerts FROM Pet p LEFT JOIN Vaccination v
        ON p.id = v.petId WHERE p.owner = ${owner} and p.org = ${org}`;
        stream<PetVaccinationRecord, sql:Error?> petsStream = dbClient->query(query);

        map<Pet> pets = check getPetsForPetsStream(petsStream);
        check petsStream.close();
        return pets.toArray();
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetPetByOwnerAndPetId(string owner, string petId) returns Pet|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT p.id, p.name, p.breed, p.dateOfBirth, p.owner, p.org, v.name as vaccinationName,
        v.lastVaccinationDate, v.nextVaccinationDate, v.enableAlerts FROM Pet p LEFT JOIN Vaccination v 
        ON p.id = v.petId WHERE p.owner = ${owner} and p.id = ${petId}`;
        stream<PetVaccinationRecord, sql:Error?> petsStream = dbClient->query(query);

        map<Pet> pets = check getPetsForPetsStream(petsStream);
        check petsStream.close();

        if pets.length() == 0 {
            return ();
        }
        return pets.get(petId);
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetPetByPetId(string petId) returns Pet|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT p.id, p.name, p.breed, p.dateOfBirth, p.owner, p.org, v.name as vaccinationName,
        v.lastVaccinationDate, v.nextVaccinationDate, v.enableAlerts FROM Pet p LEFT JOIN Vaccination v 
        ON p.id = v.petId WHERE p.id = ${petId}`;
        stream<PetVaccinationRecord, sql:Error?> petsStream = dbClient->query(query);

        map<Pet> pets = check getPetsForPetsStream(petsStream);
        check petsStream.close();

        if pets.length() == 0 {
            return ();
        }
        return pets.get(petId);
    }
    on fail error e {
        return handleError(e);
    }
}

function dbDeletePetById(string owner, string petId) returns string|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `DELETE from Pet WHERE id = ${petId} and owner = ${owner}`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);

    if result is sql:Error {
        return handleError(result);
    } else if result.affectedRowCount == 0 {
        return ();
    }

    return "Pet deleted successfully";
}

function dbAddPet(Pet pet) returns Pet|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    transaction {
        sql:ParameterizedQuery query = `INSERT INTO Pet (id, name, breed, dateOfBirth, owner, org)
            VALUES (${pet.id}, ${pet.name}, ${pet.breed}, ${pet.dateOfBirth}, ${pet.owner}, ${pet.org});`;
        _ = check dbClient->execute(query);

        Vaccination[]? vacs = pet.vaccinations;
        sql:ExecutionResult[]|sql:Error batchResult = [];

        if vacs != null {

            foreach Vaccination vac in vacs {
                if vac.enableAlerts == null {
                    vac.enableAlerts = false;
                } else if (vac.nextVaccinationDate == null) {
                    vac.nextVaccinationDate = null;
                }
            }

            sql:ParameterizedQuery[] insertQueries = from Vaccination vac in vacs
                select `INSERT INTO Vaccination (petId, name, lastVaccinationDate, nextVaccinationDate,enableAlerts)
                    VALUES (${pet.id}, ${vac.name}, ${vac.lastVaccinationDate}, ${vac.nextVaccinationDate}, ${vac.enableAlerts})`;
            batchResult = dbClient->batchExecute(insertQueries);
        }

        if batchResult is sql:Error {
            rollback;
            return handleError(batchResult);
        } else {
            check commit;
            return pet;
        }

    } on fail error e {
        return handleError(e);
    }
}

function dbUpdatePet(Pet pet) returns Pet|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    transaction {
        sql:ParameterizedQuery query = `UPDATE Pet SET name = ${pet.name}, breed = ${pet.breed}, 
        dateOfBirth = ${pet.dateOfBirth} WHERE id = ${pet.id};`;
        _ = check dbClient->execute(query);

        sql:ParameterizedQuery deleteQuery = `DELETE FROM Vaccination WHERE petId = ${pet.id};`;
        _ = check dbClient->execute(deleteQuery);

        Vaccination[]? vacs = pet.vaccinations;
        sql:ExecutionResult[]|sql:Error batchResult = [];

        if vacs != null {

            foreach Vaccination vac in vacs {
                if vac.enableAlerts == null {
                    vac.enableAlerts = false;
                } else if (vac.nextVaccinationDate == null) {
                    vac.nextVaccinationDate = null;
                }
            }

            sql:ParameterizedQuery[] insertQueries = from Vaccination vac in vacs
                select `INSERT INTO Vaccination (petId, name, lastVaccinationDate, nextVaccinationDate,enableAlerts)
                    VALUES (${pet.id}, ${vac.name}, ${vac.lastVaccinationDate}, ${vac.nextVaccinationDate}, ${vac.enableAlerts})`;
            batchResult = dbClient->batchExecute(insertQueries);
        }

        if batchResult is sql:Error {
            rollback;
            return handleError(batchResult);
        } else {
            check commit;
            return pet;
        }

    } on fail error e {
        return handleError(e);
    }
}

function dbAddThumbnailById(string petId, Thumbnail thumbnail) returns string|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `INSERT INTO Thumbnail (petId, fileName, content)
            VALUES (${petId}, ${thumbnail.fileName}, ${thumbnail.content.toBytes()});`;
        _ = check dbClient->execute(query);

        return "Thumbnail added successfully";
    }
    on fail error e {
        return handleError(e);
    }
}

function dbDeleteThumbnailById(string petId) returns string|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `DELETE FROM Thumbnail WHERE petId = ${petId};`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);

    if result is sql:Error {
        return handleError(result);
    } else if result.affectedRowCount == 0 {
        return ();
    }

    return "Thumbnail deleted successfully";
}

function dbGetThumbnailById(string petId) returns Thumbnail|string|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `SELECT fileName, content FROM Thumbnail WHERE petId = ${petId}`;
    Thumbnail|sql:Error result = dbClient->queryRow(query);

    if result is sql:NoRowsError {
        return "No thumbnail found for petId: " + petId;
    } else if result is sql:Error {
        return handleError(result);
    } else {
        return result;
    }
}

function dbAddOrUpdateMedicalRecord(string petId, MedicalReport medicalReport, boolean updateEntry) returns MedicalReport|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    transaction {
        sql:ParameterizedQuery query = `INSERT INTO MedicalReport (reportId, diagnosis, treatment, createdAt, updatedAt, petId)
            VALUES (${medicalReport.reportId}, ${medicalReport.diagnosis}, ${medicalReport.treatment}, ${medicalReport.createdAt},
             ${medicalReport.updatedAt}, ${petId}) ON DUPLICATE KEY UPDATE diagnosis = ${medicalReport.diagnosis},
             treatment = ${medicalReport.treatment}, updatedAt = ${medicalReport.updatedAt};`;
        _ = check dbClient->execute(query);

        if updateEntry {
            sql:ParameterizedQuery deleteQuery = `DELETE FROM Medication WHERE reportId = ${medicalReport.reportId};`;
            _ = check dbClient->execute(deleteQuery);
        }

        Medication[]? medications = medicalReport.medications;
        sql:ExecutionResult[]|sql:Error batchResult = [];

        if medications != null {
            sql:ParameterizedQuery[] insertQueries = from Medication med in medications
                select `INSERT INTO Medication (reportId, drugName, dosage, duration)
                    VALUES (${medicalReport.reportId}, ${med.drugName}, ${med.dosage}, ${med.duration})`;
            batchResult = dbClient->batchExecute(insertQueries);
        }

        if batchResult is sql:Error {
            rollback;
            return handleError(batchResult);
        } else {
            check commit;
            return medicalReport;
        }

    } on fail error e {
        return handleError(e);
    }
}

function dbGetMedicalReportsByPetId(string petId) returns MedicalReport[]|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT p.reportId, p.diagnosis, p.treatment, p.createdAt, p.updatedAt,
        m.drugName, m.dosage, m.duration FROM MedicalReport p LEFT JOIN Medication m
        ON p.reportId = m.reportId WHERE p.petId = ${petId}`;
        stream<MedicalReportRecord, sql:Error?> medStream = dbClient->query(query);

        map<MedicalReport> medicalReports = check getMedicalReportFromMedStream(medStream);
        check medStream.close();
        return medicalReports.toArray();
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetMedicalReportsByPetIdAndReportId(string petId, string reportId) returns MedicalReport|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT p.reportId, p.diagnosis, p.treatment, p.createdAt, p.updatedAt,
        m.drugName, m.dosage, m.duration FROM MedicalReport p LEFT JOIN Medication m
        ON p.reportId = m.reportId WHERE p.petId = ${petId} and p.reportId = ${reportId}`;
        stream<MedicalReportRecord, sql:Error?> medStream = dbClient->query(query);

        map<MedicalReport> medicalReports = check getMedicalReportFromMedStream(medStream);
        check medStream.close();

        if medicalReports.length() == 0 {
            return ();
        }
        return medicalReports.get(reportId);
    }
    on fail error e {
        return handleError(e);
    }
}

function dbDeleteMedicalReportByReportId(string petId, string reportId) returns string|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `DELETE FROM MedicalReport WHERE reportId = ${reportId} and petId = ${petId};`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);

    if result is sql:Error {
        return handleError(result);
    } else if result.affectedRowCount == 0 {
        return ();
    }

    return "Medical Report deleted successfully";
}

function dbGetOwnerSettings(string org, string owner) returns Settings|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `SELECT notifications_enabled as enabled, notifications_emailAddress 
        as emailAddress FROM Settings WHERE owner = ${owner} and org = ${org}`;
    Notifications|sql:Error result = dbClient->queryRow(query);

    if result is sql:NoRowsError {
        return ();
    } else if result is sql:Error {
        return handleError(result);
    } else {
        Settings settings = {notifications: result};
        return settings;
    }

}

function dbUpdateSettingsByOwner(SettingsRecord settingsRecord) returns string|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `INSERT INTO Settings (owner, org, notifications_enabled, notifications_emailAddress)
            VALUES (${settingsRecord.owner}, ${settingsRecord.org}, ${settingsRecord.notifications.enabled},
            ${settingsRecord.notifications.emailAddress})
            ON DUPLICATE KEY UPDATE notifications_enabled = ${settingsRecord.notifications.enabled}
            ,notifications_emailAddress = ${settingsRecord.notifications.emailAddress};`;

        _ = check dbClient->execute(query);

        return "Settings updated successfully";
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetPetIdsForEnabledAlerts(string date) returns string[]|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    string[] petIds = [];
    sql:ParameterizedQuery query = `SELECT Pet.id FROM Pet LEFT JOIN Vaccination v ON Pet.id = v.petId 
     WHERE v.enableAlerts = true AND v.nextVaccinationDate = ${date}`;
    stream<record {}, sql:Error?> resultStream = dbClient->query(query);

    check from record {} entry in resultStream
        do {
            petIds.push(entry["id"].toString());
        };
    check resultStream.close();

    return petIds;
}

function handleError(error err) returns error {
    log:printError("Error while processing the request", err);
    return error("Error while processing the request");
}

function getPetsForPetsStream(stream<PetVaccinationRecord, sql:Error?> petsStream) returns map<Pet>|error {

    map<Pet> pets = {};

    check from PetVaccinationRecord pet in petsStream
        do {
            boolean isPetAvailable = pets.hasKey(pet.id);
            if !isPetAvailable {

                Pet p = {
                    id: pet.id,
                    org: pet.org,
                    owner: pet.owner,
                    name: pet.name,
                    breed: pet.breed,
                    dateOfBirth: pet.dateOfBirth
                };

                if (pet.vaccinationName != null) {
                    Vaccination[] vacs = [
                        {
                            name: <string>pet.vaccinationName,
                            lastVaccinationDate: <string>pet.lastVaccinationDate,
                            nextVaccinationDate: pet.nextVaccinationDate,
                            enableAlerts: pet.enableAlerts
                        }
                    ];
                    p.vaccinations = vacs;
                }

                pets[pet.id] = p;
            } else {

                if (pet.vaccinationName != null) {
                    Vaccination vac = {
                        name: pet.vaccinationName ?: "",
                        lastVaccinationDate: pet.lastVaccinationDate ?: "",
                        nextVaccinationDate: pet.nextVaccinationDate,
                        enableAlerts: pet.enableAlerts
                    };

                    Pet p = pets.get(pet.id);
                    Vaccination[] vacarray = <Vaccination[]>p.vaccinations;
                    vacarray.push(vac);
                }
            }
        };

    return pets;
}

function getMedicalReportFromMedStream(stream<MedicalReportRecord, sql:Error?> medStream) returns map<MedicalReport>|error {

    map<MedicalReport> medReports = {};

    check from MedicalReportRecord med in medStream
        do {
            boolean isReportAvailable = medReports.hasKey(med.reportId);
            if !isReportAvailable {

                MedicalReport medReport = {
                    reportId: med.reportId,
                    diagnosis: med.diagnosis,
                    treatment: med.treatment,
                    createdAt: med.createdAt,
                    updatedAt: med.updatedAt
                };

                if (med.drugName != "") {
                    Medication[] meds = [
                        {
                            drugName: <string>med.drugName,
                            dosage: <string>med.dosage,
                            duration: <string>med.duration
                        }
                    ];
                    medReport.medications = meds;
                }

                medReports[medReport.reportId] = medReport;
            } else {

                if (med.drugName != "") {
                    Medication medication = {
                        drugName: <string>med.drugName,
                        dosage: <string>med.dosage,
                        duration: <string>med.duration
                    };

                    MedicalReport report = medReports.get(med.reportId);
                    Medication[] medArray = <Medication[]>report.medications;
                    medArray.push(medication);
                }
            }
        };

    return medReports;
}
