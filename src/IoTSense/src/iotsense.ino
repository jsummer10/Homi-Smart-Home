/*
 * Project     : Homi
 * File name   : iotsense.ino
 * Authors     : Martin Lopez, Diego Moscoso, Jacob Summerville
 * Description : Main file for Particle communication
 */

#include "common.hpp"
#include "sensors.hpp"
#include "smartlight.hpp"

SYSTEM_THREAD(ENABLED);

SmartLight smartLight;
Sensors sensors;
int counter;

void serialCmdProcessing() {
    if (Serial.available() <= 0) return;
    String cmdStr = "";

    while (Serial.available()) {
        char c = Serial.read();
        cmdStr += String(c);
    }

    JSONValue cmdJson = JSONValue::parseCopy(cmdStr.c_str());
    JSONObjectIterator iter(cmdJson);

    while (iter.next()) {
        if (iter.name() == "smartlight") {
            smartLight.cmdProcessing(iter.value());
        }
    }
}

/**
 * Main Particle setup function
 */
void setup() {
    Serial.begin(9600);
    pinMode(LED, OUTPUT);
    RGB.control(true);
    RGB.color(255, 255, 255);
    sensors.init();
    counter = 0;
}

/**
 * Main Particle loop function
 */
void loop() {
    serialCmdProcessing();
    smartLight.execute();

    if (counter % (SERIAL_COMM_FREQUENCY * LOOP_FREQUENCY) == 0) {
        counter = 0;
        sensors.getData();
        sensors.print();
        sensors.publish();
    }

    counter++;
    delay(100);
}