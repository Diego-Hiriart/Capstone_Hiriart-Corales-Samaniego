#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

const uint8_t ic4511APin = 2;
const uint8_t ic4511BPin = 3;
const uint8_t ic4511CPin = 4;
const uint8_t ic4511DPin = 5;
const uint8_t autoPointsLEDPin = 6;
const uint8_t blockedLEDPin = 7;
const uint8_t leftYellowPin = 8;
const uint8_t leftRedPin = 9;
const uint8_t leftPriorityPin = A0;
const uint8_t rightYellowPin = A1;
const uint8_t rightRedPin = A2;
const uint8_t rightPriorityPin = A3;
const uint8_t buzzerPin = A4;
const uint8_t csPin = 10;          //CPI CS for matrix 1
const uint8_t maxFC16Devices = 4;  //Number of MAX7219 ICs in an FC16 module
const String messageStartDelimiter = "s";
const String messageEndDelimiter = "e\n";
const uint8_t messageLength = 37;  //36 chars and \n

const MD_MAX72XX::moduleType_t FC16Hardware = MD_MAX72XX::FC16_HW;  //Generic hardware type for score display

//MD_Parola instances to communicate with matrixes through SPI
MD_Parola timerDisplay = MD_Parola(FC16Hardware, csPin, maxFC16Devices);

//Variables for read values
uint32_t periodTime = 0;
uint8_t paused = 0;
uint8_t period = 1;
uint8_t yelCardL = 0;
uint8_t redCardL = 0;
uint8_t yelCardR = 0;
uint8_t redCardR = 0;
uint8_t leftPriority = 0;
uint8_t rightPriority = 0;
uint8_t automaticPoints = 0;
uint8_t blockedMachine = 0;
uint8_t buzzerPattern = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  //Set pinmodes
  //HC45 binary data pins
  pinMode(ic4511APin, OUTPUT);
  pinMode(ic4511BPin, OUTPUT);
  pinMode(ic4511CPin, OUTPUT);
  pinMode(ic4511DPin, OUTPUT);
  //LED pins
  pinMode(autoPointsLEDPin, OUTPUT);
  pinMode(blockedLEDPin, OUTPUT);
  pinMode(leftYellowPin, OUTPUT);
  pinMode(leftRedPin, OUTPUT);
  pinMode(rightYellowPin, OUTPUT);
  pinMode(rightRedPin, OUTPUT);
  pinMode(leftPriorityPin, OUTPUT);
  pinMode(rightPriorityPin, OUTPUT);
  //Buzzer pin
  pinMode(buzzerPin, OUTPUT);
  //Set digital write values to LOW to begin
  //4511 pins to make a 0
  digitalWrite(ic4511APin, LOW);
  digitalWrite(ic4511BPin, LOW);
  digitalWrite(ic4511CPin, LOW);
  digitalWrite(ic4511DPin, LOW);
  //LEDs off
  digitalWrite(autoPointsLEDPin, LOW);
  digitalWrite(blockedLEDPin, LOW);
  digitalWrite(leftYellowPin, LOW);
  digitalWrite(leftRedPin, LOW);
  digitalWrite(rightYellowPin, LOW);
  digitalWrite(rightRedPin, LOW);
  digitalWrite(leftPriorityPin, LOW);
  digitalWrite(rightPriorityPin, LOW);
  //Buzzer off
  digitalWrite(buzzerPin, LOW);
  //Initialice MAX7219 display
  timerDisplay.begin();           //Initialice display
  timerDisplay.setIntensity(12);  //Set display intensity
  timerDisplay.displayClear(0);   //Clear the display
  timerDisplay.setTextAlignment(PA_CENTER);
  timerDisplay.print("");  //Display 0 time
}

void loop() {
  // put your main code here, to run repeatedly:
  serialReceive();
  periodTimeDisplay();
  periodDisplay();
  cardsDisplay();
  priorityDisplay();
  autoPointsDisplay();
  blockedDisplay();
  buzzerAlert();
}

void serialReceive() {
  /*Read string like:
  * start;time(in ms);paused;period;leftYellow;leftRed;rightYellow;rightRed;leftPriority;rightPriority;autoPoints;machineBlocked;buzzerPattern;end\n
  * e.g. (1.5 used minutes): s;0000090000;0;2;1;1;1;0;0;0;1;0;3;e\n
  */
  if (Serial.available() >= messageLength) {
    String esp32Message = "";
    while (!esp32Message.endsWith(messageEndDelimiter)) {
      esp32Message += (char)Serial.read();
    }
    if (esp32Message.startsWith(messageStartDelimiter) && esp32Message.endsWith(messageEndDelimiter)
        && esp32Message.length() == messageLength) {
      String readValue = esp32Message.substring(2, 12);
      periodTime = readValue.toInt();
      readValue = esp32Message.substring(13, 14);
      paused = readValue.toInt();
      readValue = esp32Message.substring(15, 16);
      period = readValue.toInt();
      readValue = esp32Message.substring(17, 18);
      yelCardL = readValue.toInt();
      readValue = esp32Message.substring(19, 20);
      redCardL = readValue.toInt();
      readValue = esp32Message.substring(21, 22);
      yelCardR = readValue.toInt();
      readValue = esp32Message.substring(23, 24);
      redCardR = readValue.toInt();
      readValue = esp32Message.substring(25, 26);
      leftPriority = readValue.toInt();
      readValue = esp32Message.substring(27, 28);
      rightPriority = readValue.toInt();
      readValue = esp32Message.substring(29, 30);
      automaticPoints = readValue.toInt();
      readValue = esp32Message.substring(31, 32);
      blockedMachine = readValue.toInt();
      readValue = esp32Message.substring(33, 34);
      buzzerPattern = readValue.toInt();
    }
  }
}

void periodTimeDisplay() {
  /*Display tenths of a second during the last 10 seconds when not paused
  * and with hundreds of a second when paused, as per FIE Material Rules 
  * November 2022 m.51.8 https://static.fie.org/uploads/31/155253-book%20m%20ang.pdf*/
  String displayTime = "";
  if (periodTime > 10000) {  //Over 10 seconds left
    String timerMinutes = String((uint32_t)periodTime / 60000);
    String timerSeconds = String((uint32_t)periodTime % 60000 / 1000);
    while (timerMinutes.length() < 2) {
      timerMinutes = "0" + timerMinutes;
    }
    while (timerSeconds.length() < 2) {
      timerSeconds = "0" + timerSeconds;
    }
    displayTime = timerMinutes + ":" + timerSeconds;
  } else {  //10 s or less left
    String timerSeconds = String((uint32_t)periodTime / 1000);
    String timerTenths = String((uint32_t)periodTime % 1000 / 100);
    while (timerSeconds.length() < 2) {
      timerSeconds = "0" + timerSeconds;
    }
    displayTime = timerSeconds + "." + timerTenths;
    if (paused) {
      String timerHundredths = String((uint32_t)periodTime % 1000 % 100 / 10);
      displayTime = displayTime + timerHundredths;
    }
  }
  timerDisplay.print(displayTime);
}

void periodDisplay() {
  //Turn period number into binary
  String binaryPeriod = String(period, BIN);
  //Add missing zeroes to have a 4 bit binary
  while (binaryPeriod.length() < 4) {
    binaryPeriod = "0" + binaryPeriod;
  }
  //Check each bit and write to the 4511 IC
  uint8_t bitStatus = binaryPeriod.charAt(3) == '1' ? 1 : 0;
  digitalWrite(ic4511APin, bitStatus);
  bitStatus = binaryPeriod.charAt(2) == '1' ? 1 : 0;
  digitalWrite(ic4511BPin, bitStatus);
  bitStatus = binaryPeriod.charAt(1) == '1' ? 1 : 0;
  digitalWrite(ic4511CPin, bitStatus);
  bitStatus = binaryPeriod.charAt(0) == '1' ? 1 : 0;
  digitalWrite(ic4511DPin, bitStatus);
}

void cardsDisplay() {
  digitalWrite(leftYellowPin, yelCardL);
  digitalWrite(leftRedPin, redCardL);
  digitalWrite(rightYellowPin, yelCardR);
  digitalWrite(rightRedPin, redCardR);
}

void priorityDisplay() {
  digitalWrite(leftPriorityPin, leftPriority);
  digitalWrite(rightPriorityPin, rightPriority);
}

void autoPointsDisplay() {
  digitalWrite(autoPointsLEDPin, automaticPoints);
}

void blockedDisplay() {
  digitalWrite(blockedLEDPin, blockedMachine);
}

void buzzerAlert() {
  //According to buzzer pattern value, make sound alerts
}