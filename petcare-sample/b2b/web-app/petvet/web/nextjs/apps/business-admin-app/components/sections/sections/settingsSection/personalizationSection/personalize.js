/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const cp = require("./colorPalettePlugin.js");

function changeFavicon(newFaviconUrl) {
    const head = document.head || document.getElementsByTagName("head")[0];
  
    // Remove existing favicon, if any
    const existingFavicons = document.querySelectorAll("link[rel='icon']");
    
    existingFavicons.forEach(favicon => {
        head.removeChild(favicon);
    });
  
    // Create a new link tag for the new favicon
    const newFavicon = document.createElement("link");
    
    newFavicon.type = "image/x-icon";
    newFavicon.rel = "icon";
    newFavicon.href = newFaviconUrl;
  
    // Append the new favicon to the head
    head.appendChild(newFavicon);
}

function updatePetCareLogos(newSrc, newAlt) {
    const petCareLogos = document.querySelectorAll(".pet-care-logo");
  
    petCareLogos.forEach(logo => {
  
        // Change the src to a temporary value to force a reload
        logo.src = "";
        logo.alt = "";
        logo.removeAttribute("srcset");
  
        // Set a timeout to change the src to the new value after a short delay
        setTimeout(() => {
            logo.src = newSrc;
            logo.alt = newAlt;
        }, 100); // Change to suit your needs, 100 milliseconds used here as an example
    });
}

function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function changeColorTheme(newColor) {

    const rsPrimary50 = cp.palette(newColor, 50);
    const rsPrimary100 = cp.palette(newColor, 100);
    const rsPrimary200 = cp.palette(newColor, 200);
    const rsPrimary300 = cp.palette(newColor, 300);
    const rsPrimary400 = cp.palette(newColor, 400);
    const rsPrimary500 = cp.palette(newColor, 500);
    const rsPrimary600 = cp.palette(newColor, 600);
    const rsPrimary700 = cp.palette(newColor, 700);
    const rsPrimary800 = cp.palette(newColor, 800);
    const rsPrimary900 = cp.palette(newColor, 900);

    document.documentElement.style.setProperty("--rs-primary-50",  rsPrimary50);
    document.documentElement.style.setProperty("--rs-primary-100", rsPrimary100);
    document.documentElement.style.setProperty("--rs-primary-200", rsPrimary200);
    document.documentElement.style.setProperty("--rs-primary-300", rsPrimary300);
    document.documentElement.style.setProperty("--rs-primary-400", rsPrimary400);
    document.documentElement.style.setProperty("--rs-primary-500", rsPrimary500);
    document.documentElement.style.setProperty("--rs-primary-600", rsPrimary600);
    document.documentElement.style.setProperty("--rs-primary-700", rsPrimary700);
    document.documentElement.style.setProperty("--rs-primary-800", rsPrimary800);
    document.documentElement.style.setProperty("--rs-primary-900", rsPrimary900);
    document.documentElement.style.setProperty("--rs-text-link", rsPrimary700);
    document.documentElement.style.setProperty("--rs-text-link-hover", rsPrimary800);
    document.documentElement.style.setProperty("--rs-text-link-active", rsPrimary900);
    document.documentElement.style.setProperty("--rs-text-active", rsPrimary700);
    document.documentElement.style.setProperty("--rs-bg-active", rsPrimary500);
    document.documentElement.style.setProperty("--rs-state-hover-bg", rsPrimary50);
    document.documentElement.style.setProperty("--rs-color-focus-ring", hexToRGBA(rsPrimary500, 0.25));
    document.documentElement.style.setProperty("--rs-state-focus-shadow", "0 0 0 3px " + hexToRGBA(rsPrimary500, 0.25));
    document.documentElement.style.setProperty(
        "--rs-state-focus-outline", 
        "3px solid " + hexToRGBA(rsPrimary500, 0.25)
    );
    document.documentElement.style.setProperty("--rs-btn-primary-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-btn-primary-hover-bg", rsPrimary600);
    document.documentElement.style.setProperty("--rs-btn-primary-active-bg", rsPrimary700);
    document.documentElement.style.setProperty("--rs-btn-ghost-border", rsPrimary700);
    document.documentElement.style.setProperty("--rs-btn-ghost-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-btn-ghost-hover-border", rsPrimary800);
    document.documentElement.style.setProperty("--rs-btn-ghost-hover-text", rsPrimary800);
    document.documentElement.style.setProperty("--rs-btn-ghost-active-border", rsPrimary900);
    document.documentElement.style.setProperty("--rs-btn-ghost-active-text", rsPrimary900);
    document.documentElement.style.setProperty("--rs-btn-link-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-btn-link-hover-text", rsPrimary800);
    document.documentElement.style.setProperty("--rs-btn-link-active-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-iconbtn-primary-addont", rsPrimary600);
    document.documentElement.style.setProperty("--rs-iconbtn-primary-activated-addon", rsPrimary700);
    document.documentElement.style.setProperty("--rs-iconbtn-primary-pressed-addon", rsPrimary800);
    document.documentElement.style.setProperty("--rs-progress-bar", rsPrimary500);
    document.documentElement.style.setProperty("--rs-dropdown-item-bg-hover", hexToRGBA(rsPrimary100, 0.5));
    document.documentElement.style.setProperty("--rs-dropdown-item-bg-active", rsPrimary50);
    document.documentElement.style.setProperty("--rs-dropdown-item-text-active", rsPrimary700);
    document.documentElement.style.setProperty("--rs-menuitem-active-bg", hexToRGBA(rsPrimary100, 0.5));
    document.documentElement.style.setProperty("--rs-menuitem-active-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-steps-state-finish", rsPrimary500);
    document.documentElement.style.setProperty("--rs-steps-border-state-finish", rsPrimary500);
    document.documentElement.style.setProperty("--rs-steps-state-process", rsPrimary500);
    document.documentElement.style.setProperty("--rs-steps-icon-state-process", rsPrimary500);
    document.documentElement.style.setProperty("--rs-navs-selected", rsPrimary700);
    document.documentElement.style.setProperty("--rs-navbar-default-selected-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-navbar-inverse-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-navbar-inverse-selected-bg", rsPrimary700);
    document.documentElement.style.setProperty("--rs-navbar-inverse-hover-bg", rsPrimary600);
    document.documentElement.style.setProperty("--rs-navbar-subtle-selected-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-sidenav-default-selected-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-sidenav-inverse-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-sidenav-inverse-selected-bg", rsPrimary700);
    document.documentElement.style.setProperty("--rs-sidenav-inverse-hover-bg", rsPrimary600);
    document.documentElement.style.setProperty("--rs-sidenav-inverse-footer-border", rsPrimary600);
    document.documentElement.style.setProperty("--rs-sidenav-subtle-selected-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-input-focus-border", rsPrimary500);
    document.documentElement.style.setProperty("--rs-listbox-option-hover-bg", hexToRGBA(rsPrimary100, 0.5));
    document.documentElement.style.setProperty("--rs-listbox-option-hover-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-listbox-option-selected-text", rsPrimary700);
    document.documentElement.style.setProperty("--rs-listbox-option-selected-bg", rsPrimary50);
    document.documentElement.style.setProperty("--rs-listbox-option-disabled-selected-text", rsPrimary200);
    document.documentElement.style.setProperty("--rs-checkbox-checked-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-radio-checked-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-radio-tile-checked-color", rsPrimary500);
    document.documentElement.style.setProperty("--rs-radio-tile-checked-disabled-color", rsPrimary100);
    document.documentElement.style.setProperty("--rs-toggle-checked-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-toggle-checked-hover-bg", rsPrimary600);
    document.documentElement.style.setProperty("--rs-toggle-checked-disabled-bg", rsPrimary100);
    document.documentElement.style.setProperty("--rs-slider-thumb-border", rsPrimary500);
    document.documentElement.style.setProperty("--rs-slider-progress", rsPrimary500);
    document.documentElement.style.setProperty("--rs-uploader-dnd-hover-border", rsPrimary500);
    document.documentElement.style.setProperty("--rs-carousel-indicator-active", rsPrimary500);
    document.documentElement.style.setProperty("--rs-list-hover-bg", rsPrimary50);
    document.documentElement.style.setProperty("--rs-list-placeholder-bg", hexToRGBA(rsPrimary50, 0.5));
    document.documentElement.style.setProperty("--rs-list-placeholder-border", rsPrimary500);
    document.documentElement.style.setProperty("--rs-timeline-indicator-active-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-table-sort", rsPrimary500);
    document.documentElement.style.setProperty("--rs-table-resize", rsPrimary500);
    document.documentElement.style.setProperty("--rs-picker-value", rsPrimary700);
    document.documentElement.style.setProperty("--rs-picker-count-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-calendar-today-bg", rsPrimary500);
    document.documentElement.style.setProperty("--rs-calendar-range-bg", hexToRGBA(rsPrimary50, 0.5));
    document.documentElement.style.setProperty("--rs-calendar-cell-selected-hover-bg", rsPrimary700);
}

export function personalize(personalization) {
    changeColorTheme(personalization.primaryColor);
    changeFavicon(personalization.faviconUrl);
    updatePetCareLogos(personalization.logoUrl, personalization.logoAltText);
}

export default personalize;
