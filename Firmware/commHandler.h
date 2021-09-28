
#define RXD2 16
#define TXD2 17
String dataV = "";
String tempValue = "";
String DataToSend = "";


void setupCommsHandler()
{
    Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
}
