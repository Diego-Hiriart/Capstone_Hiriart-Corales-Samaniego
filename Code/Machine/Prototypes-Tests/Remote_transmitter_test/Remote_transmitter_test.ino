#include <RH_ASK.h>
#include <SPI.h> // Not actually used but needed to compile

RH_ASK driver;

void setup()
{
  Serial.begin(9600);	  // Debugging only
  if (!driver.init()){
     Serial.println("init failed");
  }
}

void loop()
{
    const char *msg = "1-55";
    driver.send((uint8_t *)msg, strlen(msg));
    driver.waitPacketSent();
    Serial.print((int)msg[0]);
    Serial.print((int)msg[1]);
    Serial.print((int)msg[2]);
    Serial.println((int)msg[3]);
    delay(1000);
}