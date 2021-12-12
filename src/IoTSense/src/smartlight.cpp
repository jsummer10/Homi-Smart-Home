/*
 * Project     : Homi
 * File name   : smartlight.cpp
 * Authors     : Martin Lopez, Diego Moscoso, Jacob Summerville
 * Description : This file contains the code to control the smart light
 */

#include "smartlight.hpp"

/**
 * Constructor for the smart light
 */
SmartLight::SmartLight() {
    brightness = RGB_BRIGHTNESS_DEAULT;
    resetCmd();
}

/**
 * Process serial commands for the smart light
 * @param JSONValue representing the read serial command
 */
void SmartLight::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    while (iter.next()) {
        if (iter.name() == "brightness")
            cmdBrightness = iter.value().toInt();
    }
}

/**
 * Execute the processed serial commands to adjust the 
 * smart light settings
 */
void SmartLight::execute() {
    updateBrightness(cmdBrightness);
    resetCmd();
}

/**
 * Reset the serial command values back to their defaults
 */
void SmartLight::resetCmd() {
    cmdBrightness = INVALID_CMD;
}

/**
 * Set the brightness to a specified value from 0 to 100
 * @param int the new brightness value
 */
void SmartLight::updateBrightness(int val) {
    if (val == INVALID_CMD) {
        RGB.brightness(brightness);
        return;
    }
    brightness = (int)((RGB_BRIGHTNESS_MAX * val) / 100);
    RGB.brightness(brightness);
}