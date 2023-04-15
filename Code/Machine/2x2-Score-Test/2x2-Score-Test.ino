#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>
#include "HCS_Font_Data.h"

const int cs1=10;//CPI CS for matrix 1
const MD_MAX72XX::moduleType_t HARDWARE_TYPE = MD_MAX72XX::GENERIC_HW;//For generic single modules
const int NUM_ZONES = 2;
const int ZONE_SIZE = 2;
const int MAX_DEVICES = (NUM_ZONES * ZONE_SIZE);
const bool invertLowerZone = (HARDWARE_TYPE == MD_MAX72XX::GENERIC_HW || HARDWARE_TYPE == MD_MAX72XX::PAROLA_HW);

int score = 0;//Increase every x seconds

// HARDWARE SPI
MD_Parola doubleScoreDisplay = MD_Parola(HARDWARE_TYPE, cs1, MAX_DEVICES);

void setup() {
  // put your setup code here, to run once:
  doubleScoreDisplay.begin(NUM_ZONES);//Initialise the LED display
  doubleScoreDisplay.setCharSpacing(0); // spacing is built into the font definition
  doubleScoreDisplay.setInvert(false);
  doubleScoreDisplay.setIntensity(2);

  doubleScoreDisplay.setZone(0, 0, ZONE_SIZE-1);//Set first zone(0), in a 4x4 it is modules 0 and 1
  doubleScoreDisplay.setZone(1, ZONE_SIZE, MAX_DEVICES-1);//Set second zone(1), in a 4x4 it is modules 1 and 3
  doubleScoreDisplay.setFont(0, Width8NumsLower);
  doubleScoreDisplay.setFont(1, Width8NumsUpper);

  //Invert if hardware is generic (otherwise they dont fit together because of MAX7219 IC)
  if (invertLowerZone)
  {
    doubleScoreDisplay.setZoneEffect(0, true, PA_FLIP_UD);
    doubleScoreDisplay.setZoneEffect(0, true, PA_FLIP_LR);
  }
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  doubleScoreDisplay.displayAnimate();//Always run the display animation
  scoreControl();
  delay(2000);
  
}

void scoreControl(){
  Serial.println(score);
  char scoreString[3]="0";
  itoa(score, scoreString, 10);
  doubleScoreDisplay.displayZoneText(0, scoreString, PA_CENTER, doubleScoreDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
  doubleScoreDisplay.displayZoneText(1, scoreString, PA_CENTER, doubleScoreDisplay.getSpeed(), 0, PA_PRINT, PA_NO_EFFECT);
  score = score == 45 ? 0 : score+=1;
}
