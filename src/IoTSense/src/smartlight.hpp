/*
 * Project     : Homi
 * File name   : smartlight.hpp
 * Authors     : Martin Lopez, Diego Moscoso, Jacob Summerville
 * Description : This file contains the SmartLight class
 */

#ifndef _SMARTLIGHT_H
#define _SMARTLIGHT_H

#include "common.hpp"

class SmartLight {
public:
    SmartLight();
    void cmdProcessing(JSONValue cmdJson);
    void execute();
private:
    void resetCmd();
    void updateBrightness(int val);
    int brightness;
    int cmdBrightness;
};

#endif /* _SMARTLIGHT_H */