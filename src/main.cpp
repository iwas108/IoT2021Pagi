#include <Arduino.h>
#include <WiFi.h>

const char* WIFI_SSID = "Wifi_Undiknas 3D";
const char* WIFI_PASS = "";
const char* HOSTNAME = "IOTPAGIESP32";

void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  WiFi.setHostname(HOSTNAME);
  
  Serial.print("Connecting to WiFi");
  while(WiFi.status() != WL_CONNECTED) 
  {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("");
  Serial.println("WiFi connected successfully.");

}

void loop() {
  // put your main code here, to run repeatedly:
}