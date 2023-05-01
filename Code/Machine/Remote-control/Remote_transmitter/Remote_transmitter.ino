#include <RH_ASK.h>
#include <SPI.h> // Not actually used but needed to compile

//Declare input pins for buttons
const uint8_t block=1;
const uint8_t pAuto=0;
const uint8_t yCardL=2;
const uint8_t rCardL=3;
const uint8_t decLeft=4;
const uint8_t incLeft=5;
const uint8_t oneMin=6;
const uint8_t incTime=7;
const uint8_t resetMch=8;
const uint8_t syncRemote=9;
const uint8_t pManual=10;
const uint8_t yCardR=11;
const uint8_t rCardR=12;
const uint8_t incPeriod=13;
const uint8_t decRight=A0;
const uint8_t incRight=A1;
const uint8_t threeMin=A2;
const uint8_t decTime=A3;
const uint8_t cyleTime=A4;
const uint8_t pauseRes=A6;//Will be read as analog
const uint8_t upload=A7;//Will be read as analog
//Declare TX pin for RF
const uint8_t RFTransmitterPin=A5;//Digital
//Controller's ID
const uint32_t remoteId=1;//Must be diferent for every controller
//To store which button was just pressed
int8_t buttonReset=-1;//-1 because 0 is for pin 0
int8_t pressedButton=buttonReset;
//Analog HIGH voltage
uint8_t analogLow=614;
//Time for debounce check
uint8_t debounceDelay=50;
//Last status for debounce check
uint8_t lastPinStatus=LOW;


//Create transmitter instance, keep defaults except for TX pin (A7)
RH_ASK transmitter(2000, 11, RFTransmitterPin, 99);//pttpIn must be set to a non existing or unused pin, or it will write LOW always

void setup()
{
  //Start RF
  transmitter.init();
  //Debugging only, doesnt let pins 0 and 1 work as buttons
  /*Serial.begin(9600);
  while(!transmitter.init()){
    Serial.println("init failed");
  }*/
  //Set button pins for input
  pinMode(block, INPUT_PULLUP);
  pinMode(pAuto, INPUT_PULLUP);
  pinMode(yCardL, INPUT_PULLUP);
  pinMode(rCardL, INPUT_PULLUP);
  pinMode(decLeft, INPUT_PULLUP);
  pinMode(incLeft, INPUT_PULLUP);
  pinMode(oneMin, INPUT_PULLUP);
  pinMode(incTime, INPUT_PULLUP);
  pinMode(resetMch, INPUT_PULLUP);
  pinMode(syncRemote, INPUT_PULLUP);
  pinMode(pManual, INPUT_PULLUP);
  pinMode(yCardR, INPUT_PULLUP);
  pinMode(rCardR, INPUT_PULLUP);
  //Since it is connected to the builtin LED, pin 13 must be used as INPUT with a pull down resistor
  pinMode(incPeriod, INPUT);
  pinMode(decRight, INPUT_PULLUP);
  pinMode(incRight, INPUT_PULLUP);
  pinMode(threeMin, INPUT_PULLUP);
  pinMode(decTime, INPUT_PULLUP);
  pinMode(cyleTime, INPUT_PULLUP);
  //Pints A6 and A7 are read as analog 
}

void loop()
{
  pressedButton=buttonReset;//Reset press
  checkButtonPress();
  debounce();
  if(pressedButton!=buttonReset){
    transmit();
  }
}

void checkButtonPress(){
  if(digitalRead(block)==LOW){
    updateButtonStatuses(block, LOW);
  }
  if(digitalRead(pAuto)==LOW){
    updateButtonStatuses(pAuto, LOW);
  }
  if(digitalRead(yCardL)==LOW){
    updateButtonStatuses(yCardL, LOW);
  }
  if(digitalRead(rCardL)==LOW){
    updateButtonStatuses(rCardL, LOW);
  }
  if(digitalRead(decLeft)==LOW){
    updateButtonStatuses(decLeft, LOW);
  }
  if(digitalRead(incLeft)==LOW){
    updateButtonStatuses(incLeft, LOW);
  }
  if(digitalRead(oneMin)==LOW){
    updateButtonStatuses(oneMin, LOW);
  }
  if(digitalRead(incTime)==LOW){
    updateButtonStatuses(incTime, LOW);
  }
  if(digitalRead(resetMch)==LOW){
    updateButtonStatuses(resetMch, LOW);
  }
  if(digitalRead(syncRemote)==LOW){
    updateButtonStatuses(syncRemote, LOW);
  }
  if(digitalRead(pManual)==LOW){
    updateButtonStatuses(pManual, LOW);
  }
  if(digitalRead(yCardR)==LOW){
    updateButtonStatuses(yCardR, LOW);
  }
  if(digitalRead(rCardR)==LOW){
    updateButtonStatuses(rCardR, LOW);
  }
  if(digitalRead(incPeriod)==HIGH){//High since it is pin 13
    updateButtonStatuses(incPeriod, HIGH);
  }
  if(digitalRead(decRight)==LOW){
    updateButtonStatuses(decRight, LOW);
  }
  if(digitalRead(incRight)==LOW){
    updateButtonStatuses(incRight, LOW);
  }
  if(digitalRead(threeMin)==LOW){
    updateButtonStatuses(threeMin, LOW);
  }
  if(digitalRead(decTime)==LOW){
    updateButtonStatuses(decTime, LOW);
  }
  if(digitalRead(cyleTime)==LOW){
    updateButtonStatuses(cyleTime, LOW);
  }
  if(analogRead(pauseRes)<=analogLow){//Check if analog reading indicates voltage close to LOW
    updateButtonStatuses(pauseRes, analogLow);
  }
  if(analogRead(upload)<=analogLow){
    updateButtonStatuses(upload, analogLow);
  }
}

void updateButtonStatuses(uint8_t pin, uint8_t value){
  pressedButton=pin;
  lastPinStatus=value;
}

void debounce(){
  //Wait to see if button was really pressed
  delay(debounceDelay);
  //Check if the button is still pressed after waiting, reset to 0 if it was noise
  if(pressedButton!=A6 && pressedButton!=A7){
    if(digitalRead(pressedButton)!=lastPinStatus){
      pressedButton=buttonReset;
    }
  }else{
    if(analogRead(pressedButton)>lastPinStatus){
      pressedButton=buttonReset;
    }
  }
}

void transmit(){
  String idStr = String(remoteId);
  String buttonStr = String(pressedButton);
  //Add needed zeros to substrings
  while(idStr.length()<10){
    idStr="0"+idStr;
  }
  while(buttonStr.length()<2){
    buttonStr="0"+buttonStr;
  }
  String message = idStr+'-'+buttonStr;
  const char *msg = message.c_str();
  //Serial.println(msg);
  transmitter.send((uint8_t *)msg, strlen(msg));
  transmitter.waitPacketSent();
}