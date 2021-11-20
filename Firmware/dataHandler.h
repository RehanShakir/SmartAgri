#include <ArduinoJson.h>
DynamicJsonDocument doc(1024);

char jsonDoc[1024];
void genJSON(String temp = String("0.0"), String humid = String("0.0"), String pressure = String("0.0"), String soil_moisture = String("0.0"), String ec = String("0.0"), String ph = String("0.0"), String nitrogen = String("0.0"), String phosphorus = String("0.0"), String potassium = String("0.0"))
{

    // doc["Timestamp"] = String("12/2/2 03:11:33");
    // doc["MAC_Address"] =myMac;
    doc["FW_Version"] = String("v1.0");

    doc["macAddress"] = ss.getMacAddress();
    doc["Environment"][0]["Temperautre"] = temp.toFloat();
    doc["Environment"][0]["Humidity"] = humid.toFloat();
    doc["Environment"][0]["Atmospheric_Pressure"] = pressure.toFloat();

    doc["SoilParameters"][0]["Soil_Moisture"] = soil_moisture.toFloat();
    doc["SoilParameters"][0]["EC"] = ec.toFloat();
    doc["SoilParameters"][0]["pH"] = ph.toFloat();
    doc["SoilParameters"][0]["Nitrogen"] = nitrogen.toFloat();
    doc["SoilParameters"][0]["Phosphorus"] = phosphorus.toFloat();
    doc["SoilParameters"][0]["Potassium"] = potassium.toFloat();
    serializeJson(doc, Serial);
}

void sendData(String temp = String("0.0"), String humid = String("0.0"), String pressure = String("0.0"), String soil_moisture = String("0.0"), String ec = String("0.0"), String ph = String("0.0"), String nitrogen = String("0.0"), String phosphorus = String("0.0"), String potassium = String("0.0"))
{
    genJSON(temp, humid, pressure, soil_moisture, ec, ph, nitrogen, phosphorus, potassium);
    serializeJson(doc, jsonDoc);
    String topicP = String("data/") + ss.getMacAddress();
    Serial.print("Publishing on: ");
    Serial.println(topicP);
    mqttClient.publish(topicP.c_str(), jsonDoc);
    mqttClient.publish("mac/add/ress", jsonDoc);
}