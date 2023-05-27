//Hiriart Corales Samaniego
#include <RH_ASK.h>
#include <SPI.h>  // Not used but needed to compile
//Touches input pins
const uint8_t leftTouchPin = 19;
const uint8_t rightTouchPin = 23;
const uint8_t invalidRightPin = 18;  //Invalid target or antiblocking (self-touch) pins
const uint8_t invalidLeftPin = 4;
//Buttons pins
const uint8_t toggleAutoPointsPin = 32;
const uint8_t resetPin = 33;
//RF receiver pins
const uint8_t BTTXPin = 26;  //TX not used but has to be overridden
const uint8_t BTRXPin = 5;   //To override default RX pin
//Data variables
uint8_t leftScore = 0;
uint8_t rightScore = 0;
uint8_t paused = 0;
uint32_t setTime = 180000;  //Time wich has been set in the machine
uint32_t startTime = 0;     //When timer started to countdown
uint32_t elapsedTime = 0;   //To know how much time has passed
bool pointsIncAuto = true;  //Points increase automatic or not
//Debounce delay time
uint8_t debounceDelay = 50;

void setup() {
  // put your setup code here, to run once:
  //Serial ports
  Serial.begin(9600);
  Serial1.begin(9600, SERIAL_8N1, 14, 13);  //Last 2 args are RX and TX pins
  Serial2.begin(9600);
  //Machine inputs
  pinMode(leftTouchPin, INPUT_PULLUP);
  pinMode(rightTouchPin, INPUT_PULLUP);
  pinMode(invalidRightPin, INPUT_PULLUP);
  pinMode(invalidLeftPin, INPUT_PULLUP);
  //Buttons
  pinMode(toggleAutoPointsPin, INPUT_PULLDOWN);
  pinMode(resetPin, INPUT_PULLDOWN);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (!paused) {  //No need to run this if action has stopped
    //Update elapsed time
    elapsedTime = millis() - startTime;  //No need to update time if it is already paused
    checkTouches();                      //No need to check touches if time is stopped
  }
  //Send data to display units
  sendLEDsTimerPeriod();
  //Send score to score display units
  sendScores();
  //Check on board buttons presses
  onBoardButtons();
}

void onBoardButtons() {
  uint8_t autoTogglePress = digitalRead(toggleAutoPointsPin);
  uint8_t resetPress = digitalRead(resetPin);
  //Check that there is still a press after delay time, if so do what is needed
  delay(debounceDelay);
  uint8_t autoToggleDebounce = digitalRead(toggleAutoPointsPin);
  uint8_t resetDebounce = digitalRead(resetPin);
  if (autoTogglePress == autoToggleDebounce && autoToggleDebounce == HIGH) {
    pointsIncAuto = !pointsIncAuto;
  }
  if (resetPress == resetDebounce && resetDebounce == HIGH) {
    leftScore = 0;
    rightScore = 0;
    paused = 1;
    elapsedTime = 0;
  }
}

void checkTouches() {
  uint8_t leftPrev = leftScore;    //Last left score
  uint8_t rightPrev = rightScore;  //last right score
  uint8_t leftTouch = digitalRead(leftTouchPin);
  uint8_t rightTouch = digitalRead(rightTouchPin);
  uint8_t invalidRight = digitalRead(invalidRightPin);
  uint8_t invalidLeft = digitalRead(invalidLeftPin);
  //Check that there is still a press after delay time, if so do what is needed
  delay(debounceDelay);
  uint8_t leftTouchDebounce = digitalRead(leftTouchPin);
  uint8_t rightTouchDebounce = digitalRead(rightTouchPin);
  uint8_t invalidRightDebounce = digitalRead(invalidRightPin);
  uint8_t invalidLeftDebounce = digitalRead(invalidLeftPin);
  if (leftTouch == leftTouchDebounce && leftTouchDebounce == LOW) {
    paused = 1;
    if (pointsIncAuto) {
      leftScore += 1;
    }
  }
  if (rightTouch == rightTouchDebounce && rightTouchDebounce == LOW) {
    paused = 1;
    if (pointsIncAuto) {
      rightScore += 1;
    }
  }
  if (invalidRight == invalidRightDebounce && invalidRightDebounce == LOW) {
    paused = 1;
  }
  if (invalidLeft == invalidLeftDebounce && invalidLeftDebounce == LOW) {
    paused = 1;
  }
}

void sendLEDsTimerPeriod() {
  /*Send string like:
  * start;time(in ms);paused;period;leftYellow;leftRed;rightYellow;rightRed;leftPriority;rightPriority;autoPoints;machineBlocked;buzzerPattern;end\n
  * e.g. (1.5 used minutes): s;0000090000;0;2;1;1;1;0;0;0;1;0;3;e\n
  */
  uint32_t timerTime = setTime - elapsedTime;
  String message = "s;" + String(timerTime) + ";" + String(paused) + ";" + String(leftScore) + ";" + String(rightScore) + ";" + String(pointsIncAuto) + ";e\n";
  int charMessageLength = message.length() + 1;
  char serialMessage[charMessageLength];
  message.toCharArray(serialMessage, charMessageLength);
  Serial.write(serialMessage);
}

void sendScores() {
  //Send strings like start;left;right;end\n e.g. s;06;e\n
  //Send left score
  String message = "s;";
  String score = String(leftScore);
  //Add 0 to score if needed to complete message length
  while (score.length() < 2) {
    score = "0" + score;
  }
  message += score + ";e\n";
  int charMessageLength = message.length() + 1;
  char serialMessage[charMessageLength];
  message.toCharArray(serialMessage, charMessageLength);
  Serial1.write(serialMessage);
  //Send right score (same process, different Serial port)
  message = "s;";
  score = String(rightScore);
  //Add 0 to score if needed to complete message length
  while (score.length() < 2) {
    score = "0" + score;
  }
  message += score + ";e\n";
  charMessageLength = message.length() + 1;
  message.toCharArray(serialMessage, charMessageLength);
  Serial2.write(serialMessage);
}