
#include <SPI.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme; // use I2C interface
Adafruit_Sensor *bme_temp = bme.getTemperatureSensor();
Adafruit_Sensor *bme_pressure = bme.getPressureSensor();
Adafruit_Sensor *bme_humidity = bme.getHumiditySensor();
uint8_t bmeConnected = 0;
int retryCount = 0;
void setupBME280()
{

    Serial.println(F("BME280 Sensor event test"));

    while (1)
    {
        retryCount++;
        if (retryCount >= 20)
        {
            break;
        }
        if (!bme.begin())
        {

            bmeConnected = 0;
        }
        else
        {
            bmeConnected = 1;
        }
    }

    if (bmeConnected == 1)
    {
        bme_temp->printSensorDetails();
        bme_pressure->printSensorDetails();
        bme_humidity->printSensorDetails();
    }
    else
    {
        Serial.println(F("Could not find a valid BME280 sensor, check wiring and restart!"));
    }
}

String getBMEVal()
{

    String BME_DATA = "0;0;0";
    if (bmeConnected == 1)
    {
        sensors_event_t temp_event, pressure_event, humidity_event;

        bme_temp->getEvent(&temp_event);
        bme_pressure->getEvent(&pressure_event);
        bme_humidity->getEvent(&humidity_event);

        Serial.print(F("Temperature = "));
        Serial.print(temp_event.temperature);
        Serial.println(" *C");
        BME_DATA += String(temp_event.temperature) + String(";");

        Serial.print(F("Humidity = "));
        Serial.print(humidity_event.relative_humidity);
        BME_DATA += String(humidity_event.relative_humidity) + String(";");
        Serial.println(" %");

        Serial.print(F("Pressure = "));
        Serial.print(pressure_event.pressure);
        BME_DATA += String(pressure_event.pressure) + String(";");
        Serial.println(" hPa");

        Serial.println();
        delay(1);
        return BME_DATA;
    }
    else
    {
        return BME_DATA;
    }
}