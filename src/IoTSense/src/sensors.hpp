/*
 * Project     : Homi
 * File name   : sensors.hpp
 * Authors     : Martin Lopez, Diego Moscoso, Jacob Summerville
 * Description : This file contains the sensor globals
 */

#ifndef _SENSORS_H
#define _SENSORS_H

#include "common.hpp"

// contains the raw sensor data
struct SensorData {
    int     light;
    int     door;
    double  temp;
    double  humidity;
};

// contains the sensor data as chars
struct SensorChar {
    char light[15];
    char door[15];
    char temp[15];
    char humidity[15];
};

class Sensors {
public:
    Sensors() {}
    void init();
    void getData();
    void print();
    void publish();
private:
    SensorData sensorData;
    SensorChar sensorChar; 
};

#endif /* _SENSORS_H */