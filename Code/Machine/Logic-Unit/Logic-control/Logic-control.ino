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
const uint8_t synchPin = 33;

/*IMPORTANT!!!!
//These pins are used by RF communication with remote
//RF receiver pins, IRQ pin (interrupt) is not needed
nRF24L01CLKPin  = 18;  //RF CLK
nRF24L01MOSIPin = 23;   //RF MOSI (data out)
nRF24L01MISOPin = 19;   //RF MISO (data in)*/
const uint8_t nRF24L01CEPin = 4;   //RF CS
const uint8_t nRF24L01CSNPin = 5;  //RF CSN

//Data variables
//Scores
uint8_t leftScore = 0;
uint8_t rightScore = 0;
//Priorities
bool leftPriority = false;
bool rightPriority = false;
//Time
bool paused = true;
uint8_t period = 1;
uint32_t setTime = 0;                         //Time wich has been set in the machine
uint32_t lastTimeUpdate = 0;                  //Last time that timer was updated
uint32_t elapsedTime = 0;                     //To know how much time has passed
const uint16_t timeDisplayThreshold = 10000;  //Threshold that indicates if tenths and hundedths must be shown
//Machine status
bool pointsIncAuto = true;     //Points increase automatic or not
uint8_t currentBuzzAlert = 0;  //Current alert that must play, values 1 to 5
bool blocked = false;          //Blocked for inputs
//Cards
bool yCardLeft = false;
bool rCardLeft = false;
bool yCardRight = false;
bool rCardRight = false;
//Time editing vars
bool editingTime = false;
uint8_t currentlyEditing = 0;  //0 for mins, 1 for s, 2 for tenths, 3 for hundredths
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
const String messageSeparator = ";";
const uint8_t messageLength = 18;  //17 chars and \n

//Stored remote ID
uint32_t synchedRemoteID = 0;
const uint16_t synchTimeout = 5000;  //Max time to sync new remote
const uint8_t synchCommand = 37;     //Command that must be sent to sync to new remote

//Radio transmitter instance and channel
RF24 radioRX(nRF24L01CEPin, nRF24L01CSNPin);  // CE, CSN
const byte address[6] = "46920";

//EEPROM config
/*Bytes needed, 4 for remote ID (ulong stored as chars), 
* 4 for setTime (ulong stored as chars), 
* 4 for elapsedTime (ulong stored as chars), 2 for scores (1 per score)
*/
const uint8_t EEPROM_SIZE = 14;  //512 bytes available
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
  pinMode(synchPin, INPUT_PULLDOWN);
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
  EEPROM.get(remoteIDAddress, synchedRemoteID);  //Writes directly to var
  EEPROM.end();
}

void loop() {
  // put your main code here, to run repeatedly:
  if (!paused) {  //No need to run this if action has stopped
    //Update elapsed time and last count time
    elapsedTime += millis() - lastTimeUpdate;  //No need to update time if it is already paused
    lastTimeUpdate = millis();
    checkTouches();  //No need to check touches if time is stopped
  }
  //Check if time has ran out and timer must be stopped
  checkTimerEnd();
  //Check on board buttons presses
  onBoardButtons();
  //Check for remote instructions and execute commands
  handleRemote(receiveRemote());
  //Send data to display units
  sendLEDsTimerPeriod();
  //Send score to score display units
  sendScores();
}

void checkTimerEnd() {
  //Check if timer has ended, play alert and pause
  if (setTime - elapsedTime <= 0 && !paused) {
    paused = true;
    currentBuzzAlert = 5;
  }
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
  //Command handling, if command is 0 (invalid) or 37 (synch) do nothing
  switch (commandID) {
    case 22:
      blocked = !blocked;
      currentBuzzAlert = 4;  //Play 3 beeps to indicate blocking command was received and executed
      break;
    case 23:
      {
        uint8_t randomAssignment = random(1, 3);
        if (randomAssignment == 1) {
          leftPriority = true;
          rightPriority = false;
        } else {
          leftPriority = false;
          rightPriority = true;
        }
      }
      currentBuzzAlert = 2;  //Play 1 beep to indicate command was received and executed
      break;
    case 24:
      //If the yellow card has already been assigned, it becomes a red and a touch against
      if (!yCardLeft) {
        yCardLeft = true;
      } else {
        rCardLeft = true;
        if (rightScore != 99) {  //Cant go over 99
          rightScore++;
        }
      }
      currentBuzzAlert = 2;
      break;
    case 25:
      if (!rCardLeft) {
        rCardLeft = true;
      }
      //Always assign a touch against
      if (rightScore != 99) {
        rightScore++;
      }
      currentBuzzAlert = 2;
      break;
    case 26:
      //Dont let score be less than 0
      if (leftScore != 0) {
        leftScore--;
      }
      currentBuzzAlert = 2;
      break;
    case 27:
      //Dont let score be more than 99
      if (leftScore != 99) {
        leftScore++;
      }
      currentBuzzAlert = 2;
      break;
    case 28:
      setTime = 60000;
      elapsedTime = 0;
      currentBuzzAlert = 2;
      break;
    case 29:
      //Edit minutes if editing seconds, seconds if editing tenths, tenths if editing hundredths
      /*Take into consideration that tenths and hundredths cannot be edited if time remaining time 
      * is more than 10s, and minutes cannot be edited if remaning time is 10s or less*/
      {
        uint32_t remainingTime = setTime - elapsedTime;
        currentBuzzAlert = 2;
        if (currentlyEditing == 1 && remainingTime > timeDisplayThreshold) {
          currentlyEditing = 0;
          break;
        }
        if (currentlyEditing == 2) {
          currentlyEditing = 1;
          break;
        }
        if (currentlyEditing == 3) {
          currentlyEditing = 2;
        }
      }
      break;
    case 30:
      //Scores
      leftScore = 0;
      rightScore = 0;
      //Priorities
      leftPriority = false;
      rightPriority = false;
      //Time
      paused = true;
      period = 1;
      setTime = 0;         //Time wich has been set in the machine
      lastTimeUpdate = 0;  //When timer started to countdown
      elapsedTime = 0;     //To know how much time has passed
      //Machine status
      pointsIncAuto = true;  //Points increase automatic or not
      currentBuzzAlert = 0;  //Current alert that must play, values 1 to 5
      blocked = false;       //Blocked for inputs
      //Cards
      yCardLeft = false;
      rCardLeft = false;
      yCardRight = false;
      rCardRight = false;
      currentBuzzAlert = 2;
      break;
    case 31:
      {
        //Swith scores (used in team competitions)
        uint8_t tempLeft = leftScore;
        leftScore = rightScore;
        rightScore = tempLeft;
        blocked = !blocked;
      }
      currentBuzzAlert = 2;
      break;
    case 32:
      //Upload data to API
      currentBuzzAlert = 2;
      break;
    case 33:
      period < 9 ? period++ : period = 1;
      currentBuzzAlert = 2;
      break;
    case 34:
      //Decrease remaining minutes, seconds, tenths or hundredths by increasing elapsed time
      /*Take into consideration that tenths and hundredths cannot be edited if time remaining time 
      * is more than 10s, and minutes cannot be edited if remaning time is 10s or less*/
      {
        if (!editingTime) {
          break;
        }
        uint32_t remainingTime = setTime - elapsedTime;
        //When checking what is being edited, don't allow time to end up being less than 0
        if (currentlyEditing == 0 && remainingTime >= 60000) {
          elapsedTime += 60000;
        }
        if (currentlyEditing == 1 && remainingTime >= 1000) {
          elapsedTime += 1000;
        }
        if (currentlyEditing == 2 && remainingTime >= 100) {
          elapsedTime += 100;
        }
        if (currentlyEditing == 3 && remainingTime >= 10) {
          elapsedTime += 10;
        }
        remainingTime = setTime - elapsedTime;
        //Automatically switch to seconds editing if needed (if time now 10s or less)
        if (remainingTime <= timeDisplayThreshold && currentlyEditing == 0) {
          currentlyEditing = 1;
        }
      }
      currentBuzzAlert = 2;
      break;
    case 35:
      //Toggle editing time
      {
        editingTime = !editingTime;
        //If now editing, set the editing to start at the leftmost unit (i.e. minutes or seconds) depending on whether more then  10s are left
        if (editingTime) {
          uint32_t remainingTime = setTime - elapsedTime;
          if (remainingTime > timeDisplayThreshold) {
            currentlyEditing = 0;
          } else {
            currentlyEditing = 1;
          }
        }
        currentBuzzAlert = 2;
      }
      break;
    case 36:
      //Increase reamining minutes, seconds, tenths or hundredths by decreasing elapsed time
      /*Take into consideration that tenths and hundredths cannot be edited if time remaining time 
      * is more than 10s, and minutes cannot be edited if remaning time is 10s or less*/
      {
        if (!editingTime) {
          break;
        }
        if (currentlyEditing == 0) {
          elapsedTime -= 60000;
        }
        if (currentlyEditing == 1) {
          elapsedTime -= 1000;
        }
        if (currentlyEditing == 2) {
          elapsedTime -= 100;
        }
        if (currentlyEditing == 3) {
          elapsedTime -= 10;
        }
        uint32_t remainingTime = setTime - elapsedTime;
        //Automatically switch to seconds editing if needed (if time now more than 10s)
        if (remainingTime > timeDisplayThreshold && currentlyEditing >= 2) {
          currentlyEditing = 1;
        }
        currentBuzzAlert = 2;
      }
      break;
    case 38:
      currentBuzzAlert = 2;
      if (!leftPriority && !rightPriority) {
        leftPriority = true;
        rightPriority = false;
        break;
      }
      if (leftPriority) {
        leftPriority = false;
        rightPriority = true;
        break;
      }
      if (rightPriority) {
        leftPriority = false;
        rightPriority = false;
      }
      break;
    case 39:
      //If the yellow card has already been assigned, it becomes a red and a touch against
      if (!yCardRight) {
        yCardRight = true;
      } else {
        rCardRight = true;
        if (leftScore != 99) {
          leftScore++;
        }
      }
      currentBuzzAlert = 2;
      break;
    case 40:
      if (!rCardRight) {
        rCardRight = true;
      }
      //Always assign a touch against
      if (leftScore != 99) {
        leftScore++;
      }
      currentBuzzAlert = 2;
      break;
    case 41:
      //Dont let score be less than 0
      if (rightScore != 0) {
        rightScore--;
      }
      currentBuzzAlert = 2;
      break;
    case 42:
      //Dont let score be more than 99
      if (rightScore != 99) {
        rightScore++;
      }
      currentBuzzAlert = 2;
      break;
    case 43:
      setTime = 180000;
      elapsedTime = 0;
      currentBuzzAlert = 2;
      break;
    case 44:
      //Edit seconds if editing minutes, tenths if editing seconds, hundredths if editing tenths
      /*Take into consideration that tenths and hundredths cannot be edited if time remaining time 
      * is more than 10s, and minutes cannot be edited if remaning time is 10s or less*/
      {
        uint32_t remainingTime = setTime - elapsedTime;
        currentBuzzAlert = 2;
        if (currentlyEditing == 0) {
          currentlyEditing = 1;
          break;
        }
        if (currentlyEditing == 1 && remainingTime <= timeDisplayThreshold) {
          currentlyEditing = 2;
          break;
        }
        if (currentlyEditing == 2) {
          currentlyEditing = 3;
        }
      }
      break;
    case 45:
      paused = !paused;
      //Reset start time if unpaused
      if (!paused) {
        lastTimeUpdate = millis();
      }
      if (setTime - elapsedTime > 0) {
        currentBuzzAlert = 1;  //Play 1 long beep to indicate pause/continue
      } else {
        currentBuzzAlert = 3;  //Indicate time has ended, cant resume
      }
      break;
  }
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
    if (commandID == synchCommand) {
      newRemoteID = remoteID;
    }
    //Stop looking for a connection if 5 seconds have passed
    if (millis() - attemptStart >= synchTimeout || commandID != 0) {
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
  uint8_t syncPress = digitalRead(synchPin);
  //Check that there is still a press after delay time, if so do what is needed
  delay(debounceDelay);
  uint8_t autoToggleDebounce = digitalRead(toggleAutoPointsPin);
  uint8_t syncDebounce = digitalRead(synchPin);
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
    paused = true;
    if (pointsIncAuto && leftScore != 99) {
      leftScore += 1;
    }
  }
  if (rightTouch == rightTouchDebounce && rightTouchDebounce == HIGH) {
    paused = true;
    if (pointsIncAuto && rightScore != 99) {
      rightScore += 1;
    }
  }
  if (invalidRight == invalidRightDebounce && invalidRightDebounce == HIGH) {
    paused = true;
  }
  if (invalidLeft == invalidLeftDebounce && invalidLeftDebounce == HIGH) {
    paused = true;
  }
}

void sendLEDsTimerPeriod() {
  /*Send string like:
  * start;time(in ms);paused;period;leftYellow;leftRed;rightYellow;rightRed;leftPriority;rightPriority;autoPoints;machineBlocked;buzzerPattern;end\n
  * e.g. (1.5 used minutes): s;0000090000;0;2;1;1;1;0;0;0;1;0;3;e\n
  */
  int32_t timerTime = setTime - elapsedTime;
  //Check if by something more time thant the set time has passed, cannot display negatives so must set to 0
  if (timerTime < 0) {
    timerTime = 0;
  }
  String displayTime = String(timerTime);
  //Add needed leading zeroes to time
  while (displayTime.length() < 10) {
    displayTime = "0" + displayTime;
  }
  String message = messageStartDelimiter + messageSeparator;
  message += displayTime + messageSeparator;
  message += String(paused) + messageSeparator;
  message += String(period) + messageSeparator;
  message += String(yCardLeft) + messageSeparator;
  message += String(rCardLeft) + messageSeparator;
  message += String(yCardRight) + messageSeparator;
  message += String(rCardRight) + messageSeparator;
  message += String(leftPriority) + messageSeparator;
  message += String(rightPriority) + messageSeparator;
  message += String(pointsIncAuto) + messageSeparator;
  message += String(blocked) + messageSeparator;
  message += String(currentBuzzAlert) + messageSeparator;
  message += messageEndDelimiter;
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
  String message = messageStartDelimiter + messageSeparator;
  String score = String(leftScore);
  //Add 0 to score if needed to complete message length
  while (score.length() < 2) {
    score = "0" + score;
  }
  message += score + messageSeparator + messageEndDelimiter;
  int charMessageLength = message.length() + 1;
  char serialMessage[charMessageLength];
  message.toCharArray(serialMessage, charMessageLength);
  Serial1.write(serialMessage);
  //Send right score (same process, different Serial port)
  message = messageStartDelimiter + messageSeparator;
  score = String(rightScore);
  //Add 0 to score if needed to complete message length
  while (score.length() < 2) {
    score = "0" + score;
  }
  message += score + messageSeparator + messageEndDelimiter;
  charMessageLength = message.length() + 1;
  message.toCharArray(serialMessage, charMessageLength);
  Serial2.write(serialMessage);
}