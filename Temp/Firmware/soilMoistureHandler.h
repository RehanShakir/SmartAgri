int sensor_pin = 2;
int value;

void setupSoilMoisture()
{
}

String getSoilMoisture()
{

    value = analogRead(sensor_pin);
    value = map(value, soil_sensorCalibValues[0], soil_sensorCalibValues[1], 0, 100);
    Serial.print("Moisture : ");
    Serial.print(value);
    Serial.println("%");
    delay(1);
    return String(value);
}