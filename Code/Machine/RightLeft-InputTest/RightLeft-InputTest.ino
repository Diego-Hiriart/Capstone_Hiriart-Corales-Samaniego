const int leftLed=2;
const int rightLed=3;
const int inputLeft=6;
const int inputRight=7;
bool leftTouch=false;
bool rightTouch=false;

void setup() {
  // put your setup code here, to run once:
  pinMode(leftLed, OUTPUT);
  pinMode(rightLed, OUTPUT);
  pinMode(inputLeft, INPUT);
  pinMode(inputRight, INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  fencerTouch();
  serialControl();
  ledControl();
}

void fencerTouch(){
  if(digitalRead(inputLeft)==HIGH){
    leftTouch=true;
  }
  if(digitalRead(inputRight)==HIGH){
    rightTouch=true;
  }
}

void serialControl(){
  char serialMessage[20] = "";
  if(leftTouch){
    strcat(serialMessage, "left;");
  }
  if(rightTouch){
    strcat(serialMessage, "right;");
  }
  strcat(serialMessage, "00-00-00;");
  strcat(serialMessage, "\n");
  Serial.write(serialMessage);
}

void ledControl(){
  if(leftTouch){
    digitalWrite(leftLed, HIGH);
  }
  if(rightTouch){
    digitalWrite(rightLed, HIGH);
  }
  delay(1000);
  digitalWrite(leftLed, LOW);
  digitalWrite(rightLed, LOW);
  leftTouch=false;
  rightTouch=false;  
}