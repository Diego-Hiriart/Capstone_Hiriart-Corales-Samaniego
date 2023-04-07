#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

const int ic4511A=2;
const int ic4511B=3;
const int ic4511C=4;
const int ic4511D=5;
const int autoPointsLED=6;
const int leftYellow=A0;
const int leftRed=A1;
const int rightYellow=A2;
const int rightRed=A3;
const int leftPriority=A4;
const int rightPriority=A5;
const int cs1=10;//CPI CS for matrix 1
const int cs2=9;//CS for matrix 2
const int cs3=8;//CS for matrix 3
const int maxGenericDevices=2;//Number of MAX7219 ICs for generic displays
const int maxFC16Devices=4;//Number of MAX7219 ICs in an FC16 module
#define FC16_HARDWARE MD_MAX72XX::FC16_HW//Generic hardware type for score display
#define GENERIC_HARDWARE MD_MAX72XX::GENERIC_HW//FC16 hardware for time

//MD_Parola instances to communicate with matrixes through SPI
MD_Parola timerDisplay = MD_Parola(FC16_HARDWARE, cs1, maxFC16Devices);
MD_Parola leftDisplay = MD_Parola(GENERIC_HARDWARE, cs2, maxGenericDevices);
MD_Parola rightDisplay = MD_Parola(GENERIC_HARDWARE, cs3, maxGenericDevices);

//Scores, period and time to display
short leftScore=0;
short rightScore=15;
short period=1;
unsigned long elapsedTime=0;

void setup() {
  // put your setup code here, to run once:
  //Set pinmodes
  //HC45 binary data pins
  pinMode(ic4511A, OUTPUT);
  pinMode(ic4511B, OUTPUT);
  pinMode(ic4511C, OUTPUT);
  pinMode(ic4511D, OUTPUT);
  //LED pins
  pinMode(autoPointsLED, OUTPUT);
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
  digitalWrite(leftYellow, LOW);
  digitalWrite(leftRed, LOW);
  digitalWrite(rightYellow, LOW);
  digitalWrite(rightRed, LOW);
  digitalWrite(leftPriority, LOW);
  digitalWrite(rightPriority, LOW);
  //Initialice MAX7219 displays
  timerDisplay.begin();//Initialice display
  timerDisplay.setIntensity(15);//Set display intensity
  timerDisplay.displayClear(0);//Clear the display
  leftDisplay.begin();//Initialice display
  leftDisplay.setIntensity(10);//Set display intensity
  leftDisplay.displayClear(0);//Clear the display
  rightDisplay.begin();//Initialice display
  rightDisplay.setIntensity(5);//Set display intensity
  rightDisplay.displayClear(0);//Clear the display
  timerDisplay.setTextAlignment(PA_CENTER);
  leftDisplay.setTextAlignment(PA_CENTER);
  rightDisplay.setTextAlignment(PA_CENTER);
}

void loop() {
  // put your main code here, to run repeatedly:
  elapsedTime=millis();
  scoresDisplay();
  periodTimeDisplay();
  periodDisplay();
  cardsDisplay();
  priorityDisplay();
  autoPointsDisplay();
  delay(10000);//Wait 10 seconds to give time for users to view demo
}

void scoresDisplay(){
  //Ints can be printed directly
  leftDisplay.print(leftScore);
  rightDisplay.print(rightScore);
  leftScore = leftScore == 15 ? 0 : leftScore+1;
  rightScore = rightScore == 0 ? 15 : rightScore-1;
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
  int ledStatus = binaryPeriod.charAt(3)=='1'?1:0;
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
  int randOnOff = random(0,2);
  digitalWrite(leftYellow, randOnOff ? HIGH : LOW);
  randOnOff = random(0,2);
  digitalWrite(leftRed, randOnOff ? HIGH : LOW);
  randOnOff = random(0,2);
  digitalWrite(rightYellow, randOnOff ? HIGH : LOW);
  randOnOff = random(0,2);
  digitalWrite(rightRed, randOnOff ? HIGH : LOW);
}

void priorityDisplay(){
  int randOnOff = random(0,2);
  digitalWrite(leftPriority, randOnOff ? HIGH : LOW);
  randOnOff = random(0,2);
  digitalWrite(rightPriority, randOnOff ? HIGH : LOW);
}

void autoPointsDisplay(){
  int randOnOff = random(0,2);
  digitalWrite(autoPointsLED, randOnOff ? HIGH : LOW);
}