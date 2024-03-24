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

const tinycolor = require("tinycolor2");

// Primary color number.
var PRIMARY_INDEX = 5;
var HUE_MAX = 360;
var SATURATION_MIN = 5;
var SATURATION_MAX = 100;
var BRIGHTNESS_MIN = 20;
var BRIGHTNESS_MAX = 100;

var COLOR_NUMBER_SET = [ "50", "100", "200", "300", "400", "500", "600", "700", "800", "900" ];

function calculateHue(originalHue, index) {
    originalHue = Math.round(originalHue) || 360;
    // Dark color increase , light color reduction
    const step = index - PRIMARY_INDEX;
    const gap = 1;
    const hue = originalHue + step * gap;

    // The value of hue is [0,360).
    // If it is greater than 360, the absolute value of the difference is taken.
    return hue >= HUE_MAX ? Math.abs(hue - HUE_MAX) : hue;
}

function calculateSaturation(originalSaturation, index) {
    originalSaturation = Math.round(originalSaturation * 100);
    //  Dark color increase , light color reduction
    const step = index - PRIMARY_INDEX;
    const gap = Math.round(
        (step > 0 && (100 - originalSaturation) / 4) ||
          (originalSaturation > SATURATION_MIN && (originalSaturation - 5) / 5) ||
          1
    );
    const saturation = originalSaturation + step * gap;
    
    return (
        // The value range of saturation is [5,100]
        ((saturation < SATURATION_MIN && SATURATION_MIN) ||
          (saturation > SATURATION_MAX && SATURATION_MAX) ||
          saturation) / 100
    );
}

function calculateBrightnessAdjustValue(brightness, step) {
    if (step < 0) {
        if (brightness > 40) {
            // BasicGap rounded up to avoid a situation of 0.
            let basicGap = Math.ceil((brightness - 40) / 4 / 4);
            const levels = Math.abs(step);
            // Less than 40, the brightness is smaller.
            // n is a multiple of the reduction base (increased by the arithmetic progression)
            const n = ((1 + levels) * levels) / 2;
            
            return -1 * basicGap * n;
        }
        
        return Math.round(step * ((brightness - 20) / 4));
    }
    
    return Math.round(step * ((100 - brightness) / 5));
}

function calculateBrightness(originalBrightness, index) {
    originalBrightness = Math.round(originalBrightness * 100);
    // Light color reduction , dark color increase.
    const step = PRIMARY_INDEX - index;
    // When originalBrightness is less than 20, no adjustment.
    
    if (step < 0 && originalBrightness < BRIGHTNESS_MIN) {
        return originalBrightness / 100;
    }
    const adjustValue = calculateBrightnessAdjustValue(originalBrightness, step);
    const brightness = originalBrightness + adjustValue;
    
    return (
        // The range of brightness is [20,100]
        ((brightness < BRIGHTNESS_MIN && BRIGHTNESS_MIN) ||
          (brightness > BRIGHTNESS_MAX && BRIGHTNESS_MAX) ||
          brightness) / 100
    );
}

export function palette(color, colorNumber) {
    const hexColour = tinycolor(color);
    const { r, g, b, a } = { r: hexColour["_r"], g: hexColour["_g"], b: hexColour["_b"], a: hexColour["_a"] };

    // Assuming color is an object like: { r: 255, g: 0, b: 0, a: 1 }
    const hsv = tinycolor({ r, g, b, a }).toHsv(); // You might need to handle this conversion

    const index = COLOR_NUMBER_SET.indexOf(String(colorNumber));
    
    if (index === -1 || index === PRIMARY_INDEX) {
      
        return color; // Return the original color if not found in the set or it's the primary index
    }

    const newHue = calculateHue(hsv.h, index);
    const newSaturation = calculateSaturation(hsv.s, index);
    const newBrightness = calculateBrightness(hsv.v, index);

    // Assuming tinycolor is available for color manipulation
    const modifiedColor = "#" + tinycolor({ h: newHue, s: newSaturation, v: newBrightness }).toHex();

    return modifiedColor;
}
