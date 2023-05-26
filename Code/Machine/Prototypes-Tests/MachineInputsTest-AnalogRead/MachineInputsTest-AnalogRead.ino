//Test analog read of machine input
//Hiriart Corales Samaniego
const uint8_t rightTouchPin = 36;
const uint8_t leftTouchPin = 39;
const uint8_t invalidTouchPin = 34;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  readVoltages();
  delay(2500);
}

void readVoltages(){
  Serial.print("Right voltage: ");
  Serial.println(analogRead(rightTouchPin));
  Serial.print("Left voltage: ");
  Serial.println(analogRead(leftTouchPin));
  Serial.print("Invalid voltage: ");
  Serial.println(analogRead(invalidTouchPin));
  Serial.println("-----------------");
}
