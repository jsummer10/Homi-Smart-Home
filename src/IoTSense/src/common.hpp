/*
 * Project     : Homi
 * File name   : common.hpp
 * Authors     : Martin Lopez, Diego Moscoso, Jacob Summerville
 * Description : This file contains all relevant types and constants
 */

#ifndef _COMMON_H
#define _COMMON_H

#include "Adafruit_DHT.h"
#include "Particle.h"

// timing
#define PERIOD                100
#define LOOP_FREQUENCY        (1000/PERIOD)
#define SERIAL_COMM_FREQUENCY 1     // 1 Hz
#define PUBLISH_FREQUENCY     1     // 1 Hz

// LED
#define LED D7

// RGB led
#define RGB_BRIGHTNESS_MAX      255
#define RGB_BRIGHTNESS_DEAULT   0

// photoresistor
#define LIGHT_SENSOR      A0
#define DOOR_SENSOR       A1
#define LIGHT_SENSOR_MIN  500
#define LIGHT_SENSOR_MAX  2500

// time
#define MINUTES 60
#define SECONDS 1000

// DHT11
#define DHTTYPE DHT11
#define DHTPIN  2

// publish
#define PUBLISH_INTERVAL 15 * MINUTES

// command
#define INVALID_CMD -99999

#endif /* _COMMON_H */