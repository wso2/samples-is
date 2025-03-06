import ballerinax/java.jdbc;
import ballerinax/mysql.driver as _;
import ballerina/uuid;
import ballerina/sql;
import ballerina/log;
import ballerinax/mysql;
import ballerina/time;
import ballerina/http;
import ballerina/random;
import ballerina/io;

configurable string dbHost = "localhost";
configurable string dbUsername = "admin";
configurable string dbPassword = "admin";
configurable string dbDatabase = "CHANNEL_DB";
configurable int dbPort = 3306;
configurable string emailService = "localhost:9090";

table<Doctor> key(org, id) doctorRecords = table [];
table<Booking> key(org, id) bookingRecords = table [];
table<OrgInfo> key(orgName) orgRecords = table [];

final mysql:Client|error dbClient;
boolean useDB = false;
map<Thumbnail> thumbnailMap = {};

const BOOKING_STATUS_CONFIRMED = "Confirmed";
const BOOKING_STATUS_COMPLETED = "Completed";

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

function getDoctors(string org) returns Doctor[]|error {

    if (useDB) {
        return dbGetDoctorsByOrg(org);
    } else {
        Doctor[] doctorList = [];
        doctorRecords.forEach(function(Doctor doctor) {
            if doctor.org == org {
                doctorList.push(doctor);
            }
        });
        return doctorList;
    }
}

function getDoctorByIdAndOrg(string org, string doctorId) returns Doctor|()|error {

    if (useDB) {
        return dbGetDoctorByIdAndOrg(org, doctorId);
    } else {
        Doctor? doctor = doctorRecords[org, doctorId];
        if doctor is () {
            return ();
        }
        return doctor;
    }
}

function getDoctorById(string doctorId) returns Doctor|()|error {

    Doctor doctor = {
        id: "",
        org: "",
        emailAddress: "",
        address: "",
        specialty: "",
        gender: "",
        registrationNumber: "",
        name: "",
        availability: [],
        createdAt: ""
    };
    if (useDB) {
        return dbGetDoctorByDoctorId(doctorId);
    } else {
        foreach Doctor doc in doctorRecords {
            if doc.id == doctorId {
                doctor = doc;
                break;
            }
        }

        if doctor.id == "" {
            return ();
        }
        return doctor;
    }
}

function getDoctorByOrgAndEmail(string org, string emailAddress) returns Doctor|()|error {

    if (useDB) {
        return dbGetDoctorByOrgAndEmail(org, emailAddress);
    } else {
        foreach Doctor doc in doctorRecords {
            if doc.org == org && doc.emailAddress == emailAddress {
                return doc;
            }
        }
        return ();
    }

}

function updateDoctorById(string org, string doctorId, DoctorItem updatedDoctorItem) returns Doctor|()|error {

    if (useDB) {
        Doctor|() oldDoctor = check dbGetDoctorByIdAndOrg(org, doctorId);
        if oldDoctor is () {
            return ();
        }

        Doctor doctor = {id: doctorId, org: org, createdAt: oldDoctor.createdAt, ...updatedDoctorItem};
        Doctor|error updatedDoctor = dbUpdateDoctor(doctor);

        if updatedDoctor is error {
            return updatedDoctor;
        }
        return updatedDoctor;
    } else {
        Doctor? oldeDoctorRecord = doctorRecords[org, doctorId];
        if oldeDoctorRecord is () {
            return ();
        }
        _ = doctorRecords.remove([org, doctorId]);
        doctorRecords.put({id: doctorId, org: org, createdAt: oldeDoctorRecord.createdAt, ...updatedDoctorItem});
        Doctor? doctor = doctorRecords[org, doctorId];
        return doctor;
    }
}

function deleteDoctorById(string org, string doctorId) returns string|()|error {

    if (useDB) {
        return dbDeleteDoctorById(org, doctorId);
    } else {
        Doctor? doctorRecord = doctorRecords[org, doctorId];
        if doctorRecord is () {
            return ();
        }
        _ = doctorRecords.remove([org, doctorId]);
        return "Doctor deleted successfully";
    }
}

function addDoctor(DoctorItem doctorItem, string org) returns Doctor|error {

    string docId = doctorItem.emailAddress;
    time:Utc currentUtc = time:utcNow();
    time:Civil currentTime = time:utcToCivil(currentUtc);
    string timeString = civilToIso8601(currentTime);

    Doctor doctor = {
        id: docId,
        org: org,
        createdAt: timeString,
        ...doctorItem
    };

    if (useDB) {
        return dbAddDoctor(doctor);
    } else {
        doctorRecords.put(doctor);
        Doctor addedDoctor = <Doctor>doctorRecords[org, docId];
        return addedDoctor;
    }
}

function updateThumbnailByDoctorId(string org, string doctorId, Thumbnail thumbnail) returns string|()|error {

    if (useDB) {

        string|()|error deleteResult = dbDeleteThumbnailById(doctorId);

        if deleteResult is error {
            return deleteResult;
        }

        if thumbnail.fileName != "" {
            string|error result = dbAddThumbnailById(doctorId, thumbnail);

            if result is error {
                return result;
            }
        }

        return "Thumbnail updated successfully";
    } else {

        string thumbnailKey = getThumbnailKey(org, doctorId);
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

function getThumbnailByDoctorId(string org, string doctorId) returns Thumbnail|()|string|error {

    if (useDB) {

        Thumbnail|string|error getResult = dbGetThumbnailById(doctorId);

        if getResult is error {
            return getResult;
        } else if getResult is string {
            return getResult;
        } else {
            return <Thumbnail>getResult;
        }
    } else {

        string thumbnailKey = getThumbnailKey(org, doctorId);
        if thumbnailMap.hasKey(thumbnailKey) {
            Thumbnail thumbnail = <Thumbnail>thumbnailMap[thumbnailKey];
            return thumbnail;
        } else {
            return ();
        }
    }
}

function getBookingsByOrgAndEmail(string org, string email) returns Booking[]|error {

    if (useDB) {
        return dbGetBookingsByOrgAndEmail(org, email);
    } else {
        Booking[] bookingList = [];
        bookingRecords.forEach(function(Booking booking) {
            if booking.org == org && booking.emailAddress == email {
                bookingList.push(booking);
            }
        });
        return bookingList;
    }
}

function getBookingsByDoctorId(string org, string doctorId, string date) returns Booking[]|error {

    if (useDB) {
        return dbGetBookingsByOrgAndDoctorId(org, doctorId, date);
    } else {
        Booking[] bookingList = [];
        bookingRecords.forEach(function(Booking booking) {
            if date is "" {
                if booking.org == org && booking.doctorId == doctorId {
                    bookingList.push(booking);
                }
            } else {
                if booking.org == org && booking.doctorId == doctorId && booking.date == date {
                    bookingList.push(booking);
                }
            }
        });

        return bookingList;
    }
}

function getNextAppointmentNumber(string org, string doctorId, string date,
        string sessionStartTime, string sessionEndTime) returns NextAppointment|()|error {

    boolean isValid = isValidDoctorSession(org, doctorId, date, sessionStartTime, sessionEndTime);

    if !isValid {
        return ();
    }

    NextAppointment nextAppointment = {
        date: date,
        doctorId: doctorId,
        sessionEndTime: sessionEndTime,
        sessionStartTime: sessionStartTime,
        activeBookingCount: 0,
        nextAppointmentNumber: 0
    };

    int activeBookingCount = 0;
    if (useDB) {
        int result = check dbGetActiveBookingsByDoctorId(org, doctorId, date, sessionStartTime, sessionEndTime);
        activeBookingCount = result;
    } else {
        bookingRecords.forEach(function(Booking booking) {
            if booking.org == org && booking.doctorId == doctorId && booking.date == date &&
                    booking.sessionStartTime == sessionStartTime && booking.sessionEndTime == sessionEndTime {
                activeBookingCount = activeBookingCount + 1;
            }
        });
    }

    nextAppointment.activeBookingCount = activeBookingCount;
    nextAppointment.nextAppointmentNumber = activeBookingCount + 1;

    return nextAppointment;
}

function isValidDoctorSession(string org, string doctorId, string date,
        string sessionStartTime, string sessionEndTime) returns boolean {

    boolean isValidDoctorSession = false;
    Doctor|()|error doctor = getDoctorByIdAndOrg(org, doctorId);

    io:println("doctor: ", doctor);

    if doctor is Doctor {
        Availability[] doctorAvailability = doctor.availability;

        foreach Availability availability in doctorAvailability {
            if availability.date == date {
                TimeSlot[] timeSlots = availability.timeSlots;
                foreach TimeSlot timeSlot in timeSlots {
                    if timeSlot.startTime == sessionStartTime && timeSlot.endTime == sessionEndTime {
                        isValidDoctorSession = true;
                        break;
                    } else {
                        isValidDoctorSession = false;
                    }
                }
            }
        }

    }

    return isValidDoctorSession;
}

function addBooking(BookingItem bookingItem, string org, string emailAddress) returns Booking|error {

    string bookingId = uuid:createType1AsString();
    time:Utc currentUtc = time:utcNow();
    time:Civil currentTime = time:utcToCivil(currentUtc);
    string timeString = civilToIso8601(currentTime);
    string refNumber = getReferenceNumber();

    NextAppointment|()|error nextAppointment = getNextAppointmentNumber(org, bookingItem.doctorId, bookingItem.date,
            bookingItem.sessionStartTime, bookingItem.sessionEndTime);

    if nextAppointment is NextAppointment {

        Booking booking = {
            id: bookingId,
            org: org,
            referenceNumber: refNumber,
            emailAddress: emailAddress,
            createdAt: timeString,
            status: CONFIRMED,
            appointmentNumber: nextAppointment.nextAppointmentNumber,
            ...bookingItem
        };
        if (useDB) {
            return dbAddBooking(booking);
        } else {
            bookingRecords.put(booking);
            Booking addedBooking = <Booking>bookingRecords[org, bookingId];
            return addedBooking;
        }
    } else if nextAppointment is () {
        return error("Invalid doctor session");
    } else {
        return nextAppointment;
    }

}

function getBookingByIdAndOrg(string org, string bookingId) returns Booking|()|error {

    if (useDB) {
        return dbGetBookingsByOrgAndId(org, bookingId);
    } else {
        Booking? booking = bookingRecords[org, bookingId];
        if booking is () {
            return ();
        }
        return booking;
    }
}

function updateBookingById(string org, string bookingId, BookingItemUpdated updatedBookingItem) returns Booking|()|error {

    Booking|()|error oldeBookingRecord = getBookingByIdAndOrg(org, bookingId);

    if oldeBookingRecord is error {
        return oldeBookingRecord;
    } else if oldeBookingRecord is () {
        return ();
    } else {

        Booking booking = {
            id: bookingId,
            org: org,
            referenceNumber: oldeBookingRecord.referenceNumber,
            emailAddress: oldeBookingRecord.emailAddress,
            createdAt: oldeBookingRecord.createdAt,
            appointmentNumber: oldeBookingRecord.appointmentNumber,
            ...updatedBookingItem
        };

        if (useDB) {
            return dbUpdateBooking(booking);
        } else {
            bookingRecords.put(booking);
            Booking? updatedBooking = bookingRecords[org, bookingId];
            return updatedBooking;
        }
    }
}

function deleteBookingById(string org, string bookingId) returns string|()|error {

    if (useDB) {
        return dbDeleteBookingById(bookingId);
    } else {
        Booking? bookingRecord = bookingRecords[org, bookingId];
        if bookingRecord is () {
            return ();
        }
        _ = bookingRecords.remove([org, bookingId]);
        return "Booking deleted successfully";
    }
}

function getOrgInfo(string org) returns OrgInfo|()|error {

    if (useDB) {
        return dbGetOrgInfoByOrg(org);
    } else {
        OrgInfo? orgInfo = orgRecords[org];
        if orgInfo is () {
            return ();
        }
        return orgInfo;
    }
}

function updateOrgInfo(string org, OrgInfoItem orgInfoItem) returns OrgInfo|error {

    OrgInfo orgInfo = {
        orgName: org,
        ...orgInfoItem
    };

    if (useDB) {
        return dbUpdateOrgInfoByOrg(orgInfo);
    } else {
        orgRecords.put(orgInfo);
        OrgInfo updatedOrgInfo = <OrgInfo>orgRecords[org];
        return updatedOrgInfo;
    }
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

function getThumbnailKey(string org, string doctorId) returns string {
    return org + "-" + doctorId;
}

function sendEmail(Booking booking, Doctor doctor) returns error? {

    http:Client httpClient = check new (emailService);

    string emailSubject = "[Pet Care App][Booking Confirmation] Your booking is confirmed.";
    string emailAddress = booking.emailAddress;

    Property[] properties = [
        addProperty("currentDate", getCurrentDate()),
        addProperty("emailAddress", emailAddress),
        addProperty("bookingId", booking.referenceNumber),
        addProperty("appointmentDate", booking.date),
        addProperty("appointmentTimeSlot", booking.sessionStartTime + " - " + booking.sessionEndTime),
        addProperty("appointmentNo", booking.appointmentNumber.toString()),
        addProperty("appointmentFee", "$30"),
        addProperty("petName", booking.petName),
        addProperty("petType", booking.petType),
        addProperty("petDoB", booking.petDoB),
        addProperty("doctorName", doctor.name),
        addProperty("doctorSpecialty", doctor.specialty),
        addProperty("hospitalName", "Hospital Name"),
        addProperty("hospitalAddress", "Hospital Address"),
        addProperty("hospitalTelephone", "Hospital Telephone")
    ];

    EmailContent emailContent = {
        emailType: BOOKING_CONFIRMED,
        receipient: emailAddress,
        emailSubject: emailSubject,
        properties: properties
    };

    http:Request request = new;
    request.setJsonPayload(emailContent);
    http:Response response = check httpClient->/messages.post(request);

    if (response.statusCode == 200) {
        return;
    }
    else {
        return error("Error while sending email, " + response.reasonPhrase);
    }
}

function addProperty(string name, string value) returns Property {
    Property prop = {name: name, value: value};
    return prop;
}

function getCurrentDate() returns string {
    time:Utc currentUtc = time:utcNow();
    time:Civil currentTime = time:utcToCivil(currentUtc);

    string year;
    string month;
    string day;
    [year, month, day] = getDateFromCivilTime(currentTime);

    int|error currentMonth = int:fromString(month);
    if (currentMonth is error) {
        log:printError("Error while converting month to int: " + currentMonth.toString());
        return "";
    }
    return getMonthName(currentMonth) + " " + day + ", " + year;
}

function getDateFromCivilTime(time:Civil time) returns [string, string, string] {

    string year = time.year.toString();
    string month = time.month < 10 ? string `0${time.month}` : time.month.toString();
    string day = time.day < 10 ? string `0${time.day}` : time.day.toString();
    return [year, month, day];
}

function getMonthName(int index) returns string {
    match index {
        1 => {
            return "January";
        }
        2 => {
            return "February";
        }
        3 => {
            return "March";
        }
        4 => {
            return "April";
        }
        5 => {
            return "May";
        }
        6 => {
            return "June";
        }
        7 => {
            return "July";
        }
        8 => {
            return "August";
        }
        9 => {
            return "September";
        }
        10 => {
            return "October";
        }
        11 => {
            return "November";
        }
        12 => {
            return "December";
        }
        _ => {
            return "";
        }
    }
}

function getReferenceNumber() returns string {

    time:Utc currentUtc = time:utcNow();
    time:Civil currentTime = time:utcToCivil(currentUtc);

    string year;
    string month;
    string day;
    [year, month, day] = getDateFromCivilTime(currentTime);
    int|random:Error randomInteger = random:createIntInRange(1000, 10000);

    if (randomInteger is random:Error) {
        log:printError("Error while generating random number: " + randomInteger.toString());
        return year + month + day + "xxxxx";
    }

    return year + month + day + randomInteger.toString();
}
