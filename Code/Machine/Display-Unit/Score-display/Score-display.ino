#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>
#include "HCS_Font_Data.h"

const uint8_t csPin = 10;                                              //CPI CS for matrix 1
const MD_MAX72XX::moduleType_t hardwareType = MD_MAX72XX::GENERIC_HW;  //For generic single modules
const uint8_t numZones = 2;
const uint8_t zoneSize = 2;
const uint8_t maxDevices = (numZones * zoneSize);
const bool invertLowerZone = (hardwareType == MD_MAX72XX::GENERIC_HW || hardwareType == MD_MAX72XX::PAROLA_HW);
const String messageStartDelimiter = "s";
const String messageEndDelimiter = "e\n";
const uint8_t messageLength = 7;

//MD_Parola instances to communicate with matrixes through SPI
MD_Parola scoreDisplay = MD_Parola(hardwareType, csPin, maxDevices);

//Scores, period and time to display
uint8_t score = 0;

void setup() {
  //Initialice MAX7219 displays
  Serial.begin(9600);
  //Left double height
  scoreDisplay.begin(numZones);    //Initialise the LED display
  scoreDisplay.setCharSpacing(0);  // spacing is built into the font definition
  scoreDisplay.setInvert(false);
  scoreDisplay.setIntensity(5);
  scoreDisplay.setZone(0, 0, zoneSize - 1);           //Set first zone(0), in a 4x4 it is modules 0 and 1
  scoreDisplay.setZone(1, zoneSize, maxDevices - 1);  //Set second zone(1), in a 4x4 it is modules 1 and 3
  scoreDisplay.setFont(0, Width8NumsLower);
  scoreDisplay.setFont(1, Width8NumsUpper);

  //Invert if hardware is generic (otherwise they dont fit together because of MAX7219 IC)
  if (invertLowerZone) {
    scoreDisplay.setZoneEffect(0, true, PA_FLIP_UD);
    scoreDisplay.setZoneEffect(0, true, PA_FLIP_LR);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  scoreDisplay.displayAnimate();  //Always run the display animation
  serialReceive();
  displayScore();
}

void serialReceive() {
  //Read string like start;left;right;end\n e.g. s;06;e\n
  if (Serial.available() >= messageLength) {
    String esp32Message = "";
    //Read until the delimiter is found or the message is the same length as the desired message
    /*If malformed messages are received, they will be read until conditions are met, but are not 
    * processed, if a malformed message is received the buffer is flushed to clear the remaining garbage*/
    while (!esp32Message.endsWith(messageEndDelimiter) && esp32Message.length() <= messageLength) {
      esp32Message += (char)Serial.read();
    }
    if (esp32Message.startsWith(messageStartDelimiter) && esp32Message.endsWith(messageEndDelimiter)
        && esp32Message.length() == messageLength) {
      String scoreValue = esp32Message.substring(2, 4);
      score = scoreValue.toInt();
    } else {
      //Clear malformed messages
      Serial.flush();
    }
  }
}

void displayScore() {
  //Ints cannot be printed directly, must use char array
  char scoreString[3] = "0";
  itoa(score, scoreString, 10);
  scoreDisplay.displayZoneText(0, scoreString, PA_CENTER, scoreDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
  scoreDisplay.displayZoneText(1, scoreString, PA_CENTER, scoreDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
}