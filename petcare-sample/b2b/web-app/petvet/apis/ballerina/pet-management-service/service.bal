import ballerina/http;
import ballerina/mime;

UserInfoResolver userInfoResolver = new;

# A service representing a network-accessible API
# bound to port `9092`.
@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}
service / on new http:Listener(9092) {

    # Get all pets
    # + return - List of pets or error
    resource function get pets(http:Headers headers) returns Pet[]|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string owner = userInfo.userId;

        return getPets(org, owner);
    }

    # Create a new pet
    # + newPet - Basic pet details
    # + return - Created pet record or error
    resource function post pets(http:Headers headers, @http:Payload PetItem newPet) returns Pet|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string owner = userInfo.userId;
        string email = <string>userInfo.emailAddress;

        Pet|error pet = addPet(newPet, org, owner, email);
        return pet;
    }

    # Get a pet by ID
    # + petId - ID of the pet
    # + return - Pet details or not found 
    resource function get pets/[string petId](http:Headers headers) returns Pet|http:NotFound|error? {

        Pet|() result = getPetById(petId);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Update a pet
    # + petId - ID of the pet
    # + updatedPetItem - Updated pet details
    # + return - Pet details or not found
    resource function put pets/[string petId](http:Headers headers, @http:Payload PetItem updatedPetItem) returns Pet|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string owner = userInfo.userId;
        string email = <string>userInfo.emailAddress;

        Pet|()|error result = updatePetById(org, owner, email, petId, updatedPetItem);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Delete a pet
    # + petId - ID of the pet
    # + return - No Content response or error
    resource function delete pets/[string petId](http:Headers headers) returns http:NoContent|http:NotFound|error? {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string owner = userInfo.userId;

        string|()|error result = deletePetById(org, owner, petId);
        if result is () {
            return http:NOT_FOUND;
        } else if result is error {
            return result;
        }
        return http:NO_CONTENT;
    }

    # Update thumbnail for the pet
    # + petId - ID of the pet
    # + return - Ok response or error
    resource function put pets/[string petId]/thumbnail(http:Request request, http:Headers headers)
    returns http:Ok|http:NotFound|http:BadRequest|error {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string owner = userInfo.userId;

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

        string|()|error thumbnailByPetId = updateThumbnailByPetId(org, owner, petId, thumbnail);

        if thumbnailByPetId is error {
            return thumbnailByPetId;
        } else if thumbnailByPetId is () {
            return http:NOT_FOUND;
        }

        return http:OK;
    }

    # Get thumbnail for the pet
    # + petId - ID of the pet
    # + return - Ok response or error
    resource function get pets/[string petId]/thumbnail(http:Headers headers) returns http:Response|http:NotFound|error {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string owner = userInfo.userId;

        Thumbnail|()|string|error thumbnail = getThumbnailByPetId(org, owner, petId);
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

    # Get medical reports of the pet
    # + petId - ID of the pet
    # + return - Medical report record or error
    resource function get pets/[string petId]/medical\-reports(http:Headers headers) returns MedicalReport[]|error? {

        return getMedicalReportsByPetId(petId);
    }

    # Create a new medical report
    # + medicalReportItem - Medical report details
    # + return - Created medical report record or error
    resource function post pets/[string petId]/medical\-reports(http:Headers headers,
            @http:Payload MedicalReportItem medicalReportItem) returns MedicalReport|http:NotFound|error? {

        MedicalReport|()|error medicalReport = addMedicalReport(petId, medicalReportItem);
        if medicalReport is () {
            return http:NOT_FOUND;
        }

        return medicalReport;
    }

    # Get medical reports of the pet
    # + petId - ID of the pet
    # + reportId - ID of the report
    # + return - Medical report record or error
    resource function get pets/[string petId]/medical\-reports/[string reportId](http:Headers headers) returns MedicalReport|
    http:NotFound|error? {

        MedicalReport|()|error medicalReportsByPetIdAndReportId = getMedicalReportsByPetIdAndReportId(petId, reportId);
        if medicalReportsByPetIdAndReportId is () {
            return http:NOT_FOUND;
        }

        return medicalReportsByPetIdAndReportId;
    }

    # Update medical reports of the pet
    # + petId - ID of the pet
    # + reportId - ID of the report
    # + updatedMedicalReportItem - Updated medical report details
    # + return - Medical report record or error
    resource function put pets/[string petId]/medical\-reports/[string reportId](http:Headers headers,
            @http:Payload MedicalReportItem updatedMedicalReportItem) returns http:Ok|http:NotFound|error? {

        MedicalReport|()|error medicalReport = updateMedicalReport(petId, reportId, updatedMedicalReportItem);
        if medicalReport is MedicalReport {
            return http:OK;
        } else if medicalReport is () {
            return http:NOT_FOUND;
        } else {
            return medicalReport;
        }
    }

    # Delete medical reports of the pet
    # + petId - ID of the pet
    # + reportId - ID of the report
    # + return - No Content response or error
    resource function delete pets/[string petId]/medical\-reports/[string reportId](http:Headers headers) returns
    http:NoContent|http:NotFound|error? {

        string|()|error medicalReportById = deleteMedicalReportById(petId, reportId);
        if medicalReportById is string {
            return http:NO_CONTENT;
        } else if medicalReportById is () {
            return http:NOT_FOUND;
        } else {
            return medicalReportById;
        }
    }

    # Get settings for the user
    # + return - Settings response or error
    resource function get settings(http:Headers headers) returns Settings|error {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string owner = userInfo.userId;
        string email = <string>userInfo.emailAddress;

        Settings|error settings = getSettings(org, owner, email);

        if settings is error {
            return settings;
        }

        return settings;
    }

    # Updated settings for the user
    # + settings - Settings details
    # + return - OK response or error
    resource function put settings(http:Headers headers, @http:Payload Settings settings) returns http:Ok|error {

        UserInfo|error userInfo = userInfoResolver.retrieveUserInfo(headers);
        if userInfo is error {
            return userInfo;
        }

        string org = userInfo.organization;
        string owner = userInfo.userId;

        SettingsRecord settingsRecord = {org: org, owner: owner, ...settings};
        string|error result = updateSettings(settingsRecord);

        if result is error {
            return result;
        }
        return http:OK;
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
