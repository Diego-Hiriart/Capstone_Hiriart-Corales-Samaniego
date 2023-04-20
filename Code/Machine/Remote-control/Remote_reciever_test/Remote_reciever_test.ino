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
  uint8_t buf[14];
  uint8_t buflen = sizeof(buf);
  if (receiver.recv(buf, &buflen)) // Non-blocking
  {
    // Message with a good checksum received, dump it.
    Serial.print("Message: ");
    Serial.print(buf[0]);
    Serial.print(buf[1]);
    Serial.print(buf[2]);
    Serial.println(buf[3]);
  }
}