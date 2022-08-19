export default function decodeUser(user) {
    return {
        "id": user.id,
        "username": user.userName,
        "name": user.name != undefined ? user.name.givenName : "Not Defined",
        "email": user.emails != undefined ? user.emails[0] : "Not Defined"
    };
}