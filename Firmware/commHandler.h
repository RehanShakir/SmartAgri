#include <ModbusMaster.h>

// instantiate ModbusMaster object
#define MAX485_DE 12
#define MAX485_RE_NEG 14

// instantiate ModbusMaster object
ModbusMaster node;
const byte nitro[] = {0x01, 0x03, 0x00, 0x1e, 0x00, 0x01, 0xe4, 0x0c};
const byte phos[] = {0x01, 0x03, 0x00, 0x1f, 0x00, 0x01, 0xb5, 0xcc};
const byte pota[] = {0x01, 0x03, 0x00, 0x20, 0x00, 0x01, 0x85, 0xc0};
byte values[11];
void preTransmission()
{
    digitalWrite(MAX485_RE_NEG, 1);
    digitalWrite(MAX485_DE, 1);
}

void postTransmission()
{
    digitalWrite(MAX485_RE_NEG, 0);
    digitalWrite(MAX485_DE, 0);
}

void setupCommsHandler()
{
    pinMode(MAX485_RE_NEG, OUTPUT);
    pinMode(MAX485_DE, OUTPUT);
    // Init in receive mode
    digitalWrite(MAX485_RE_NEG, 0);
    digitalWrite(MAX485_DE, 0);

    // Modbus communication runs at 115200 baud
    Serial2.begin(9600);

    // Modbus slave ID 1
    node.begin(1, Serial2);
    // Callbacks allow us to configure the RS485 transceiver correctly
    node.preTransmission(preTransmission);
    node.postTransmission(postTransmission);
}

bool state = true;

String readN()
{
    uint8_t result;
    uint16_t data[6];
    String val = "";

    // Toggle the coil at address 0x0002 (Manual Load Control)
    for (int i = 0; i < 8; i++)
    {
        result = node.writeMultipleCoils(nitro[i], state);
    }
    state = !state;

    // Read 11 registers starting at 0x3100)
    result = node.readInputRegisters(0x04, 1);
    if (result == node.ku8MBSuccess)
    {
        Serial.print("N: ");
        val = String(node.getResponseBuffer(0x04));
        Serial.println(val);
    }

    delay(10);
    return val;
}

String readP()
{
    uint8_t result;
    uint16_t data[6];
    String val = "";

    // Toggle the coil at address 0x0002 (Manual Load Control)
    for (int i = 0; i < 8; i++)
    {
        result = node.writeMultipleCoils(phos[i], state);
    }
    state = !state;

    // Read 11 registers starting at 0x3100)
    result = node.readInputRegisters(0x04, 1);
    if (result == node.ku8MBSuccess)
    {
        Serial.print("N: ");
        val = String(node.getResponseBuffer(0x04));
        Serial.println(val);
    }

    delay(10);
    return val;
}
String readK()
{
    uint8_t result;
    uint16_t data[6];
    String val = "";

    // Toggle the coil at address 0x0002 (Manual Load Control)
    for (int i = 0; i < 8; i++)
    {
        result = node.writeMultipleCoils(pota[i], state);
    }
    state = !state;

    // Read 11 registers starting at 0x3100)
    result = node.readInputRegisters(0x04, 1);
    if (result == node.ku8MBSuccess)
    {
        Serial.print("N: ");
        val = String(node.getResponseBuffer(0x04));
        Serial.println(val);
    }

    delay(10);
    return val;
}
String getNPK()
{
    String v = readN() + String(";") + readP() + String(";") + readK();
    return v;
}