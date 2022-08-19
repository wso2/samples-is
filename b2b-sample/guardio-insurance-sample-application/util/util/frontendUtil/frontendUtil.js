import { checkAdmin } from '../orgUtil/orgUtil';

const LOADING_DISPLAY_NONE = {
    display: "none"
};
const LOADING_DISPLAY_BLOCK = {
    display: "block"
};

function checkCustomization(colorTheme) {
    return colorTheme == "blue" ? "rs-theme-dark" : "rs-theme-high-contrast";
}

function hideBasedOnScopes(scopes) {
    
    if (checkAdmin(scopes)) {
        return LOADING_DISPLAY_BLOCK;
    } else {
        return LOADING_DISPLAY_NONE
    }
}

module.exports = {
    checkCustomization, hideBasedOnScopes,
    LOADING_DISPLAY_NONE, LOADING_DISPLAY_BLOCK
};