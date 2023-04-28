/*Prototype sketch for:
  - R/L inputs
  - Score counting
  - Time and period
  - Automatic/Manual points control
  - TX to Arduino
*/
const int inputLeft=D1;//GPIO5
const int inputRight=D2;//GPIO4
const int toggleButton=D3;//GPIO0
int leftScore=0;
int rightScore=0;
bool leftYellow = false;//These 4 will be implemented later, needed now for Nano's current prototype
bool rightYellow = false;
bool leftRed = false;
bool rightRed = false;
unsigned int displayTime = 0;//On-touch pause only, remote control pause to be implemented later 
int period = 0;//For now, increase whenever 3 minutes pass
bool autoPoints = false;

void setup() {
  // put your setup code here, to run once:
  pinMode(inputLeft, INPUT);
  pinMode(inputRight, INPUT);
  pinMode(toggleButton, INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  autoTouchToggle();
  fencerTouch();
  serialSend();
}

void autoTouchToggle(){
  if(digitalRead(toggleButton)==HIGH){
    autoPoints=!autoPoints;
  }
}

void fencerTouch(){
  //Check if a touch was made
  //Stop timer
  //Increase count if on automatic
  int leftTouch = digitalRead(inputLeft);
  int rightTouch = digitalRead(inputRight);
  if(autoPoints){
    leftScore += leftTouch;
    rightScore += rightTouch;
  }  
}

void serialSend(){
  //Send latest data
  //Follow this format: start;leftFencer;rightFencer;leftY;rightY;leftR;rightR;time;period;autoPoints;end e.g. s;1;0;e
  String message = "s;";
  message += String(leftScore)+";";
  message += String(rightScore)+";";
  message += String(leftYellow)+";";
  message += String(rightYellow)+";";
  message += String(leftRed)+";";
  message += String(rightRed)+";";
  message += String(displayTime)+";";
  message += String(period)+";";
  message += String(autoPoints)+";";
  message += "e";
  message += "\n";
  int charMessageLength = message.length()+1;
  char serialMessage[charMessageLength];
  message.toCharArray(serialMessage, charMessageLength);
  Serial.write(serialMessage);  
}