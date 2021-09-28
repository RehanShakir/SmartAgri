int sensor_pin = 2;
int value;

void setupSoilMoisture()
{
}

String getSoilMoisture()
{

    value = analogRead(sensor_pin);
    value = map(value, 550, 0, 0, 100);
    Serial.print("Moisture : ");
    Serial.print(value);
    Serial.println("%");
    delay(10);
    return String(value);
}