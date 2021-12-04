void MQTTUnSubscribe();
void MQTTSubscriptions();
void callback(char *topic, byte *payload, unsigned int length);
void reconnect();
bool mqttConnect();
void mqttPublish(String path, String msg);
int deviceExisits = 0;
IPAddress ip(34, 214, 65, 82);
String topicN = String("smart-agri/deviceExistance");
String topicR = ss.getMacAddress() + String("/relay");
String topicS = ss.getMacAddress() + String("/settings");
void MQTTUnSubscribe()
{
    // String topicN = String("smart-agri/deviceExistance");
    // String topicR = ss.getMacAddress() + String("/relay");
    // String topicS = ss.getMacAddress() + String("/settings");

    mqttClient.unsubscribe(topicN.c_str());
    mqttClient.unsubscribe(topicR.c_str());
    mqttClient.unsubscribe(topicS.c_str());
}
void MQTTSubscriptions()
{
    //mqttClient.subscribe("SmartTControl/data/v");

    // for(int i=0;i<10;i++){
    //   IMEIsList[i]==String("NA");
    // }

    mqttClient.subscribe(topicN.c_str());
    mqttClient.subscribe(topicR.c_str());
    mqttClient.subscribe(topicS.c_str());
}
void callback(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    String pLoad = "";
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
        pLoad = pLoad + String((char)payload[i]);
    }
    Serial.println();
    if (String(topic) == String("smart-agri/deviceExistance"))
    {
        if (pLoad.indexOf("null") >= 0)
        {
            //create new device
            mqttPublish("smart-agri/createNew", ss.getMacAddress() + String(";0;0;0;0;0;0;0;0;0;0;0")); //create an empty device
            deviceExisits = 1;
        }
        else
        {
            deviceExisits = 1;
        }
    }
    else if (String(topic) == topicR)
    {
        if (pLoad.indexOf("1") >= 0)
        {
            digitalWrite(R1, !digitalRead(R1));
        }
        if (pLoad.indexOf("2") >= 0)
        {
            digitalWrite(R2, !digitalRead(R2));
        }
        if (pLoad.indexOf("3") >= 0)
        {
            digitalWrite(R3, !digitalRead(R3));
        }
    }

    else if (String(topic) == topicS)
    {
        if (pLoad.indexOf("soil_sensor=") >= 0)
        {
            String temp = ss.StringSeparator(pLoad, '=', 1);
            String lowV = ss.StringSeparator(temp, ',', 0);
            String highV = ss.StringSeparator(temp, ',', 1);
            soil_sensorCalibValues[0] = lowV.toInt();
            soil_sensorCalibValues[1] = highV.toInt();
        }
        else if (pLoad.indexOf("device_operation=") >= 0)
        {
            if (pLoad.indexOf("restart=") >= 0)
            {
                ESP.reset();
            }
        }
    }

    // Switch on the LED if an 1 was received as first character

    pLoad = "";
}
void reconnect()
{
    // Loop until we're reconnected
    while (!mqttClient.connected())
    {
        Serial.print("Attempting MQTT connection...");
        // Create a random client ID
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);
        // Attempt to connect
        if (mqttClient.connect(clientId.c_str(), mqtt_user, mqtt_pass))
        {
            Serial.println("Established:" + String(clientId));
            //mqttClient.subscribe("SmartTControl/data/v");
            MQTTSubscriptions();
            // return true;
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}
bool mqttConnect()
{
    static const char alphanum[] = "0123456789"
                                   "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                   "abcdefghijklmnopqrstuvwxyz"; // For random generation of client ID.
    char clientId[9];

    uint8_t retry = 3;
    while (!mqttClient.connected())
    {
        if (String(mqtt_server).length() <= 0)
            break;

        mqttClient.setServer(ip, 1883);
        mqttClient.setCallback(callback);
        Serial.println(String("Attempting MQTT broker:") + String("smart-agri Broker"));
        internetStatus = "Connecting...";

        for (uint8_t i = 0; i < 8; i++)
        {
            clientId[i] = alphanum[random(62)];
        }
        clientId[8] = '\0';

        if (mqttClient.connect(clientId, mqtt_user, mqtt_pass))
        {
            Serial.println("Established:" + String(clientId));
            internetStatus = "Connected";
            //mqttClient.subscribe("SmartTControl/data/v");
            MQTTSubscriptions();
            return true;
        }
        else
        {
            Serial.println("Connection failed:" + String(mqttClient.state()));
            internetStatus = "Not-Connected. Retrying...";
            if (!--retry)
                break;
            delay(3000);
        }
    }
    return false;
}

void mqttPublish(String path, String msg)
{
    //String path = String("channels/") + channelId + String("/publish/") + apiKey;
    mqttClient.publish(path.c_str(), msg.c_str());
}