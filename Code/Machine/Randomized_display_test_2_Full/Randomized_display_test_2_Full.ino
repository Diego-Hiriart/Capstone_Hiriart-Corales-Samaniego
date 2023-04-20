#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>
#include "HCS_Font_Data.h"

const uint8_t ic4511A=2;
const uint8_t ic4511B=3;
const uint8_t ic4511C=4;
const uint8_t ic4511D=5;
const uint8_t autoPointsLED=6;
const uint8_t blockedLED=7;
const uint8_t leftYellow=A0;
const uint8_t leftRed=A1;
const uint8_t rightYellow=A2;
const uint8_t rightRed=A3;
const uint8_t leftPriority=A4;
const uint8_t rightPriority=A5;
const uint8_t cs1=10;//CPI CS for matrix 1
const uint8_t cs2=9;//CS for matrix 2
const uint8_t cs3=8;//CS for matrix 3
const uint8_t maxFC16Devices=4;//Number of MAX7219 ICs in an FC16 module
const uint8_t numZones = 2;
const uint8_t zoneSize = 2;
const uint8_t maxDevices = (numZones * zoneSize);
const MD_MAX72XX::moduleType_t timerHardware = MD_MAX72XX::FC16_HW;//Generic hardware type for score display
const MD_MAX72XX::moduleType_t scoreHardware = MD_MAX72XX::GENERIC_HW;//FC16 hardware for time
const bool invertLowerZone = (scoreHardware == MD_MAX72XX::GENERIC_HW || scoreHardware == MD_MAX72XX::PAROLA_HW);

//MD_Parola instances to communicate with matrixes through SPI
MD_Parola timerDisplay = MD_Parola(timerHardware, cs1, maxFC16Devices);
MD_Parola leftDisplay = MD_Parola(scoreHardware, cs2, maxDevices);
MD_Parola rightDisplay = MD_Parola(scoreHardware, cs3, maxDevices);

//Scores, period and time to display
uint8_t leftScore=0;
uint8_t rightScore=45;
uint8_t period=1;
unsigned long elapsedTime=0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("setup start");
  //Set pinmodes
  //HC45 binary data pins
  pinMode(ic4511A, OUTPUT);
  pinMode(ic4511B, OUTPUT);
  pinMode(ic4511C, OUTPUT);
  pinMode(ic4511D, OUTPUT);
  //LED pins
  pinMode(autoPointsLED, OUTPUT);
  pinMode(blockedLED, OUTPUT);
  pinMode(leftYellow, OUTPUT);
  pinMode(leftRed, OUTPUT);
  pinMode(rightYellow, OUTPUT);
  pinMode(rightRed, OUTPUT);
  pinMode(leftPriority, OUTPUT);
  pinMode(rightPriority, OUTPUT);
  //Set digital write values to LOW to begin
  //4511 pins to make a 0
  digitalWrite(ic4511A, LOW);
  digitalWrite(ic4511B, LOW);
  digitalWrite(ic4511C, LOW);
  digitalWrite(ic4511D, LOW);
  //LEDs off
  digitalWrite(autoPointsLED, LOW);
  digitalWrite(blockedLED, LOW);
  digitalWrite(leftYellow, LOW);
  digitalWrite(leftRed, LOW);
  digitalWrite(rightYellow, LOW);
  digitalWrite(rightRed, LOW);
  digitalWrite(leftPriority, LOW);
  digitalWrite(rightPriority, LOW);
  //Initialice MAX7219 displays
  //Timer display
  timerDisplay.begin();//Initialice display
  timerDisplay.setIntensity(15);//Set display intensity
  timerDisplay.displayClear(0);//Clear the display
  timerDisplay.setTextAlignment(PA_CENTER);
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
  Serial.println("loop start");
  // put your main code here, to run repeatedly:
  elapsedTime=millis();
  leftDisplay.displayAnimate();//Always run the display animation
  rightDisplay.displayAnimate();//Always run the display animation
  scoresDisplay();
  periodTimeDisplay();
  periodDisplay();
  cardsDisplay();
  priorityDisplay();
  autoPointsDisplay();
  blockedDisplay();
  delay(5000);//Wait 5 seconds to give time for users to view demo
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

void periodTimeDisplay(){
  int timerMinutes = elapsedTime/60000;
  int timerSeconds = elapsedTime%60000/1000;
  String displayTime = String(timerMinutes)+":"+String(timerSeconds);
  timerDisplay.print(displayTime);
}

void periodDisplay(){
  //Turn pwriod number into binary
  String binaryPeriod = String(period, BIN);
  //Add missing zeroes to have a 4 bit binary
  while(binaryPeriod.length()<4){
    binaryPeriod="0"+binaryPeriod;
  }
  //Check each bit and write to the 4511 IC
  uint8_t ledStatus = binaryPeriod.charAt(3)=='1'?1:0;
  digitalWrite(ic4511A, ledStatus);
  ledStatus = binaryPeriod.charAt(2)=='1'?1:0;
  digitalWrite(ic4511B, ledStatus);
  ledStatus = binaryPeriod.charAt(1)=='1'?1:0;
  digitalWrite(ic4511C, ledStatus);
  ledStatus = binaryPeriod.charAt(0)=='1'?1:0;
  digitalWrite(ic4511D, ledStatus);
  period = period == 9 ? 1 : period+1;
}

void cardsDisplay(){
  uint8_t randOnOff = random(0,2);
  digitalWrite(leftYellow, randOnOff ? HIGH : LOW);
  randOnOff = random(0,2);
  digitalWrite(leftRed, randOnOff ? HIGH : LOW);
  randOnOff = random(0,2);
  digitalWrite(rightYellow, randOnOff ? HIGH : LOW);
  randOnOff = random(0,2);
  digitalWrite(rightRed, randOnOff ? HIGH : LOW);
}

void priorityDisplay(){
  uint8_t randOnOff = random(0,2);
  digitalWrite(leftPriority, randOnOff ? HIGH : LOW);
  randOnOff = random(0,2);
  digitalWrite(rightPriority, randOnOff ? HIGH : LOW);
}

void autoPointsDisplay(){
  uint8_t randOnOff = random(0,2);
  digitalWrite(autoPointsLED, randOnOff ? HIGH : LOW);
}

void blockedDisplay(){
  uint8_t randOnOff = random(0,2);
  digitalWrite(blockedLED, randOnOff ? HIGH : LOW);
}