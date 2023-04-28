#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>
#include "HCS_Font_Data.h"

const uint8_t cs1=10;//CPI CS for matrix 1
const uint8_t cs2=9;//CPI CS for matrix 2
const MD_MAX72XX::moduleType_t hardwareType = MD_MAX72XX::GENERIC_HW;//For generic single modules
const uint8_t numZones = 2;
const uint8_t zoneSize = 2;
const uint8_t maxDevices = (numZones * zoneSize);
const bool invertLowerZone = (hardwareType == MD_MAX72XX::GENERIC_HW || hardwareType == MD_MAX72XX::PAROLA_HW);

//MD_Parola instances to communicate with matrixes through SPI
MD_Parola leftDisplay = MD_Parola(hardwareType, cs1, maxDevices);
MD_Parola rightDisplay = MD_Parola(hardwareType, cs2, maxDevices);


//Scores, period and time to display
uint8_t leftScore=0;
uint8_t rightScore=45;

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
  //Right double height
  rightDisplay.begin(numZones);//Initialise the LED display
  rightDisplay.setCharSpacing(0); // spacing is built into the font definition
  rightDisplay.setInvert(false);
  rightDisplay.setIntensity(1);
  rightDisplay.setZone(0, 0, zoneSize-1);//Set first zone(0), in a 4x4 it is modules 0 and 1
  rightDisplay.setZone(1, zoneSize, maxDevices-1);//Set second zone(1), in a 4x4 it is modules 1 and 3
  rightDisplay.setFont(0, Width8NumsLower);
  rightDisplay.setFont(1, Width8NumsUpper);

  //Invert if hardware is generic (otherwise they dont fit together because of MAX7219 IC)
  if (invertLowerZone)
  {
    leftDisplay.setZoneEffect(0, true, PA_FLIP_UD);
    leftDisplay.setZoneEffect(0, true, PA_FLIP_LR);
    rightDisplay.setZoneEffect(0, true, PA_FLIP_UD);
    rightDisplay.setZoneEffect(0, true, PA_FLIP_LR);
  }
  Serial.println("setup done");
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("loop start");
  leftDisplay.displayAnimate();//Always run the display animation
  rightDisplay.displayAnimate();//Always run the display animation
  scoresDisplay();
  Serial.println("loop end");
  delay(5000);//Wait 10 seconds to give time for users to view demo
}

void scoresDisplay(){
  //Ints cannot be printed directly, must use char array
  char leftScoreString[3]="0";
  itoa(leftScore, leftScoreString, 10);
  leftDisplay.displayZoneText(0, leftScoreString, PA_CENTER, leftDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
  leftDisplay.displayZoneText(1, leftScoreString, PA_CENTER, leftDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
  char rightScoreString[3]="0";
  itoa(rightScore, rightScoreString, 10);
  rightDisplay.displayZoneText(0, rightScoreString, PA_CENTER, rightDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
  rightDisplay.displayZoneText(1, rightScoreString, PA_CENTER, rightDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
  leftScore = leftScore == 45 ? 0 : leftScore+=1;
  rightScore = rightScore == 0 ? 45 : rightScore-=1;
}