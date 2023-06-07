//Hiriart Corales Samaniego
//For FR
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
//For data persistance
#include <EEPROM.h>
//Touches input pins
const uint8_t leftTouchPin = 25;
const uint8_t rightTouchPin = 26;
const uint8_t invalidLeftPin = 22;  //Invalid target or antiblocking (self-touch) pins
const uint8_t invalidRightPin = 21;
//Buttons pins
const uint8_t toggleAutoPointsPin = 32;
const uint8_t syncPin = 33;

/*IMPORTANT!!!!
//These pins are used by RF communication with remote
//RF receiver pins, IRQ pin (interrupt) is not needed
nRF24L01CLKPin  = 18;  //RF CLK
nRF24L01MOSIPin = 23;   //RF MOSI (data out)
nRF24L01MISOPin = 19;   //RF MISO (data in)*/
const uint8_t nRF24L01CEPin = 4;   //RF CS
const uint8_t nRF24L01CSNPin = 5;  //RF CSN

//Data variables
uint8_t leftScore = 0;
uint8_t rightScore = 0;
uint8_t paused = 0;
uint32_t setTime = 0;          //Time wich has been set in the machine
uint32_t startTime = 0;        //When timer started to countdown
uint32_t elapsedTime = 0;      //To know how much time has passed
bool pointsIncAuto = true;     //Points increase automatic or not
uint8_t currentBuzzAlert = 0;  //Current alert that must play, values 1 to 5
/*Available alerts:
* 1: long beep
* 2: one beep
* 3: two beeps
* 4: three beeps
* 5: six bepes*/
//Debounce delay time
uint8_t debounceDelay = 50;

//Message delimiters
const String messageStartDelimiter = "s";
const String messageEndDelimiter = "e\n";
const uint8_t messageLength = 18;  //17 chars and \n

//Stored remote ID
uint32_t synchedRemoteID = 0;
const uint16_t syncTimeout = 5000;  //Max time to sync new remote
const uint8_t syncCommand = 44;     //Command that must be sent to sync to new remote

//Radio transmitter instance and channel
RF24 radioRX(nRF24L01CEPin, nRF24L01CSNPin);  // CE, CSN
const byte address[6] = "46920";

//EEPROM config
/*Bytes needed, 4 for remote ID (ulong stored as chars), 
* 4 for setTime (ulong stored as chars), 
* 4 for elapsedTime (ulong stored as chars), 2 for scores (1 per score)
*/
const uint8_t EEPROM_SIZE = 14;//512 bytes available
const uint8_t remoteIDAddress = 0;
const uint8_t setTimeAddress = 4;
const uint8_t elapsedTimeAddress = 8;
const uint8_t leftScoreAddress = 12;
const uint8_t rightScoreAddress = 13;


void setup() {
  // put your setup code here, to run once:
  //Serial ports
  Serial.begin(9600);
  Serial1.begin(9600, SERIAL_8N1, 14, 13);  //Last 2 args are RX and TX pins
  Serial2.begin(9600);
  //Machine inputs
  pinMode(leftTouchPin, INPUT_PULLDOWN);
  pinMode(rightTouchPin, INPUT_PULLDOWN);
  pinMode(invalidLeftPin, INPUT_PULLDOWN);
  pinMode(invalidRightPin, INPUT_PULLDOWN);
  //Buttons
  pinMode(toggleAutoPointsPin, INPUT_PULLDOWN);
  pinMode(syncPin, INPUT_PULLDOWN);
  //Radio RX
  radioRX.begin();
  radioRX.openReadingPipe(0, address);
  radioRX.setDataRate(RF24_1MBPS);
  radioRX.setPALevel(RF24_PA_HIGH);  //-6dBM power amplifier
  radioRX.setAutoAck(false);         //Disable message ACK so it can read from any TX and just the id gets checked
  radioRX.startListening();
  //Init EEPROM
  EEPROM.begin(EEPROM_SIZE);
  //Read stored remote value
  EEPROM.get(remoteIDAddress, synchedRemoteID);//Writes directly to var
  EEPROM.end();
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
  //Check for remote instructions and execute commands
  handleRemote(receiveRemote());
}

void handleRemote(String receivedCommand) {
  //Get data grom message with format s;id;instruction;e\n, e.g.: s;0000000001;44;e\n
  //Ignore if message was empty
  uint8_t commandID = 0;
  if (receivedCommand.length() == messageLength) {
    String readValue = receivedCommand.substring(2, 12);
    uint8_t remoteID = readValue.toInt();
    readValue = receivedCommand.substring(13, 15);
    commandID = readValue.toInt();
    //If ID doesnt match, ignore command
    if (remoteID != synchedRemoteID) {
      commandID = 0;
    }
  }
  //Command handling, if command is 0 do nothing
}

String receiveRemote() {
  //Get message from nRF24L01, will be processed later
  char command[19] = "";  //Length + 1 for termination caracter
  if (radioRX.available()) {
    radioRX.read(&command, sizeof(command));
  }
  String receivedMessage = String(command);
  //Analize message, with format s;id;instruction;e\n, e.g.: s;0000000001;44;e\n
  /*Check if message is formed properly*/
  String receivedCommand = "";
  if (receivedMessage.startsWith(messageStartDelimiter) && receivedMessage.endsWith(messageEndDelimiter)
      && receivedMessage.length() == messageLength) {
    receivedCommand = receivedMessage;
  }
  return receivedCommand;
}

void syncRemote() {
  uint32_t attemptStart = millis();  //Record when attempt started, 5 seconds will be given
  uint8_t newRemoteID = 0;
  uint8_t commandID = 0;
  while (true) {
    String receivedCommand = receiveRemote();
    uint8_t remoteID = 0;
    //Ignore if message was empty
    if (receivedCommand.length() == messageLength) {
      String readValue = receivedCommand.substring(2, 12);
      remoteID = readValue.toInt();
      readValue = receivedCommand.substring(13, 15);
      commandID = readValue.toInt();
    }
    if (commandID == syncCommand) {
      newRemoteID = remoteID;
    }
    //Stop looking for a connection if 5 seconds have passed
    if (millis() - attemptStart >= syncTimeout || commandID != 0) {
      break;
    }
  }
  if (newRemoteID == 0) {
    //Alert that sync failed
    currentBuzzAlert = 3;  //2 beeps
  } else {
    //Store new ID
    synchedRemoteID = newRemoteID;
    //Use EEPROM.put() to write, allowa writing of any length but uses EEPROM.update() so it doesnt overwrite if value didnt change
    EEPROM.begin(EEPROM_SIZE);
    EEPROM.put(remoteIDAddress, synchedRemoteID);
    //Alert that sync was successful
    currentBuzzAlert = 1;  //1 long beep
    EEPROM.end();
  }
}

void onBoardButtons() {
  uint8_t autoTogglePress = digitalRead(toggleAutoPointsPin);
  uint8_t syncPress = digitalRead(syncPin);
  //Check that there is still a press after delay time, if so do what is needed
  delay(debounceDelay);
  uint8_t autoToggleDebounce = digitalRead(toggleAutoPointsPin);
  uint8_t syncDebounce = digitalRead(syncPin);
  if (autoTogglePress == autoToggleDebounce && autoToggleDebounce == HIGH) {
    pointsIncAuto = !pointsIncAuto;
  }
  if (syncPress == syncDebounce && syncDebounce == HIGH) {
    //Attempt to sync remote
    syncRemote();
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
  if (leftTouch == leftTouchDebounce && leftTouchDebounce == HIGH) {
    paused = 1;
    if (pointsIncAuto) {
      leftScore += 1;
    }
  }
  if (rightTouch == rightTouchDebounce && rightTouchDebounce == HIGH) {
    paused = 1;
    if (pointsIncAuto) {
      rightScore += 1;
    }
  }
  if (invalidRight == invalidRightDebounce && invalidRightDebounce == HIGH) {
    paused = 1;
  }
  if (invalidLeft == invalidLeftDebounce && invalidLeftDebounce == HIGH) {
    paused = 1;
  }
}

void sendLEDsTimerPeriod() {
  /*Send string like:
  * start;time(in ms);paused;period;leftYellow;leftRed;rightYellow;rightRed;leftPriority;rightPriority;autoPoints;machineBlocked;buzzerPattern;end\n
  * e.g. (1.5 used minutes): s;0000090000;0;2;1;1;1;0;0;0;1;0;3;e\n
  */
  uint32_t timerTime = setTime - elapsedTime;
  String message = "s;" + String(timerTime) + ";" + String(paused) + ";" + String(leftScore) + ";"
                   + String(rightScore) + ";" + String(pointsIncAuto) + ";" + String(currentBuzzAlert) + ";e\n";
  int charMessageLength = message.length() + 1;
  char serialMessage[charMessageLength];
  message.toCharArray(serialMessage, charMessageLength);
  Serial.write(serialMessage);
  //Reset buzzer alert (it has been sent already)
  currentBuzzAlert = 0;
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