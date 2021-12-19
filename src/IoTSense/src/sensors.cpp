/*
 * Project     : Homi
 * File name   : sensors.cpp
 * Authors     : Martin Lopez, Diego Moscoso, Jacob Summerville
 * Description : This file contains the sensors functions
 */

#include "common.hpp" 
#include "sensors.hpp" 

// Object for the Digital Humidity & Temperature sensor
DHT dht(DHTPIN, DHTTYPE);

char jsondata[256];
String jsonDataStr;

/**
 * Handler for Particle subscribe
 * @param char* subscribe event
 * @param char* subscribe data
 */
void myHandler(const char *event, const char *data){
    String output = String::format("Response: %s", data);
    Serial.println(output); 

}

/**
 * Initialize settings for the DHT and publishing
 */
void Sensors::init() {
    dht.begin();
    Particle.subscribe("hook-response/homidata", myHandler);
    jsonDataStr = "";
}

/**
 * Get data from the DHT and the two photoresistors
 */
void Sensors::getData() {
    // temperature and humidity from the DHT11
    sensorData.humidity = dht.getHumidity();
    sensorData.temp = dht.getTempFarenheit();

    // photoresistor values
    sensorData.light = analogRead(LIGHT_SENSOR);
    sensorData.door  = analogRead(DOOR_SENSOR);
}

/**
 * Save data into a formatted JSON string
 */
void Sensors::saveString() {
    // verify data is present prior to printing
    if (isnan(sensorData.humidity) || isnan(sensorData.temp) || 
        isnan(sensorData.light) || isnan(sensorData.door)) {
        return;
    }

    jsonDataStr = String::format("{\"t\":%d,\"temp\":%.1f,\"humidity\":%.1f,\"light\":%d,\"door\":%d}", 
        (int)Time.now(), sensorData.temp, sensorData.humidity, sensorData.light, sensorData.door);
}

/**
 * Serial print all of sensorData in JSON
 */
void Sensors::serialPrint() {
    Serial.print(jsonDataStr);
    Serial.println("");
}

/**
 * Publish the sensor data to the cloud
 */
void Sensors::publish() {
    Particle.publish("homidata", jsonDataStr, PRIVATE);
}