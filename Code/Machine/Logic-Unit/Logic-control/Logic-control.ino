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
//Debounce
uint8_t debounceDelay = 50;  //Debounce delay time
uint8_t autoToggleDebounce = 0;
uint8_t syncDebounce = 0;
uint8_t leftTouchDebounce = 0;
uint8_t rightTouchDebounce = 0;
uint8_t invalidLeftDebounce = 0;
uint8_t invalidRightDebounce = 0;
uint32_t lastAutoToggleDebTime = 0;
uint32_t lastSyncDebTime = 0;
uint32_t lastLTouchDebTime = 0;
uint32_t lastRTouchDebTime = 0;
uint32_t lastInvLDebTime = 0;
uint32_t lastInvRDebTime = 0;

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

//Battery and jack voltage reading
const uint8_t battVoltagePin = 39;
const uint8_t jackVoltagePin = 36;
uint8_t batteryLow = 0;
uint8_t lastBatteryLow = 0;
//About 4V from DC jack
//A small value of around 1200 will be read when tehre is no power, this is noise from the display arduino receiving serial data and kinda turning on
const uint16_t lowJackVolts = 3000;
//About 2.78V (after lowering 6.4V from 4xAA, 2.78 (5.4V in batt) or less means the batteries are dead)
const uint16_t lowBattVolts = 3000;
//Low battery indicator LED
const uint8_t lowBattLEDPin = 27;
//Power status
bool powerLost = false;

//EEPROM config
/*Bytes needed, 4 for remote ID (ulong stored as chars), 
* 4 for setTime (ulong stored as chars), 
* 4 for elapsedTime (ulong stored as chars), 2 for scores (1 per score)
*/
const uint8_t EEPROM_SIZE = 21;  //512 bytes available
const uint8_t remoteIDAddress = 0;
const uint8_t setTimeAddress = 4;
const uint8_t elapsedTimeAddress = 8;
const uint8_t leftScoreAddress = 12;
const uint8_t rightScoreAddress = 13;
const uint8_t leftYellowAddress = 14;
const uint8_t leftRedAddress = 15;
const uint8_t rightYellowAddress = 16;
const uint8_t rightRedAddress = 17;
const uint8_t leftPriorityAddress = 18;
const uint8_t rightPriorityAddress = 19;
const uint8_t periodAddress = 20;


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
  //Voltage reading
  pinMode(battVoltagePin, INPUT);
  pinMode(jackVoltagePin, INPUT);
  //Low battery LED
  pinMode(lowBattLEDPin, OUTPUT);
  //Radio RX
  radioRX.begin();
  radioRX.openReadingPipe(0, address);
  radioRX.setDataRate(RF24_1MBPS);
  radioRX.setPALevel(RF24_PA_HIGH);  //-6dBM power amplifier
  radioRX.setAutoAck(false);         //Disable message ACK so it can read from any TX and just the id gets checked
  radioRX.startListening();
  //Read stored values from EEPROM
  EEPROM.begin(EEPROM_SIZE);
  EEPROM.get(remoteIDAddress, synchedRemoteID);  //Writes directly to var
  EEPROM.get(setTimeAddress, setTime);
  EEPROM.get(elapsedTimeAddress, elapsedTime);
  EEPROM.get(leftScoreAddress, leftScore);
  EEPROM.get(rightScoreAddress, rightScore);
  EEPROM.get(leftYellowAddress, yCardLeft);
  EEPROM.get(leftRedAddress, rCardLeft);
  EEPROM.get(rightYellowAddress, yCardRight);
  EEPROM.get(rightRedAddress, rCardRight);
  EEPROM.get(leftPriorityAddress, leftPriority);
  EEPROM.get(rightPriorityAddress, rightPriority);
  EEPROM.get(periodAddress, period);
  EEPROM.end();
  //Boot up delay for sync
  delay(1500);
  currentBuzzAlert = 1;  //Long beep for ON
  sendLEDsTimerPeriod();
  sendScores();
}

void loop() {
  // put your main code here, to run repeatedly:
  //Check if main power source (5V DC Jack) has been lost
  checkPower();
  //Check if backup battery is low
  checkBatttery();
  lowBattIndicator();  //Update low batt indicator
  //No need to run this if action has stopped
  if (!paused) {
    //Update elapsed time and last count time
    elapsedTime += millis() - lastTimeUpdate;  //No need to update time if it is already paused
    lastTimeUpdate = millis();
    checkTouches();  //No need to check touches if time is stopped
  }
  //Check if time has ran out and timer must be stopped
  checkTimerEnd();
  //Check on board buttons presses only if machine is paused to avoid timer issues
  if (paused) {
    onBoardButtons();
  }
  //Check for remote instructions and execute commands
  handleRemote(receiveRemote());
  //Send data to display units
  sendLEDsTimerPeriod();
  //Send score to score display units
  sendScores();
}

void checkPower() {
  //Save time, cards, and score data if power was lost
  if (analogRead(jackVoltagePin) > lowJackVolts) {
    //If powerLost was set to true but the previous conditions was met, then power is not lost anymore
    if (powerLost) {
      powerLost = false;
    }
    return;
  } else {
    powerLost = true;
  }
  //If jack voltage was low, pause machine and save data in EEPROM (if battery not low to avoid issues)
  if (!batteryLow && powerLost) {
    //Power has been lost
    paused = true;
    //Use EEPROM.put() to write, allows writing of any length but uses EEPROM.update() so it doesnt overwrite if value didnt change
    EEPROM.begin(EEPROM_SIZE);
    EEPROM.put(setTimeAddress, setTime);
    EEPROM.put(elapsedTimeAddress, elapsedTime);
    EEPROM.put(leftScoreAddress, leftScore);
    EEPROM.put(rightScoreAddress, rightScore);
    EEPROM.put(leftYellowAddress, yCardLeft);
    EEPROM.put(leftRedAddress, rCardLeft);
    EEPROM.put(rightYellowAddress, yCardRight);
    EEPROM.put(rightRedAddress, rCardRight);
    EEPROM.put(leftPriorityAddress, leftPriority);
    EEPROM.put(rightPriorityAddress, rightPriority);
    EEPROM.put(periodAddress, period);
    EEPROM.end();
  }
}

void checkBatttery() {
  //Update battery status
  if (analogRead(battVoltagePin) < lowBattVolts) {
    lastBatteryLow = 1;
  } else {
    lastBatteryLow = 0;
  }
}

void lowBattIndicator() {
  //Update indicator (LED on or off) depending on batt status
  if (lastBatteryLow != batteryLow) {
    batteryLow = lastBatteryLow;
    digitalWrite(lowBattLEDPin, batteryLow);
  }
}

void checkTimerEnd() {
  //Check if timer has ended, play alert and pause
  if (elapsedTime >= setTime && !paused) {
    paused = true;
    currentBuzzAlert = 5;
  }
}

//Control that score doesnt go over 99
uint8_t scoreIncCheck(uint8_t score) {
  if (score != 99) {
    score++;
  }
  return score;
}

//Control score doesnt go below 0
uint8_t scoreDecCheck(uint8_t score) {
  if (score != 0) {
    score--;
  }
  return score;
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
  //Reject command if machine is not paused and command isnt pause command (avoid errors during combat)
  if (!paused && commandID != 45) {
    commandID = 0;
  }
  //Command handling, if command is 0 (invalid) or 37 (synch) do nothing
  switch (commandID) {
    case 22:
      yCardLeft = false;
      rCardLeft = false;
      yCardRight = false;
      rCardRight = false;
      currentBuzzAlert = 2;  //Play 1 beep to indicate command was received and executed
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
      currentBuzzAlert = 2;
      break;
    case 24:
      //If a red card was assigned before any yellow cards, the yellow card isnt assigned and becomes red immediately
      //according to FIE technical rules t.162 2 https://static.fie.org/uploads/29/149099-technical%20rules%20ang.pdf
      if (rCardLeft) {
        rCardLeft = true;
        rightScore = scoreIncCheck(rightScore);
      } else if (!yCardLeft) {
        //If the yellow card has already been assigned, it becomes a red and a touch against
        yCardLeft = true;
      } else {
        rCardLeft = true;
        rightScore = scoreIncCheck(rightScore);
      }
      currentBuzzAlert = 2;
      break;
    case 25:
      if (!rCardLeft) {
        rCardLeft = true;
      }
      //Always assign a touch against
      rightScore = scoreIncCheck(rightScore);
      currentBuzzAlert = 2;
      break;
    case 26:
      leftScore = scoreDecCheck(leftScore);
      currentBuzzAlert = 2;
      break;
    case 27:
      leftScore = scoreIncCheck(leftScore);
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
      //Cards
      yCardLeft = false;
      rCardLeft = false;
      yCardRight = false;
      rCardRight = false;
      //Time editing vars
      editingTime = false;
      currentlyEditing = 0;  //0 for mins, 1 for s, 2 for tenths, 3 for hundredths
      currentBuzzAlert = 2;
      break;
    case 31:
      {
        //Swith scores (used in team competitions)
        uint8_t tempLeft = leftScore;
        leftScore = rightScore;
        rightScore = tempLeft;
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
      //according to FIE technical rules t.162 2 https://static.fie.org/uploads/29/149099-technical%20rules%20ang.pdf
      if (rCardRight) {
        rCardRight = true;
        leftScore = scoreIncCheck(leftScore);
      } else if (!yCardRight) {
        //If a red card was assigned before any yellow cards, the yellow card isnt assigned and becomes red immediately
        yCardRight = true;
      } else {
        rCardRight = true;
        leftScore = scoreIncCheck(leftScore);
      }
      currentBuzzAlert = 2;
      break;
    case 40:
      if (!rCardRight) {
        rCardRight = true;
      }
      //Always assign a touch against
      leftScore = scoreIncCheck(leftScore);
      currentBuzzAlert = 2;
      break;
    case 41:
      rightScore = scoreDecCheck(rightScore);
      currentBuzzAlert = 2;
      break;
    case 42:
      rightScore = scoreIncCheck(rightScore);
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
      if (elapsedTime < setTime) {
        currentBuzzAlert = 1;  //Play 1 long beep to indicate pause/continue
        paused = !paused;
        //Reset start time if unpaused
        if (!paused) {
          lastTimeUpdate = millis();
        }
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
    //Use EEPROM.put() to write, allows writing of any length but uses EEPROM.update() so it doesnt overwrite if value didnt change
    EEPROM.begin(EEPROM_SIZE);
    EEPROM.put(remoteIDAddress, synchedRemoteID);
    //Alert that sync was successful
    currentBuzzAlert = 1;  //1 long beep
    EEPROM.end();
  }
}

//Reset debounce time if there was a press or noise that changed the state
uint32_t debounceTimeUpdate(uint8_t press, uint8_t debounce, uint32_t lastDebTime) {
  if (press != debounce) {
    lastDebTime = millis();
  }
  return lastDebTime;
}

/*If that reading has been there for the set time, it was a press not just noise 
* (presses last longer), return true if it was a press*/
bool debounceCheck(uint32_t lastDebTime) {
  bool wasPress = false;
  if ((millis() - lastDebTime) > debounceDelay) {
    return true;
  }
  return wasPress;
}


void onBoardButtons() {
  uint8_t autoTogglePress = digitalRead(toggleAutoPointsPin);
  uint8_t syncPress = digitalRead(synchPin);
  //Check that there is still a press after delay time, if so do what is needed
  //Reset debounce time if there was a press or noise that changed the state
  lastAutoToggleDebTime = debounceTimeUpdate(autoTogglePress, autoToggleDebounce, lastAutoToggleDebTime);
  //If that reading has been there for the set time, it was a press not just noise
  if (autoTogglePress == HIGH && debounceCheck(lastAutoToggleDebTime)) {
    pointsIncAuto = !pointsIncAuto;
  }
  autoToggleDebounce = autoTogglePress;  //Save last state
  //Reset debounce time if there was a press or noise that changed the state
  lastSyncDebTime = debounceTimeUpdate(syncPress, syncDebounce, lastSyncDebTime);
  //If that reading has been there for the set time, it was a press not just noise
  if (syncPress == HIGH && debounceCheck(lastSyncDebTime)) {
    //Attempt to sync remote
    syncRemote();
  }
  syncDebounce = syncPress;  //Save last state
}

void checkTouches() {
  uint8_t leftTouch = digitalRead(leftTouchPin);
  uint8_t rightTouch = digitalRead(rightTouchPin);
  uint8_t invalidLeft = digitalRead(invalidLeftPin);
  uint8_t invalidRight = digitalRead(invalidRightPin);
  //Check that there is still a press after delay time, if so do what is needed
  //Reset debounce time if there was a press or noise
  lastLTouchDebTime = debounceTimeUpdate(leftTouch, leftTouchDebounce, lastLTouchDebTime);
  //If that reading has been there for the set time, it was a press not just noise
  if (leftTouch == HIGH && debounceCheck(lastLTouchDebTime)) {
    paused = true;
    if (pointsIncAuto) {
      leftScore = scoreIncCheck(leftScore);
    }
  }
  leftTouchDebounce = leftTouch;  //Save last state
  //Reset debounce time if there was a press or noise
  lastRTouchDebTime = debounceTimeUpdate(rightTouch, rightTouchDebounce, lastRTouchDebTime);
  //If that reading has been there for the set time, it was a press not just noise
  if (rightTouch == HIGH && debounceCheck(lastRTouchDebTime)) {
    paused = true;
    if (pointsIncAuto) {
      rightScore = scoreIncCheck(rightScore);
    }
  }
  rightTouchDebounce = rightTouch;  //Save last state
  //Reset debounce time if there was a press or noise
  lastInvLDebTime = debounceTimeUpdate(invalidLeft, invalidLeftDebounce, lastInvLDebTime);
  //If that reading has been there for the set time, it was a press not just noise
  if (invalidLeft == HIGH && debounceCheck(lastInvLDebTime)) {
    paused = true;
  }
  invalidLeftDebounce = invalidLeft;  //Save last state
  //Reset debounce time if there was a press or noise
  lastInvRDebTime = debounceTimeUpdate(invalidRight, invalidRightDebounce, lastInvRDebTime);
  //If that reading has been there for the set time, it was a press not just noise
  if (invalidRight == HIGH && debounceCheck(lastInvRDebTime)) {
    paused = true;
  }
  invalidRightDebounce = invalidRight;  //Save last state
}

void sendLEDsTimerPeriod() {
  /*Send string like:
  * start;time(in ms);paused;period;leftYellow;leftRed;rightYellow;rightRed;leftPriority;rightPriority;autoPoints;editingTime;buzzerPattern;end\n
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
  message += String(editingTime) + messageSeparator;
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