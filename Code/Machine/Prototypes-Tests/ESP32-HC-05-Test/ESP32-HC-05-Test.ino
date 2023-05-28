#include <SoftwareSerial.h>
const uint8_t btSerialRX = 19;
const uint8_t btSerialTX = 23;

//Create software seria port
EspSoftwareSerial::UART BTSerial;

void setup() {
  Serial.begin(9600);
  BTSerial.begin(9600, SWSERIAL_8N1, btSerialRX, btSerialTX, false);
}
void loop() {
  if (BTSerial.available()) {
    Serial.write(BTSerial.read());
  }
  if (Serial.available()) {
    BTSerial.write(Serial.read());
  }
}