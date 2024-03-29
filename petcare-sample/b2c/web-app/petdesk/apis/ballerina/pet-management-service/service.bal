import ballerina/http;
import ballerina/jwt;
import ballerina/mime;

# A service representing a network-accessible API
# bound to port `9090`.
service / on new http:Listener(9090) {

    # Get all pets
    # + return - List of pets or error
    resource function get pets(http:Headers headers) returns Pet[]|error? {

        string|error owner = getOwner(headers);
        if owner is error {
            return owner;
        }

        return getPets(owner);
    }

    # Create a new pet
    # + newPet - basic pet details
    # + return - created pet record or error
    resource function post pets(http:Headers headers, @http:Payload PetItem newPet) returns Pet|http:Created|error? {

        [string, string]|error ownerInfo = getOwnerWithEmail(headers);
        if ownerInfo is error {
            return ownerInfo;
        }

        string owner;
        string email;
        [owner, email] = ownerInfo;

        Pet|error pet = addPet(newPet, owner, email);
        return pet;
    }

    # Get a pet by ID
    # + petId - ID of the pet
    # + return - Pet details or not found 
    resource function get pets/[string petId](http:Headers headers) returns Pet|http:NotFound|error? {

        string|error owner = getOwner(headers);
        if owner is error {
            return owner;
        }

        Pet|()|error result = getPetByIdAndOwner(owner, petId);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Update a pet
    # + petId - ID of the pet
    # + updatedPetItem - updated pet details
    # + return - Pet details or not found 
    resource function put pets/[string petId](http:Headers headers, @http:Payload PetItem updatedPetItem) returns Pet|http:NotFound|error? {

        [string, string]|error ownerInfo = getOwnerWithEmail(headers);
        if ownerInfo is error {
            return ownerInfo;
        }

        string owner;
        string email;
        [owner, email] = ownerInfo;

        Pet|()|error result = updatePetById(owner, email, petId, updatedPetItem);
        if result is () {
            return http:NOT_FOUND;
        }
        return result;
    }

    # Delete a pet
    # + petId - ID of the pet
    # + return - Ok response or error
    resource function delete pets/[string petId](http:Headers headers) returns http:NoContent|http:NotFound|error? {

        string|error owner = getOwner(headers);
        if owner is error {
            return owner;
        }

        string|()|error result = deletePetById(owner, petId);
        if result is () {
            return http:NOT_FOUND;
        } else if result is error {
            return result;
        }
        return http:NO_CONTENT;
    }

    resource function put pets/[string petId]/thumbnail(http:Request request, http:Headers headers)
    returns http:Ok|http:NotFound|http:BadRequest|error {

        string|error owner = getOwner(headers);
        if owner is error {
            return owner;
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

        string|()|error thumbnailByPetId = updateThumbnailByPetId(owner, petId, thumbnail);

        if thumbnailByPetId is error {
            return thumbnailByPetId;
        } else if thumbnailByPetId is () {
            return http:NOT_FOUND;
        }

        return http:OK;
    }

    resource function get pets/[string petId]/thumbnail(http:Headers headers) returns http:Response|http:NotFound|error {

        string|error owner = getOwner(headers);
        if owner is error {
            return owner;
        }

        Thumbnail|()|string|error thumbnail = getThumbnailByPetId(owner, petId);
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

    resource function get settings(http:Headers headers) returns Settings|error {

        [string, string]|error ownerInfo = getOwnerWithEmail(headers);
        if ownerInfo is error {
            return ownerInfo;
        }

        string owner;
        string email;
        [owner, email] = ownerInfo;

        Settings|error settings = getSettings(owner, email);

        if settings is error {
            return settings;
        }

        return settings;
    }

    resource function put settings(http:Headers headers, @http:Payload Settings settings) returns http:Ok|error {

        string|error owner = getOwner(headers);
        if owner is error {
            return owner;
        }

        SettingsRecord settingsRecord = {owner: owner, ...settings};
        string|error result = updateSettings(settingsRecord);

        if result is error {
            return result;
        }
        return http:OK;
    }

}

function getOwner(http:Headers headers) returns string|error {

    var jwtHeader = headers.getHeader("x-jwt-assertion");
    if jwtHeader is http:HeaderNotFoundError {
        return jwtHeader;
    }

    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwtHeader);
    return getOwnerFromPayload(payload);
}

function getOwnerWithEmail(http:Headers headers) returns [string, string]|error {

    var jwtHeader = headers.getHeader("x-jwt-assertion");
    if jwtHeader is http:HeaderNotFoundError {
        return jwtHeader;
    }

    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwtHeader);
    string owner = getOwnerFromPayload(payload);
    string emailAddress = payload["email"].toString();

    return [owner, emailAddress];
}

function getOwnerFromPayload(jwt:Payload payload) returns string {

    string? subClaim = payload.sub;
    if subClaim is () {
        subClaim = "Test_Key_User";
    }

    return <string>subClaim;
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
