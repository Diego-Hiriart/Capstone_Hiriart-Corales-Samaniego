const int inputLeft=D1;
const int inputRight=D2;
int leftTouch=0;
int rightTouch=0;

void setup() {
  // put your setup code here, to run once:
  pinMode(inputLeft, INPUT);
  pinMode(inputRight, INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  fencerTouch();
  serialSend();
}

void fencerTouch(){
  //Check if a touch was made
  leftTouch = digitalRead(inputLeft);
  rightTouch = digitalRead(inputRight);  
}

void serialSend(){
  //Send latest data
  String message = "s;";//Follow this format: start;leftFencer;rightFencer;end e.g. s;1;0;e
  message += String(leftTouch)+";";
  message += String(rightTouch)+";";
  message += "e";
  message += "\n";
  int charMessageLength = message.length()+1;
  char serialMessage[charMessageLength];
  message.toCharArray(serialMessage, charMessageLength);
  Serial.write(serialMessage);
  leftTouch=0;
  rightTouch=0;  
}