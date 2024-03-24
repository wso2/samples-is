import ballerinax/java.jdbc;
import ballerinax/mysql.driver as _;
import ballerina/uuid;
import ballerina/sql;
import ballerina/log;
import ballerinax/mysql;
import ballerina/time;

configurable string dbHost = "localhost";
configurable string dbUsername = "admin";
configurable string dbPassword = "admin";
configurable string dbDatabase = "PET_DB";
configurable int dbPort = 3306;

table<PetRecord> key(org, owner, id) petRecords = table [];
table<SettingsRecord> key(org, owner) settingsRecords = table [];
final mysql:Client|error dbClient;
boolean useDB = false;
map<Thumbnail> thumbnailMap = {};

function init() returns error? {

    if dbHost != "localhost" && dbHost != "" {
        useDB = true;
    }

    sql:ConnectionPool connPool = {
        maxOpenConnections: 20,
        minIdleConnections: 20,
        maxConnectionLifeTime: 300
    };

    mysql:Options mysqlOptions = {
        connectTimeout: 10
    };

    dbClient = new (dbHost, dbUsername, dbPassword, dbDatabase, dbPort, options = mysqlOptions, connectionPool = connPool);

    if dbClient is sql:Error {
        if (!useDB) {
            log:printInfo("DB configurations are not given. Hence storing the data locally");
        } else {
            log:printError("DB configuraitons are not correct. Please check the configuration", 'error = <sql:Error>dbClient);
            return error("DB configuraitons are not correct. Please check the configuration");
        }
    }

    if useDB {
        log:printInfo("DB configurations are given. Hence storing the data in DB");
    }

}

function getConnection() returns jdbc:Client|error {
    return dbClient;
}

function getPets(string org, string owner) returns Pet[]|error {

    Pet[] pets = [];
    if (useDB) {
        pets = check dbGetPetsByOwner(org, owner);
    } else {
        petRecords.forEach(function(PetRecord petRecord) {
            if petRecord.org == org && petRecord.owner == owner {
                Pet pet = getPetDetails(petRecord);
                pets.push(pet);
            }
        });
    }
    return pets;
}

function getPetByIdAndOwner(string org, string owner, string petId) returns Pet|()|error {

    if (useDB) {
        return dbGetPetByOwnerAndPetId(owner, petId);
    } else {
        PetRecord? petRecord = petRecords[org, owner, petId];
        if petRecord is () {
            return ();
        }
        return getPetDetails(petRecord);
    }
}

function getPetById(string petId) returns Pet|() {

    if (useDB) {
        Pet|()|error petResult = dbGetPetByPetId(petId);

        if petResult is Pet {
            return petResult;
        } else {
            return ();
        }
    } else {
        OwnerInfo[] ownerInfo = from var petRecord in petRecords
            where petRecord.id == petId
            select {org: petRecord.org, owner: petRecord.owner};

        if ownerInfo.length() == 0 {
            return ();
        }

        string org = ownerInfo[0]["org"];
        string owner = ownerInfo[0]["owner"];

        PetRecord? petRecord = petRecords[org, owner, petId];
        if petRecord is () {
            return ();
        }

        return getPetDetails(petRecord);
    }
}

function updatePetById(string org, string owner, string email, string petId, PetItem updatedPetItem) returns Pet|()|error {

    if (useDB) {
        Pet|() oldPet = check dbGetPetByOwnerAndPetId(owner, petId);
        if oldPet is () {
            return ();
        }

        Pet pet = {id: petId, org: org, owner: owner, ...updatedPetItem};
        Pet|error updatedPet = dbUpdatePet(pet);

        if updatedPet is error {
            return updatedPet;
        }
        enableAlerts(org, owner, email, updatedPet);
        return updatedPet;

    } else {
        PetRecord? oldePetRecord = petRecords[org, owner, petId];
        if oldePetRecord is () {
            return ();
        }
        petRecords.put({id: petId, org: org, owner: owner, ...updatedPetItem});
        PetRecord petRecord = <PetRecord>petRecords[org, owner, petId];
        Pet pet = getPetDetails(petRecord);
        enableAlerts(org, owner, email, pet);
        return pet;
    }
}

function deletePetById(string org, string owner, string petId) returns string|()|error {

    if (useDB) {
        return dbDeletePetById(owner, petId);
    } else {
        PetRecord? oldePetRecord = petRecords[org, owner, petId];
        if oldePetRecord is () {
            return ();
        }
        _ = petRecords.remove([org, owner, petId]);
        return "Pet deleted successfully";
    }
}

function addPet(PetItem petItem, string org, string owner, string email) returns Pet|error {

    string petId = uuid:createType1AsString();

    if (useDB) {
        Pet pet = {id: petId, org: org, owner: owner, ...petItem};
        Pet addedPet = check dbAddPet(pet);
        enableAlerts(org, owner, email, addedPet);
        return addedPet;
    } else {
        petRecords.put({id: petId, org: org, owner: owner, ...petItem});
        PetRecord petRecord = <PetRecord>petRecords[org, owner, petId];
        Pet pet = getPetDetails(petRecord);
        enableAlerts(org, owner, email, pet);
        return pet;
    }
}

function updateThumbnailByPetId(string org, string owner, string petId, Thumbnail thumbnail) returns string|()|error {

    if (useDB) {

        string|()|error deleteResult = dbDeleteThumbnailById(petId);

        if deleteResult is error {
            return deleteResult;
        }

        if thumbnail.fileName != "" {
            string|error result = dbAddThumbnailById(petId, thumbnail);

            if result is error {
                return result;
            }
        }

        return "Thumbnail updated successfully";
    } else {

        string thumbnailKey = getThumbnailKey(org, owner, petId);

        if thumbnail.fileName == "" {
            if thumbnailMap.hasKey(thumbnailKey) {
                _ = thumbnailMap.remove(thumbnailKey);
            }

        } else {
            thumbnailMap[thumbnailKey] = thumbnail;
        }

        return "Thumbnail updated successfully";
    }
}

function getThumbnailByPetId(string org, string owner, string petId) returns Thumbnail|()|string|error {

    if (useDB) {

        Thumbnail|string|error getResult = dbGetThumbnailById(petId);

        if getResult is error {
            return getResult;
        } else if getResult is string {
            return getResult;
        } else {
            return <Thumbnail>getResult;
        }

    } else {

        string thumbnailKey = getThumbnailKey(org, owner, petId);
        if thumbnailMap.hasKey(thumbnailKey) {
            Thumbnail thumbnail = <Thumbnail>thumbnailMap[thumbnailKey];
            return thumbnail;
        } else {
            return ();
        }

    }
}

function getMedicalReportsByPetId(string petId) returns MedicalReport[]|error {

    MedicalReport[] medicalReports = [];
    if (useDB) {
        return dbGetMedicalReportsByPetId(petId);
    } else {
        PetRecord petRecord = {id: "", org: "", owner: "", name: "", dateOfBirth: "", breed: ""};
        petRecords.forEach(function(PetRecord petRecordValue) {
            if petRecordValue.id == petId {
                petRecord = petRecordValue;
            }
        });

        if petRecord.id is "" {
            log:printInfo("Pet record not found: " + petId);
            return medicalReports;
        }

        MedicalReport[]? availableMedicalReports = petRecord.medicalReports;

        if availableMedicalReports is () {
            return medicalReports;
        }

        medicalReports = <MedicalReport[]>availableMedicalReports;
        return medicalReports;
    }
}

function getMedicalReportsByPetIdAndReportId(string petId, string reportId) returns MedicalReport|()|error {

    MedicalReport[] medicalReports = [];
    if (useDB) {
        return dbGetMedicalReportsByPetIdAndReportId(petId, reportId);
    } else {

        PetRecord petRecord = {id: "", org: "", owner: "", name: "", dateOfBirth: "", breed: ""};
        petRecords.forEach(function(PetRecord petRecordValue) {
            if petRecordValue.id == petId {
                petRecord = petRecordValue;
            }
        });

        if petRecord.id is "" {
            return ();
        }

        MedicalReport[]? availableMedicalReports = petRecord.medicalReports;
        if availableMedicalReports is () {
            return ();
        }

        medicalReports = <MedicalReport[]>availableMedicalReports;
        foreach MedicalReport item in medicalReports {

            if (item.reportId == reportId) {
                return item;
            }
        }
        return ();
    }
}

function addMedicalReport(string petId, MedicalReportItem medicalReportItem) returns MedicalReport|()|error {

    string reportId = uuid:createType1AsString();
    string createdAt = getCurrentDateTime();
    MedicalReport medicalReport = {reportId: reportId, createdAt: createdAt, updatedAt: createdAt, ...medicalReportItem};

    if (useDB) {
        return dbAddOrUpdateMedicalRecord(petId, medicalReport, false);
    } else {
        PetRecord petRecord = {id: "", org: "", owner: "", name: "", dateOfBirth: "", breed: ""};
        petRecords.forEach(function(PetRecord petRecordValue) {
            if petRecordValue.id == petId {
                petRecord = petRecordValue;
            }
        });

        if petRecord.id == "" {
            return ();
        }

        MedicalReport[]? medicalReports = petRecord.medicalReports;
        if medicalReports is () {
            medicalReports = [medicalReport];
        } else {
            medicalReports.push(medicalReport);
        }

        petRecord.medicalReports = medicalReports;
        petRecords.put({...petRecord});
        return medicalReport;
    }
}

function updateMedicalReport(string petId, string reportId, MedicalReportItem updatedMedicalReportItem)
returns MedicalReport|()|error {

    MedicalReport|()|error oldMedicalReport = getMedicalReportsByPetIdAndReportId(petId, reportId);

    if oldMedicalReport is error {
        return oldMedicalReport;
    } else if oldMedicalReport is () {
        return ();
    } else {

        string updatedAt = getCurrentDateTime();
        string createdAt = oldMedicalReport.createdAt;
        MedicalReport medicalReport = {reportId: reportId, createdAt: createdAt, updatedAt: updatedAt, ...updatedMedicalReportItem};

        if (useDB) {
            return dbAddOrUpdateMedicalRecord(petId, medicalReport, true);
        } else {
            PetRecord petRecord = {id: "", org: "", owner: "", name: "", dateOfBirth: "", breed: ""};
            petRecords.forEach(function(PetRecord petRecordValue) {
                if petRecord.id == petId {
                    petRecord = petRecordValue;
                }
            });

            if petRecord.id == "" {
                return ();
            }

            MedicalReport[]? medicalReports = petRecord.medicalReports;
            if medicalReports != () {
                MedicalReport[] filtered = medicalReports.filter(i => i != oldMedicalReport);
                filtered.push(medicalReport);
                petRecord.medicalReports = filtered;
                petRecords.put({...petRecord});
            }
            return medicalReport;
        }
    }
}

function deleteMedicalReportById(string petId, string reportId) returns string|()|error {

    MedicalReport|()|error oldMedicalReport = getMedicalReportsByPetIdAndReportId(petId, reportId);

    if oldMedicalReport is error {
        return oldMedicalReport;
    } else if oldMedicalReport is () {
        return ();
    } else {

        if (useDB) {
            return dbDeleteMedicalReportByReportId(petId, reportId);
        } else {
            PetRecord petRecord = {id: "", org: "", owner: "", name: "", dateOfBirth: "", breed: ""};
            petRecords.forEach(function(PetRecord petRecordValue) {
                if petRecord.id == petId {
                    petRecord = petRecordValue;
                }
            });

            if petRecord.id == "" {
                return ();
            }

            MedicalReport[]? medicalReports = petRecord.medicalReports;
            if medicalReports != () {
                MedicalReport[] filtered = medicalReports.filter(i => i != oldMedicalReport);
                petRecord.medicalReports = filtered;
                petRecords.put({...petRecord});
                return "Medical report deleted successfully";
            }
            return ();
        }
    }
}

function updateSettings(SettingsRecord settingsRecord) returns string|error {

    if (useDB) {
        string|error updatedResult = dbUpdateSettingsByOwner(settingsRecord);
        if updatedResult is error {
            return updatedResult;
        }

    } else {
        settingsRecords.put(settingsRecord);
    }

    return "Settings updated successfully";
}

function getSettings(string org, string owner, string email) returns Settings|error {

    if (useDB) {

        Settings|()|error settings = dbGetOwnerSettings(org, owner);

        if settings is error {
            return settings;
        } else if settings is () {
            Settings newSettings = getDefaultSettings(email);
            SettingsRecord settingsRecord = {org: org, owner: owner, ...newSettings};
            string|error updatedResult = dbUpdateSettingsByOwner(settingsRecord);
            if updatedResult is error {
                return updatedResult;
            }
            return newSettings;
        } else {
            return settings;
        }

    } else {
        SettingsRecord? settingsRecord = settingsRecords[org, owner];

        if settingsRecord is () {
            Settings settings = getDefaultSettings(email);
            settingsRecords.put({org: org, owner: owner, ...settings});
            return settings;
        }
        return {notifications: settingsRecord.notifications};
    }

}

function getSettingsByOwner(string org, string owner) returns Settings|() {

    if (useDB) {

        Settings|()|error settings = dbGetOwnerSettings(org, owner);

        if settings is Settings {
            return settings;
        } else {
            return ();
        }

    } else {
        SettingsRecord? settingsRecord = settingsRecords[org, owner];

        if settingsRecord is () {
            return ();
        }

        return {notifications: settingsRecord.notifications};
    }

}

function getAvailableAlerts(string nextDay) returns PetAlert[] {

    PetAlert[] petAlerts = [];
    string[] petIds = getPetIdsForEnabledAlerts(nextDay);

    foreach var petId in petIds {
        Pet|() pet = getPetById(petId);

        if pet != () {
            Settings|() settings = getSettingsByOwner(pet.org, pet.owner);

            if settings != () && settings.notifications.enabled && settings.notifications.emailAddress != "" {

                string email = <string>settings.notifications.emailAddress;
                Vaccination[] selectedVaccinations = [];
                Vaccination[] vaccinations = <Vaccination[]>pet.vaccinations;

                foreach var vac in vaccinations {
                    if vac.nextVaccinationDate == nextDay && vac.enableAlerts == true {
                        selectedVaccinations.push(vac);
                    }
                }

                pet.vaccinations = selectedVaccinations;
                PetAlert petAlert = {...pet, emailAddress: email};
                petAlerts.push(petAlert);
            }
        }
    }

    return petAlerts;
}

function getPetIdsForEnabledAlerts(string nextDay) returns string[] {

    string[] petIds = [];
    if (useDB) {
        string[]|error dbGetPetIdsForEnabledAlertsResult = dbGetPetIdsForEnabledAlerts(nextDay);

        if dbGetPetIdsForEnabledAlertsResult is error {
            return petIds;
        } else {
            return <string[]>dbGetPetIdsForEnabledAlertsResult;
        }

    } else {
        petRecords.forEach(function(PetRecord petRecord) {

            if petRecord.vaccinations is () {
                return;
            }

            Vaccination[] vaccinations = <Vaccination[]>petRecord.vaccinations;
            vaccinations.forEach(function(Vaccination vaccination) {

                if vaccination.nextVaccinationDate == nextDay && <boolean>vaccination.enableAlerts {
                    petIds.push(petRecord.id);
                }
            });
        });
    }

    return petIds;
}

function getPetDetails(PetRecord petRecord) returns Pet {

    Pet pet = {
        id: petRecord.id,
        org: petRecord.org,
        owner: petRecord.owner,
        name: petRecord.name,
        breed: petRecord.breed,
        dateOfBirth: petRecord.dateOfBirth,
        vaccinations: petRecord.vaccinations
    };

    return pet;
}

function getDefaultSettings(string email) returns Settings {

    boolean enabled = false;
    if email != "" {
        enabled = true;
    }

    Settings settings = {notifications: {enabled: enabled, emailAddress: email}};
    return settings;
}

function enableAlerts(string org, string owner, string email, Pet pet) {

    Vaccination[]? vaccinations = pet.vaccinations;

    if vaccinations is () {
        return;
    }

    foreach var vac in vaccinations {

        if vac.enableAlerts == true {
            Settings|error settings = getSettings(org, owner, email);
            if settings is error {
                log:printError("Error getting settings", 'error = settings);
            }
            break;
        }
    }

}

function getThumbnailKey(string org, string owner, string petId) returns string {
    return org + "-" + owner + "-" + petId;
}

function getCurrentDateTime() returns string {
    time:Utc currentUtc = time:utcNow();
    time:Civil currentTime = time:utcToCivil(currentUtc);
    return civilToIso8601(currentTime);
}

# Converts time:Civil time to string 2022-07-12T05:42:35Z
#
# + time - time:Civil time record.
# + return - Converted ISO 8601 string.
function civilToIso8601(time:Civil time) returns string {
    string year = time.year.toString();
    string month = time.month < 10 ? string `0${time.month}` : time.month.toString();
    string day = time.day < 10 ? string `0${time.day}` : time.day.toString();
    string hour = time.hour < 10 ? string `0${time.hour}` : time.hour.toString();
    string minute = time.minute < 10 ? string `0${time.minute}` : time.minute.toString();

    decimal? seconds = time.second;
    string second = seconds is () ? "00" : (seconds < 10.0d ? string `0${seconds}` : seconds.toString());

    time:ZoneOffset? zoneOffset = time.utcOffset;
    string timeZone = "Z";
    if zoneOffset is time:ZoneOffset {
        if zoneOffset.hours == 0 && zoneOffset.minutes == 0 {
            timeZone = "Z";
        } else {
            string hours = zoneOffset.hours.abs() < 10 ? string `0${zoneOffset.hours.abs()}` : zoneOffset.hours.abs().toString();
            string minutes = zoneOffset.minutes.abs() < 10 ? string `0${zoneOffset.minutes.abs()}` : zoneOffset.minutes.abs().toString();
            timeZone = zoneOffset.hours < 0 ? string `-${hours}${minutes}` : string `+${hours}${minutes}`;
        }
    }
    return string `${year}-${month}-${day}T${hour}:${minute}:${second}${timeZone}`;
}
