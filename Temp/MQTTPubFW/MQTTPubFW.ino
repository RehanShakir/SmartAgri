/*
 Basic ESP8266 MQTT example
 This sketch demonstrates the capabilities of the pubsub library in combination
 with the ESP8266 board/library.
 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off
 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.
 To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"
*/
#define BUILTIN_LED 2
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "SoftwareStack.h"

// Update these with values suitable for your network.

const char* ssid = "hotspot2";
const char* password = "abc123098a#";
const char* mqtt_server = "broker.hivemq.com";
IPAddress ip(34,214,65,82);
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(50)
char msg[MSG_BUFFER_SIZE];
int value = 0;
//StaticJsonDocument<256> doc;
DynamicJsonDocument doc(1024);
SoftwareStack ss;
String myMac="";


void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  myMac=ss.getMacAddress();
  Serial.println(myMac);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1') {
    digitalWrite(BUILTIN_LED, LOW);   // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else {
    digitalWrite(BUILTIN_LED, HIGH);  // Turn the LED off by making the voltage HIGH
  }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("outTopic", "hello world");
      // ... and resubscribe
     // client.subscribe("inTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(ip, 1883);
  client.setCallback(callback);
}

char jsonDoc[1024];
void genJSON(){

    // doc["Timestamp"] = String("12/2/2 03:11:33");
    // doc["MAC_Address"] =myMac;
    doc["FW_Version"] = String("v1.0");
    
    
    
    doc["Environment"][0]["Temperautre"]=12.1;
    doc["Environment"][0]["Humidity"]=54;
    doc["Environment"][0]["Atmospheric_Pressure"]=37.78;
    
    doc["SoilParameters"][0]["Soil_Moisture"]=5.44;
    doc["SoilParameters"][0]["EC"]=87.52;
    doc["SoilParameters"][0]["pH"]=47.31;
    doc["SoilParameters"][0]["Nitrogen"]=54.64;
    doc["SoilParameters"][0]["Phosphorus"]=97.13;
    doc["SoilParameters"][0]["Potassium"]=51.03;
    serializeJson(doc, Serial);
}
void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > (60*1000)) {
    lastMsg = now;
  
    genJSON();
    serializeJson(doc, jsonDoc);
    String topicP=String("data/")+myMac;
    Serial.print("Publishing on: ");
    Serial.println(topicP);
    client.publish(topicP.c_str(), jsonDoc);
    client.publish("mac/add/ress", jsonDoc);
    
  }
}
