//Hiriart Corales Samaniego
#include <SPI.h>  //For nRF24L01
#include <nRF24L01.h>
#include <RF24.h>
//Declare input pins for buttons
const uint8_t resetCards = 22;
const uint8_t pAuto = 23;
const uint8_t yCardL = 24;
const uint8_t rCardL = 25;
const uint8_t decLeft = 26;
const uint8_t incLeft = 27;
const uint8_t oneMin = 28;
const uint8_t prevUnit = 29;
const uint8_t resetMch = 30;
const uint8_t switchScores = 31;
const uint8_t upload = 32;
const uint8_t incPeriod = 33;
const uint8_t decTime = 34;
const uint8_t editTimeToggle = 35;
const uint8_t incTime = 36;
const uint8_t syncMachine = 37;
const uint8_t pManual = 38;
const uint8_t yCardR = 39;
const uint8_t rCardR = 40;
const uint8_t decRight = 41;
const uint8_t incRight = 42;
const uint8_t threeMin = 43;
const uint8_t nextUnit = 44;
const uint8_t pauseRes = 45;
//Controller's ID
const uint32_t remoteId = 1;  //Must be diferent for every controller
//RF SPI pins
const uint8_t rfCEPin = 6;   //CS pin (CE)
const uint8_t rfCSNPin = 7;  //CS Not pin (CSN)
//To store which button was just pressed
int8_t buttonReset = 0;
int8_t pressedButton = buttonReset;
//Time for debounce check
uint8_t debounceDelay = 50;
//Last status for debounce check
uint8_t lastPinStatus = LOW;

//Radio transmitter instance and channel
RF24 radioTX(rfCEPin, rfCSNPin);  // CE, CSN
const byte address[6] = "46920";  //Same for all remotes and machines, ID will be checked

void setup() {
  //Set button pins for input pullup
  pinMode(resetCards, INPUT_PULLUP);
  pinMode(pAuto, INPUT_PULLUP);
  pinMode(yCardL, INPUT_PULLUP);
  pinMode(rCardL, INPUT_PULLUP);
  pinMode(decLeft, INPUT_PULLUP);
  pinMode(incLeft, INPUT_PULLUP);
  pinMode(oneMin, INPUT_PULLUP);
  pinMode(prevUnit, INPUT_PULLUP);
  pinMode(resetMch, INPUT_PULLUP);
  pinMode(switchScores, INPUT_PULLUP);
  pinMode(upload, INPUT_PULLUP);
  pinMode(incPeriod, INPUT_PULLUP);
  pinMode(decTime, INPUT_PULLUP);
  pinMode(editTimeToggle, INPUT_PULLUP);
  pinMode(incTime, INPUT_PULLUP);
  pinMode(syncMachine, INPUT_PULLUP);
  pinMode(pManual, INPUT_PULLUP);
  pinMode(yCardR, INPUT_PULLUP);
  pinMode(rCardR, INPUT_PULLUP);
  pinMode(decRight, INPUT_PULLUP);
  pinMode(incRight, INPUT_PULLUP);
  pinMode(threeMin, INPUT_PULLUP);
  pinMode(nextUnit, INPUT_PULLUP);
  pinMode(pauseRes, INPUT_PULLUP);
  //Radio init
  radioTX.begin();
  radioTX.openWritingPipe(address);
  radioTX.setDataRate(RF24_1MBPS);
  radioTX.setPALevel(RF24_PA_HIGH);  //-6dBM power amplifier
  radioTX.setAutoAck(0, false);      //Disable message ACK so it can broadcast and just the id gets checked
  radioTX.stopListening();
}

void loop() {
  pressedButton = buttonReset;  //Reset press
  checkButtonPress();
  debounce();
  delay(100);
  if (pressedButton != buttonReset) {
    transmit();
  }
}

void checkButtonPress() {
  if (digitalRead(resetCards) == LOW) {
    updateButtonStatuses(resetCards, LOW);
  }
  if (digitalRead(pAuto) == LOW) {
    updateButtonStatuses(pAuto, LOW);
  }
  if (digitalRead(yCardL) == LOW) {
    updateButtonStatuses(yCardL, LOW);
  }
  if (digitalRead(rCardL) == LOW) {
    updateButtonStatuses(rCardL, LOW);
  }
  if (digitalRead(decLeft) == LOW) {
    updateButtonStatuses(decLeft, LOW);
  }
  if (digitalRead(incLeft) == LOW) {
    updateButtonStatuses(incLeft, LOW);
  }
  if (digitalRead(oneMin) == LOW) {
    updateButtonStatuses(oneMin, LOW);
  }
  if (digitalRead(prevUnit) == LOW) {
    updateButtonStatuses(prevUnit, LOW);
  }
  if (digitalRead(resetMch) == LOW) {
    updateButtonStatuses(resetMch, LOW);
  }
  if (digitalRead(switchScores) == LOW) {
    updateButtonStatuses(switchScores, LOW);
  }
  if (digitalRead(upload) == LOW) {
    updateButtonStatuses(upload, LOW);
  }
  if (digitalRead(incPeriod) == LOW) {
    updateButtonStatuses(incPeriod, LOW);
  }
  if (digitalRead(decTime) == LOW) {
    updateButtonStatuses(decTime, LOW);
  }
  if (digitalRead(editTimeToggle) == LOW) {
    updateButtonStatuses(editTimeToggle, LOW);
  }
  if (digitalRead(incTime) == LOW) {
    updateButtonStatuses(incTime, LOW);
  }
  if (digitalRead(syncMachine) == LOW) {
    updateButtonStatuses(syncMachine, LOW);
  }
  if (digitalRead(pManual) == LOW) {
    updateButtonStatuses(pManual, LOW);
  }
  if (digitalRead(yCardR) == LOW) {
    updateButtonStatuses(yCardR, LOW);
  }
  if (digitalRead(rCardR) == LOW) {
    updateButtonStatuses(rCardR, LOW);
  }
  if (digitalRead(decRight) == LOW) {
    updateButtonStatuses(decRight, LOW);
  }
  if (digitalRead(incRight) == LOW) {
    updateButtonStatuses(incRight, LOW);
  }
  if (digitalRead(threeMin) == LOW) {
    updateButtonStatuses(threeMin, LOW);
  }
  if (digitalRead(nextUnit) == LOW) {
    updateButtonStatuses(nextUnit, LOW);
  }
  if (digitalRead(pauseRes) == LOW) {
    updateButtonStatuses(pauseRes, LOW);
  }
}

void updateButtonStatuses(uint8_t pin, uint8_t value) {
  pressedButton = pin;
  lastPinStatus = value;
}

void debounce() {
  //Wait to see if button was really pressed
  delay(debounceDelay);
  //Check if the button is still pressed after waiting, reset to 0 if it was noise
  if (pressedButton != A6 && pressedButton != A7) {
    if (digitalRead(pressedButton) != lastPinStatus) {
      pressedButton = buttonReset;
    }
  } else {
    if (analogRead(pressedButton) > lastPinStatus) {
      pressedButton = buttonReset;
    }
  }
}

void transmit() {
  String idStr = String(remoteId);
  String buttonStr = String(pressedButton);
  //Add needed zeros to substrings
  while (idStr.length() < 10) {
    idStr = "0" + idStr;
  }
  while (buttonStr.length() < 2) {
    buttonStr = "0" + buttonStr;
  }
  String message = "s;" + idStr + ';' + buttonStr + ";e\n";
  uint8_t msgLen = message.length() + 1;
  char msg[msgLen];
  message.toCharArray(msg, msgLen);
  radioTX.write(&msg, sizeof(msg));
}