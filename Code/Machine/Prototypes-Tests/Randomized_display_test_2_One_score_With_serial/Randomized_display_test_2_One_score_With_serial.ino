#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>
#include "HCS_Font_Data.h"

const uint8_t cs1=10;//CPI CS for matrix 1
const MD_MAX72XX::moduleType_t hardwareType = MD_MAX72XX::GENERIC_HW;//For generic single modules
const uint8_t numZones = 2;
const uint8_t zoneSize = 2;
const uint8_t maxDevices = (numZones * zoneSize);
const bool invertLowerZone = (hardwareType == MD_MAX72XX::GENERIC_HW || hardwareType == MD_MAX72XX::PAROLA_HW);
const String messageStartDelimiter = "s";
const String messageEndDelimiter = "e\n";
const uint8_t messageLength = 7;

//MD_Parola instances to communicate with matrixes through SPI
MD_Parola leftDisplay = MD_Parola(hardwareType, cs1, maxDevices);

//Scores, period and time to display
uint8_t score=0;

void setup() {
  //Initialice MAX7219 displays
  Serial.begin(9600);
  Serial.println("setup start");
  //Left double height
  leftDisplay.begin(numZones);//Initialise the LED display
  leftDisplay.setCharSpacing(0); // spacing is built into the font definition
  leftDisplay.setInvert(false);
  leftDisplay.setIntensity(1);
  leftDisplay.setZone(0, 0, zoneSize-1);//Set first zone(0), in a 4x4 it is modules 0 and 1
  leftDisplay.setZone(1, zoneSize, maxDevices-1);//Set second zone(1), in a 4x4 it is modules 1 and 3
  leftDisplay.setFont(0, Width8NumsLower);
  leftDisplay.setFont(1, Width8NumsUpper);

  //Invert if hardware is generic (otherwise they dont fit together because of MAX7219 IC)
  if (invertLowerZone)
  {
    leftDisplay.setZoneEffect(0, true, PA_FLIP_UD);
    leftDisplay.setZoneEffect(0, true, PA_FLIP_LR);
  }
  Serial.println("setup done");
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("loop start");
  leftDisplay.displayAnimate();//Always run the display animation
  serialReceive();
  scoresDisplay();
  Serial.println("loop end");
  delay(1000);
}

void serialReceive(){
  //Read string like start;left;right;end e.g. s;0;1;e
  if(Serial.available() >= messageLength){
    String esp32Message = "";
    while(!esp32Message.endsWith(messageEndDelimiter)){
      esp32Message += (char)Serial.read();
    }
    Serial.write(esp32Message.c_str());
    if(esp32Message.startsWith(messageStartDelimiter) && esp32Message.endsWith(messageEndDelimiter) 
    && esp32Message.length() == messageLength){
      String scoreString = esp32Message.substring(2, 4);
      score = scoreString.toInt();
      String readValues = "left: "+String(score)+"\n";
      Serial.write(readValues.c_str());
    }
  }
}

void scoresDisplay(){
  //Ints cannot be printed directly, must use char array
  char scoreString[3]="0";
  itoa(score, scoreString, 10);
  leftDisplay.displayZoneText(0, scoreString, PA_CENTER, leftDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
  leftDisplay.displayZoneText(1, scoreString, PA_CENTER, leftDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
}