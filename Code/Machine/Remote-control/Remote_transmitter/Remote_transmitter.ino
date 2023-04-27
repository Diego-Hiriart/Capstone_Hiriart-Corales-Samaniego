#include <RH_ASK.h>
#include <SPI.h> // Not actually used but needed to compile

const uint8_t block=0;
const uint8_t pAuto=1;
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
const uint8_t pauseRes=A5;
const uint8_t upload=A6;
const uint8_t RFTransmitterPin=A7;
const uint8_t pressedButton=0;
const uint32_t remoteId=0;

RH_ASK transmitter;

void setup()
{
    Serial.begin(9600);	  // Debugging only
    if (!transmitter.init()){
      Serial.println("init failed");
    }
}

void loop()
{
  checkButtonPress();
  if(pressedButton){
    transmit();
  }
}

void checkButtonPress(){

}

void transmit(){
  const char *msg = "1-55";
  transmitter.send((uint8_t *)msg, strlen(msg));
  transmitter.waitPacketSent();
}