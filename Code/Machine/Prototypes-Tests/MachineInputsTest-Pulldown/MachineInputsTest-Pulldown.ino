//Hiriart Corales Samaniego
//Touches input pins
const uint8_t leftTouchPin = 19;
const uint8_t rightTouchPin = 23;
const uint8_t invalidTouchPin = 18;  //Invalid target or antiblocking (self-tough) pin
//Data variables
uint8_t leftScore = 0;
uint8_t rightScore = 0;
bool scoresChanged = false;
uint8_t paused = 0;
uint32_t setTime = 0;       //Time wich has been set in the machine
uint32_t startTime = 0;     //When timer started to countdown
uint32_t elapsedTime = 0;   //To know how much time has passed
bool pointsIncAuto = true;  //Points increase automatic or not
//Debounce delay time
uint8_t debounceDelay = 50;

void setup() {
  // put your setup code here, to run once:
  //Serial ports
  Serial.begin(9600);
  Serial1.begin(9600, SERIAL_8N1, 13, 14);  //Last 2 args are RX and TX pins
  Serial2.begin(9600);
  //Machine inputs
  pinMode(leftTouchPin, INPUT_PULLDOWN);
  pinMode(rightTouchPin, INPUT_PULLDOWN);
  pinMode(invalidTouchPin, INPUT_PULLDOWN);
}

void loop() {
  // put your main code here, to run repeatedly:
  //Update elapsed time

  checkTouches();                        //No need to check touches if time is stopped
  if (!paused) {                         //No need to run this if action has stopped
    elapsedTime = millis() - startTime;  //No need to update time if it is already paused
  }
  //Send data to display units
  sendLEDsTimerPeriod();
  if (scoresChanged) {  //No need to send scores if they didnt change
    sendScores();
  }
  Serial.println(digitalRead(leftTouchPin));
  Serial.println(digitalRead(rightTouchPin));
  Serial.println(digitalRead(invalidTouchPin));
  delay(2500);
}

void checkTouches() {
  uint8_t leftPrev = leftScore;    //Last left score
  uint8_t rightPrev = rightScore;  //last right score
  uint8_t leftTouch = digitalRead(leftTouchPin);
  uint8_t rightTouch = digitalRead(rightTouchPin);
  uint8_t invalidTouch = digitalRead(invalidTouchPin);
  //Check that there is still a press after delay time, if so do what is needed
  delay(debounceDelay);
  uint8_t leftTouchDebounce = digitalRead(leftTouchPin);
  uint8_t rightTouchDebounce = digitalRead(rightTouchPin);
  uint8_t invalidTouchDebounce = digitalRead(invalidTouchPin);
  if (leftTouch == leftTouchDebounce && leftTouchDebounce == HIGH) {
    paused += 1;
    if (pointsIncAuto) {
      leftScore += 1;
    }
  }
  if (rightTouch == rightTouchDebounce && rightTouchDebounce == HIGH) {
    paused += 1;
    if (pointsIncAuto) {
      rightScore += 1;
    }
  }
  if (invalidTouch == invalidTouchDebounce && invalidTouchDebounce == HIGH) {
    paused += 1;
  }
  //Check if scores were updated
  if (leftPrev != leftScore || rightPrev != rightScore) {
    scoresChanged = true;
  }
  /*Combinations
  * Invalid: R & L HIGH
  * Left: R & Inv HIGH
  * Right: L & Inv HIGH
  * Right & Left: Inv HIGH
  * Inv & Left: R HIGH
  * Inv & Right: L HIGH
  */
}

void sendLEDsTimerPeriod() {
  /*Send string like:
  * start;time(in ms);paused;period;leftYellow;leftRed;rightYellow;rightRed;leftPriority;rightPriority;autoPoints;machineBlocked;buzzerPattern;end\n
  * e.g. (1.5 used minutes): s;0000090000;0;2;1;1;1;0;0;0;1;0;3;e\n
  */
  uint32_t timerTime = setTime - elapsedTime;
  String message = "s;" + String(timerTime) + ";" + String(paused) + ";" + String(leftScore) + ";" + String(rightScore) + ";e\n";
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
  scoresChanged = false;
}