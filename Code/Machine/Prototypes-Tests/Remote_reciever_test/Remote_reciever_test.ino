#include <RH_ASK.h>
#include <SPI.h> // Not used but needed to compile

RH_ASK receiver;

void setup()
{
  Serial.begin(9600);	// Debugging only
  while(!receiver.init()){
    Serial.println("init failed");
  }
  Serial.println("init successful");
}

void loop()
{
  uint8_t message[13];
  uint8_t messLen = sizeof(message);
  if (receiver.recv(message, &messLen)) // Non-blocking
  {
    // Message with a good checksum received, dump it.
    Serial.print("Message: ");
    Serial.println((char*)message);
  }
}