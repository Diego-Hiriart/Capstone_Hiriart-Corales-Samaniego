const int leftLed=2;
const int rightLed=3;
int leftTouch=0;
int rightTouch=0;
const String messageStartDelimiter = "s";
const String messageEndDelimiter = "e\n";
const int messageLength = 8;

void setup() {
  // put your setup code here, to run once:
  pinMode(leftLed, OUTPUT);
  pinMode(rightLed, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  serialReceive();
  ledControl();
}

void serialReceive(){
  //Read string like start;left;right;end e.g. s;0;1;e
  if(Serial.available() >= 8){
    String nodeMCUMessage = "";
    while(!nodeMCUMessage.endsWith(messageEndDelimiter)){
      nodeMCUMessage += (char)Serial.read();
    }
    Serial.write(nodeMCUMessage.c_str());
    if(nodeMCUMessage.startsWith(messageStartDelimiter) && nodeMCUMessage.endsWith(messageEndDelimiter) 
    && nodeMCUMessage.length() == messageLength){
      String leftValue = nodeMCUMessage.substring(2, 3);
      String rightValue = nodeMCUMessage.substring(4, 5);
      leftTouch=leftValue.toInt();
      rightTouch=rightValue.toInt();
      String readValues = "left: "+String(leftTouch)+", right: "+String(rightTouch)+"\n";
      Serial.write(readValues.c_str());
  }
  }
}

void ledControl(){
  digitalWrite(leftLed, leftTouch);
  digitalWrite(rightLed, rightTouch);
  delay(1000);
  leftTouch=0;
  rightTouch=0;
  digitalWrite(leftLed, leftTouch);
  digitalWrite(rightLed, rightTouch);
}
