import ballerinax/java.jdbc;
import ballerina/sql;
import ballerina/log;

function dbGetDoctorsByOrg(string org) returns Doctor[]|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT d.id, d.org, d.createdAt, d.name, d.gender, d.registrationNumber, d.specialty, 
        d.emailAddress, d.dateOfBirth, d.address, IFNULL(a.date, "") as date, IFNULL(a.startTime, "") as startTime, 
        IFNULL(a.endTime, "") as endTime, IFNULL(a.availableBookingCount, 0) as availableBookingCount FROM Doctor d 
        LEFT JOIN Availability a ON d.id = a.doctorId WHERE org = ${org}`;
        stream<DoctorAvailabilityRecord, sql:Error?> doctorStream = dbClient->query(query);

        map<Doctor> doctorList = check getDoctorsFromStream(doctorStream);
        check doctorStream.close();
        return doctorList.toArray();
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetDoctorByIdAndOrg(string org, string doctorId) returns Doctor|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT d.id, d.org, d.createdAt, d.name, d.gender, d.registrationNumber, d.specialty, 
        d.emailAddress, d.dateOfBirth, d.address, IFNULL(a.date, "") as date, IFNULL(a.startTime, "") as startTime, 
        IFNULL(a.endTime, "") as endTime, IFNULL(a.availableBookingCount, 0) as availableBookingCount FROM Doctor d 
        LEFT JOIN Availability a ON d.id = a.doctorId WHERE org = ${org} and id = ${doctorId}`;
        stream<DoctorAvailabilityRecord, sql:Error?> doctorStream = dbClient->query(query);

        map<Doctor> doctorList = check getDoctorsFromStream(doctorStream);

        if doctorList.length() == 0 {
            return ();
        }
        return doctorList.get(doctorId);
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetDoctorByOrgAndEmail(string org, string email) returns Doctor|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT d.id, d.org, d.createdAt, d.name, d.gender, d.registrationNumber, d.specialty, 
        d.emailAddress, d.dateOfBirth, d.address, IFNULL(a.date, "") as date, IFNULL(a.startTime, "") as startTime, 
        IFNULL(a.endTime, "") as endTime, IFNULL(a.availableBookingCount, 0) as availableBookingCount FROM Doctor d 
        LEFT JOIN Availability a ON d.id = a.doctorId WHERE org = ${org} and emailAddress = ${email}`;
        stream<DoctorAvailabilityRecord, sql:Error?> doctorStream = dbClient->query(query);

        map<Doctor> doctorList = check getDoctorsFromStream(doctorStream);

        if doctorList.length() == 0 {
            return ();
        }
        return doctorList.get(doctorList.keys()[0]);
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetDoctorByDoctorId(string doctorId) returns Doctor|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT d.id, d.org, d.createdAt, d.name, d.gender, d.registrationNumber, d.specialty, 
        d.emailAddress, d.dateOfBirth, d.address, IFNULL(a.date, "") as date, IFNULL(a.startTime, "") as startTime, 
        IFNULL(a.endTime, "") as endTime, IFNULL(a.availableBookingCount, 0) as availableBookingCount FROM Doctor d 
        LEFT JOIN Availability a ON d.id = a.doctorId WHERE id = ${doctorId}`;
        stream<DoctorAvailabilityRecord, sql:Error?> doctorStream = dbClient->query(query);

        map<Doctor> doctorList = check getDoctorsFromStream(doctorStream);

        if doctorList.length() == 0 {
            return ();
        }
        return doctorList.get(doctorId);
    }
    on fail error e {
        return handleError(e);
    }
}

function dbDeleteDoctorById(string org, string doctorId) returns string|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `DELETE from Doctor WHERE id = ${doctorId} and org = ${org}`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);

    if result is sql:Error {
        return handleError(result);
    } else if result.affectedRowCount == 0 {
        return ();
    }

    return "Doctor deleted successfully";
}

function dbAddDoctor(Doctor doctor) returns Doctor|error {

    log:printInfo("Adding doctor from DB");
    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        log:printInfo("DB client error");
        return handleError(dbClient);
    }

    transaction {
        log:printInfo("Starting transaction");
        sql:ParameterizedQuery query = `INSERT INTO Doctor (id, org, createdAt, name, gender, registrationNumber, 
        specialty, emailAddress, dateOfBirth, address) VALUES (${doctor.id}, ${doctor.org}, ${doctor.createdAt}, 
        ${doctor.name}, ${doctor.gender}, ${doctor.registrationNumber}, ${doctor.specialty}, ${doctor.emailAddress}, 
        ${doctor.dateOfBirth}, ${doctor.address});`;

        log:printInfo("executing query");

        sql:ExecutionResult|sql:Error insertResult = check dbClient->execute(query);

        if insertResult is sql:Error {
            log:printError("Error while inserting the doctor", insertResult);
        }

        log:printInfo("Doctor added");
        log:printInfo("Adding timeslots");

        Availability[]? availabilitySlots = doctor.availability;
        sql:ExecutionResult[]|sql:Error batchResult = [];

        if availabilitySlots != null && availabilitySlots.length() > 0 {
            sql:ParameterizedQuery[] batchResultinsertQueries = from Availability availability in availabilitySlots
                from TimeSlot timeSlot in availability.timeSlots
                select `INSERT INTO Availability (doctorId, date, startTime, endTime, availableBookingCount)
                    VALUES (${doctor.id}, ${availability.date}, ${timeSlot.startTime}, ${timeSlot.endTime},
                     ${timeSlot.availableBookingCount})`;
            batchResult = dbClient->batchExecute(batchResultinsertQueries);
        }

        if batchResult is sql:Error {
            log:printInfo("batchResult is sql:Error" + batchResult.toString());
            rollback;
            return handleError(batchResult);
        } else {
            log:printInfo("batchResult is not error");
            check commit;

            Doctor|()|error addedDoctor = dbGetDoctorByDoctorId(doctor.id);
            log:printInfo("added doctor: " + doctor.toString());
            if addedDoctor is () {
                return error("Error while adding the doctor");
            }

            return addedDoctor;
        }
    } on fail error e {
        log:printInfo("On fail error", e);
        return handleError(e);
    }
}

function dbUpdateDoctor(Doctor doctor) returns Doctor|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    transaction {
        sql:ParameterizedQuery query = `UPDATE Doctor SET name = ${doctor.name}, gender = ${doctor.gender}, 
        registrationNumber = ${doctor.registrationNumber}, specialty = ${doctor.specialty},emailAddress = ${doctor.emailAddress},
         dateOfBirth = ${doctor.dateOfBirth}, address = ${doctor.address} WHERE id = ${doctor.id};`;
        _ = check dbClient->execute(query);

        sql:ParameterizedQuery deleteQuery = `DELETE FROM Availability WHERE doctorId = ${doctor.id};`;
        _ = check dbClient->execute(deleteQuery);

        Availability[]? availabilitySlots = doctor.availability;
        sql:ExecutionResult[]|sql:Error batchResult = [];

        if availabilitySlots != null {

            sql:ParameterizedQuery[] insertQueries = from Availability availability in availabilitySlots
                from TimeSlot timeSlot in availability.timeSlots
                select `INSERT INTO Availability (doctorId, date, startTime, endTime, availableBookingCount)
                    VALUES (${doctor.id}, ${availability.date}, ${timeSlot.startTime}, ${timeSlot.endTime},
                     ${timeSlot.availableBookingCount})`;
            batchResult = dbClient->batchExecute(insertQueries);
        }

        if batchResult is sql:Error {
            rollback;
            return handleError(batchResult);
        } else {
            check commit;

            Doctor|()|error updatedDoctor = dbGetDoctorByDoctorId(doctor.id);
            if updatedDoctor is () {
                return error("Error while updating the doctor");
            }
            return updatedDoctor;
        }

    } on fail error e {
        return handleError(e);
    }
}

function dbAddThumbnailById(string doctorId, Thumbnail thumbnail) returns string|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `INSERT INTO Thumbnail (doctorId, fileName, content)
            VALUES (${doctorId}, ${thumbnail.fileName}, ${thumbnail.content.toBytes()});`;
        _ = check dbClient->execute(query);

        return "Thumbnail added successfully";
    }
    on fail error e {
        return handleError(e);
    }
}

function dbDeleteThumbnailById(string doctorId) returns string|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `DELETE FROM Thumbnail WHERE doctorId = ${doctorId};`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);

    if result is sql:Error {
        return handleError(result);
    } else if result.affectedRowCount == 0 {
        return ();
    }

    return "Thumbnail deleted successfully";
}

function dbGetThumbnailById(string doctorId) returns Thumbnail|string|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `SELECT fileName, content FROM Thumbnail WHERE doctorId = ${doctorId}`;
    Thumbnail|sql:Error result = dbClient->queryRow(query);

    if result is sql:NoRowsError {
        return "No thumbnail found for doctorId: " + doctorId;
    } else if result is sql:Error {
        return handleError(result);
    } else {
        return result;
    }
}

function dbGetBookingsByOrgAndEmail(string org, string email) returns Booking[]|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT id, org, referenceNumber, emailAddress, createdAt, petOwnerName, 
        mobileNumber, doctorId, petId, petName, petType, petDoB, status, date, sessionStartTime, sessionEndTime, 
        appointmentNumber from Booking WHERE org = ${org} and emailAddress = ${email}`;
        stream<Booking, sql:Error?> bookingStream = dbClient->query(query);

        Booking[] bookings = check from Booking booking in bookingStream
            select booking;
        check bookingStream.close();
        return bookings;
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetActiveBookingsByDoctorId(string org, string doctorId, string date, string sessionStartTime, string sessionEndTime) returns int|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT COUNT(*) FROM Booking WHERE org = ${org} AND doctorId = ${doctorId} 
        AND date = ${date} AND sessionStartTime = ${sessionStartTime} AND sessionEndTime = ${sessionEndTime}`;
        int|sql:Error result = dbClient->queryRow(query);
        return result;
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetBookingsByOrgAndDoctorId(string org, string doctorId, string date) returns Booking[]|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `SELECT id, org, referenceNumber, emailAddress, createdAt, petOwnerName, 
        mobileNumber, doctorId, petId, petName, petType, petDoB, status, date, sessionStartTime, sessionEndTime, 
        appointmentNumber from Booking WHERE org = ${org} and doctorId = ${doctorId}`;

        if date != "" {
            sql:ParameterizedQuery queryWithDate = ` and date = ${date}`;
            query = sql:queryConcat(query, queryWithDate);
        }

        stream<Booking, sql:Error?> bookingStream = dbClient->query(query);

        Booking[] bookings = check from Booking booking in bookingStream
            select booking;
        check bookingStream.close();
        return bookings;
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetBookingsByOrgAndId(string org, string id) returns Booking|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `SELECT id, org, referenceNumber, emailAddress, createdAt, petOwnerName, 
        mobileNumber, doctorId, petId, petName, petType, petDoB, status, date, sessionStartTime, sessionEndTime, 
        appointmentNumber from Booking WHERE org = ${org} and id = ${id}`;

    Booking|sql:Error result = dbClient->queryRow(query);

    if result is sql:NoRowsError {
        return ();
    } else if result is sql:Error {
        return handleError(result);
    } else {
        return result;
    }
}

function dbAddBooking(Booking booking) returns Booking|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `INSERT INTO Booking (id, org, referenceNumber, emailAddress, createdAt,
         petOwnerName, mobileNumber, doctorId, petId, petName, petType, petDoB, status, date, sessionStartTime,
          sessionEndTime, appointmentNumber) VALUES (${booking.id}, ${booking.org}, ${booking.referenceNumber}, 
          ${booking.emailAddress}, ${booking.createdAt}, ${booking.petOwnerName}, ${booking.mobileNumber},
           ${booking.doctorId}, ${booking.petId}, ${booking.petName}, ${booking.petType}, ${booking.petDoB},
            ${booking.status}, ${booking.date}, ${booking.sessionStartTime}, ${booking.sessionEndTime}, 
            ${booking.appointmentNumber});`;
        _ = check dbClient->execute(query);

        Booking|()|error addedBooking = dbGetBookingsByOrgAndId(booking.org, booking.id);
        if addedBooking is () {
            return error("Error while adding the booking");
        }
        return addedBooking;
    }
    on fail error e {
        return handleError(e);
    }
}

function dbUpdateBooking(Booking booking) returns Booking|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `UPDATE Booking SET petOwnerName = ${booking.petOwnerName}, 
        mobileNumber = ${booking.mobileNumber}, doctorId = ${booking.doctorId}, petId = ${booking.petId}, 
        petName = ${booking.petName}, petType = ${booking.petType}, petDoB = ${booking.petDoB}, status = ${booking.status}, 
        date = ${booking.date}, sessionStartTime = ${booking.sessionStartTime}, sessionEndTime = ${booking.sessionEndTime}, 
        appointmentNumber = ${booking.appointmentNumber} WHERE id = ${booking.id};`;
        _ = check dbClient->execute(query);

        Booking|()|error updatedBooking = dbGetBookingsByOrgAndId(booking.org, booking.id);
        if updatedBooking is () {
            return error("Error while updating the booking");
        }
        return updatedBooking;
    }
    on fail error e {
        return handleError(e);
    }
}

function dbDeleteBookingById(string bookingId) returns string|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `DELETE FROM Booking WHERE id = ${bookingId};`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);

    if result is sql:Error {
        return handleError(result);
    } else if result.affectedRowCount == 0 {
        return ();
    }

    return "Booking deleted successfully";
}

function dbUpdateOrgInfoByOrg(OrgInfo orgInfo) returns OrgInfo|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `INSERT INTO OrgInfo (orgName, name, address, telephoneNumber, registrationNumber)
            VALUES (${orgInfo.orgName}, ${orgInfo.name}, ${orgInfo.address}, ${orgInfo.telephoneNumber}, ${orgInfo.registrationNumber})
            ON DUPLICATE KEY UPDATE name = ${orgInfo.name}, address = ${orgInfo.address}, telephoneNumber = ${orgInfo.telephoneNumber};`;
        _ = check dbClient->execute(query);

        OrgInfo|()|error updatedOrgInfo = dbGetOrgInfoByOrg(orgInfo.orgName);

        if updatedOrgInfo is () {
            return error("Error while updating the org info");
        }
        return updatedOrgInfo;
    }
    on fail error e {
        return handleError(e);
    }
}

function dbGetOrgInfoByOrg(string org) returns OrgInfo|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `SELECT orgName, name, address, telephoneNumber, registrationNumber from OrgInfo 
    WHERE orgName = ${org}`;

    OrgInfo|sql:Error result = dbClient->queryRow(query);

    if result is sql:NoRowsError {
        return ();
    } else if result is sql:Error {
        return handleError(result);
    } else {
        return result;
    }
}

function handleError(error err) returns error {
    log:printError("Error while processing the request", err);
    return error("Error while processing the request");
}

function getDoctorsFromStream(stream<DoctorAvailabilityRecord, sql:Error?> doctorStream) returns map<Doctor>|error {

    map<Doctor> doctors = {};

    check from DoctorAvailabilityRecord entry in doctorStream
        do {
            boolean isDoctorAvailable = doctors.hasKey(entry.id);
            if !isDoctorAvailable {

                Doctor doctor = {
                    id: entry.id,
                    name: entry.name,
                    createdAt: entry.createdAt,
                    specialty: entry.specialty,
                    emailAddress: entry.emailAddress,
                    gender: entry.gender,
                    org: entry.org,
                    registrationNumber: entry.registrationNumber,
                    availability: []
                };

                TimeSlot timeSlot = {
                    availableBookingCount: entry.availableBookingCount,
                    startTime: entry.startTime,
                    endTime: entry.endTime
                };

                Availability availability = {
                    date: entry.date,
                    timeSlots: [timeSlot]
                };

                doctor.availability.push(availability);
                doctors[doctor.id] = doctor;
            } else {

                TimeSlot timeSlot = {
                    availableBookingCount: entry.availableBookingCount,
                    startTime: entry.startTime,
                    endTime: entry.endTime
                };

                Availability availability = {
                    date: entry.date,
                    timeSlots: [timeSlot]
                };

                Doctor d = doctors.get(entry.id);
                d.availability.push(availability);
            }
        };

    return doctors;
}
