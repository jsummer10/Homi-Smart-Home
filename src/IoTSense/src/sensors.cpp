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
unsigned long lastPublish = 0;

/**
 * Determine when publish should occur
 */
bool shouldPublish() {
    return (unsigned long) Time.now() > lastPublish + PUBLISH_INTERVAL;
}

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
    Particle.subscribe("hook-response/IotSense", myHandler, MY_DEVICES);
    Particle.variable("Temperature", &(sensorData.temp),     DOUBLE);
    Particle.variable("Humidity",    &(sensorData.humidity), DOUBLE);
    Particle.variable("LightSensor", &(sensorData.light),    INT);
    Particle.variable("DoorSensor",  &(sensorData.door),     INT);
    Particle.variable("HomiData",    jsondata); 
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
 * Serial print all of sensorData in JSON
 */
void Sensors::print() {
    // verify data is present prior to printing
    if (isnan(sensorData.humidity) || isnan(sensorData.temp) || isnan(sensorData.light) || isnan(sensorData.door)) {
        return;
    }

    snprintf(jsondata, sizeof(jsondata), "{\"t\":%d,\"temp\":%.1f,\"humidity\":%.1f,\"light\":%d,\"door\":%d}", 
        (int)Time.now(), sensorData.temp, sensorData.humidity, sensorData.light, sensorData.door);

    // convert values to char
    sprintf(sensorChar.temp,     "%.1f", sensorData.temp);
    sprintf(sensorChar.humidity, "%.1f", sensorData.humidity);
    sprintf(sensorChar.light,    "%d",   sensorData.light);
    sprintf(sensorChar.door,     "%d",   sensorData.door);

    // serial prints of json
    Serial.print(jsondata);
    Serial.println("");
}

/**
 * Publish the sensor data to the cloud
 */
void Sensors::publish() {
    if(shouldPublish()) {
        Particle.publish("Temperature", sensorChar.temp,     PRIVATE);
        Particle.publish("Humidity",    sensorChar.humidity, PRIVATE);
        Particle.publish("LightSensor", sensorChar.light,    PRIVATE);
        Particle.publish("DoorSensor",  sensorChar.door,     PRIVATE);
        lastPublish = Time.now();
    }
}