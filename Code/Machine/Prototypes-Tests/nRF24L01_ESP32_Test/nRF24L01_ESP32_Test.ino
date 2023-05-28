#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

//RF receiver pins, IRQ pin (interrupt) is not needed
const uint8_t nRF24L01CLKPin  = 18;  //RF CLK
const uint8_t nRF24L01MOSIPin = 23;   //RF MOSI (data out)
const uint8_t nRF24L01MISOPin = 19;   //RF MOSI (data out)
const uint8_t nRF24L01CEPin = 4;   //RF CS
const uint8_t nRF24L01CSNPin = 5;   //RF CSN

//Radio transmitter instance and channel
RF24 radioRX(nRF24L01CEPin, nRF24L01CSNPin); // CE, CSN
const byte address[6] = "46920";

void setup() {
  Serial.begin(9600);
  radioRX.begin();
  radioRX.openReadingPipe(0, address);
  radioRX.setDataRate(RF24_1MBPS);
  radioRX.setPALevel(RF24_PA_HIGH);//-6dBM power amplifier
  radioRX.setAutoAck(false);//Disable message ACK so it can read from any TX and just the id gets checked
  radioRX.startListening();
}

void loop() {
  if (radioRX.available()) {
    char text[18] = "";
    radioRX.read(&text, sizeof(text));
    Serial.println(text);
  }
}