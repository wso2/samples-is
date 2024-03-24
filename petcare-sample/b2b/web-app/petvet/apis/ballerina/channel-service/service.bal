import ballerina/http;
import ballerina/mime;
import ballerina/log;

UserInfoResolver userInfoResolver = new;

# A service representing a network-accessible API
# bound to port `9091`.
@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}
service / on new http:Listener(9091) {

    # Get all doctors
    # + return - List of doctors or error
    resource function get doctors(http:Headers headers) returns Doctor[]|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        return getDoctors(userInfo.organization);
    }

    # Create a new doctor
    # + newDoctor - basic doctor details
    # + return - created doctor record or error
    resource function post doctors(http:Headers headers, @http:Payload DoctorItem newDoctor) returns Doctor|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        Doctor|error doctor = addDoctor(newDoctor, userInfo.organization);
        return doctor;
    }

    # Get a doctor by ID
    # + doctorId - ID of the doctor
    # + return - Doctor details or not found 
    resource function get doctors/[string doctorId](http:Headers headers) returns Doctor|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        Doctor|()|error result = getDoctorByIdAndOrg(userInfo.organization, doctorId);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Update a doctor
    # + doctorId - ID of the doctor
    # + updatedDoctorItem - updated doctor details
    # + return - Doctor details or not found 
    resource function put doctors/[string doctorId](http:Headers headers, @http:Payload DoctorItem updatedDoctorItem) returns Doctor|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        Doctor|()|error result = updateDoctorById(userInfo.organization, doctorId, updatedDoctorItem);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Delete a doctor
    # + doctorId - ID of the doctor
    # + return - Ok response or error
    resource function delete doctors/[string doctorId](http:Headers headers) returns http:NoContent|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string|()|error result = deleteDoctorById(userInfo.organization, doctorId);
        if result is () {
            return http:NOT_FOUND;
        } else if result is error {
            return result;
        }
        return http:NO_CONTENT;
    }

    # Update the thumbnail image of a doctor
    # + doctorId - ID of the doctor
    # + return - Ok response or error
    resource function put doctors/[string doctorId]/thumbnail(http:Request request, http:Headers headers)
    returns http:Ok|http:NotFound|http:BadRequest|error {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        var bodyParts = check request.getBodyParts();
        Thumbnail thumbnail;
        if bodyParts.length() == 0 {
            thumbnail = {fileName: "", content: ""};
        } else {
            Thumbnail|error? handleContentResult = handleContent(bodyParts[0]);
            if handleContentResult is error {
                return http:BAD_REQUEST;
            }
            thumbnail = <Thumbnail>handleContentResult;
        }

        string|()|error thumbnailByDoctorId = updateThumbnailByDoctorId(userInfo.organization, doctorId, thumbnail);

        if thumbnailByDoctorId is error {
            return thumbnailByDoctorId;
        } else if thumbnailByDoctorId is () {
            return http:NOT_FOUND;
        }

        return http:OK;
    }

    # Get the thumbnail image of a doctor
    # + doctorId - ID of the doctor
    # + return - Return the thumbnail image or not found
    resource function get doctors/[string doctorId]/thumbnail(http:Headers headers) returns http:Response|http:NotFound|error {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        Thumbnail|()|string|error thumbnail = getThumbnailByDoctorId(userInfo.organization, doctorId);
        http:Response response = new;

        if thumbnail is () {
            return http:NOT_FOUND;
        } else if thumbnail is error {
            return thumbnail;
        } else if thumbnail is string {
            return response;
        } else {

            string fileName = thumbnail.fileName;
            byte[] encodedContent = thumbnail.content.toBytes();
            byte[] base64Decoded = <byte[]>(check mime:base64Decode(encodedContent));

            response.setHeader("Content-Type", "application/octet-stream");
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            response.setBinaryPayload(base64Decoded);
        }

        return response;
    }

    # Get all bookings of a doctor
    # + doctorId - ID of the doctor
    # + date - Date of the boookings (Format: yyyy-MM-dd)
    # + return - List of bookings or error
    resource function get doctors/[string doctorId]/bookings(http:Headers headers, string? date) returns Booking[]|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string dateValue = "";
        if date != null {
            dateValue = date;
        }
        return getBookingsByDoctorId(userInfo.organization, doctorId, dateValue);
    }

    # Get next appointment number of a doctor
    # + doctorId - ID of the doctor
    # + date - Date of the boookings (Format: yyyy-MM-dd)
    # + sessionStartTime - Start time of the session (Format: HH:mm AM/PM)
    # + sessionEndTime - End time of the session (Format: HH:mm AM/PM)
    # + return - List of bookings or error
    resource function get doctors/[string doctorId]/next\-appointment\-number(http:Headers headers, string date,
            string sessionStartTime, string sessionEndTime) returns NextAppointment|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        NextAppointment|()|error nextAppointmentNumber = getNextAppointmentNumber(userInfo.organization, doctorId, date,
        sessionStartTime, sessionEndTime);
        if nextAppointmentNumber is () {
            return http:NOT_FOUND;
        } else {
            return nextAppointmentNumber;
        }
    }

    # Get doctor's details
    # + return - Doctor details or not found 
    resource function get me(http:Headers headers) returns Doctor|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string email = <string>userInfo.emailAddress;

        Doctor|()|error result = getDoctorByOrgAndEmail(org, email);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Get all bookings
    # + return - List of bookings or error
    resource function get bookings(http:Headers headers) returns Booking[]|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string email = <string>userInfo.emailAddress;

        return getBookingsByOrgAndEmail(org, email);
    }

    # Create a new booking
    # + newBooking - basic booking details
    # + return - created booking record or error
    resource function post bookings(http:Headers headers, @http:Payload BookingItem newBooking) returns Booking|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string email = <string>userInfo.emailAddress;

        Booking|error booking = addBooking(newBooking, org, email);
        if booking is error {
            return booking;
        }

        Doctor|()|error doctor = getDoctorByIdAndOrg(org, newBooking.doctorId);
        if doctor is Doctor {
            error? sendEmailResult = sendEmail(booking, doctor);
            if sendEmailResult is error {
                log:printError("Error while sending email for the booking: ", sendEmailResult);
            }
        } else {
            log:printError("Error while getting doctor details: ", doctor);
        }

        return booking;
    }

    # Get a booking by ID
    # + bookingId - ID of the booking
    # + return - Booking details or not found 
    resource function get bookings/[string bookingId](http:Headers headers) returns Booking|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        Booking|()|error result = getBookingByIdAndOrg(userInfo.organization, bookingId);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Update a booking
    # + bookingId - ID of the booking
    # + updatedBookingItem - updated booking details
    # + return - Booking details or not found 
    resource function put bookings/[string bookingId](http:Headers headers, @http:Payload BookingItemUpdated updatedBookingItem)
    returns Booking|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        Booking|()|error result = updateBookingById(userInfo.organization, bookingId, updatedBookingItem);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Delete a booking
    # + bookingId - ID of the booking
    # + return - Ok response or error
    resource function delete bookings/[string bookingId](http:Headers headers) returns http:NoContent|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string|()|error result = deleteBookingById(userInfo.organization, bookingId);
        if result is () {
            return http:NOT_FOUND;
        } else if result is error {
            return result;
        }
        return http:NO_CONTENT;
    }

    # Get information about the organization
    # + return - Organization information or error
    resource function get org\-info(http:Headers headers) returns OrgInfo|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        OrgInfo|()|error orgInfo = getOrgInfo(userInfo.organization);
        if orgInfo is OrgInfo {
            return orgInfo;
        } else if orgInfo is () {
            return http:NOT_FOUND;
        } else {
            return orgInfo;
        }
    }

    # Update organization information
    # + updatedOrgInfo - updated organization details
    # + return - Organization information or error
    resource function put org\-info(http:Headers headers, @http:Payload OrgInfoItem updatedOrgInfo) returns OrgInfo|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        return updateOrgInfo(userInfo.organization, updatedOrgInfo);
    }
}

function handleContent(mime:Entity bodyPart) returns Thumbnail|error? {

    var mediaType = mime:getMediaType(bodyPart.getContentType());
    mime:ContentDisposition contentDisposition = bodyPart.getContentDisposition();
    string fileName = contentDisposition.fileName;

    if mediaType is mime:MediaType {

        string baseType = mediaType.getBaseType();
        if mime:IMAGE_JPEG == baseType || mime:IMAGE_GIF == baseType || mime:IMAGE_PNG == baseType {

            byte[] bytes = check bodyPart.getByteArray();
            byte[] base64Encoded = <byte[]>(check mime:base64Encode(bytes));
            string base64EncodedString = check string:fromBytes(base64Encoded);

            Thumbnail thumbnail = {
                fileName: fileName,
                content: base64EncodedString
            };

            return thumbnail;
        }
    }

    return error("Unsupported media type found");
}
