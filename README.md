<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="artwork/SmartAgri.png" alt="Project logo"></a>
</p>

<h3 align="center">SmartAgri</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()


</div>

---


<p align="center"> SmartAgri
    <br> 
</p>


## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Circuit](#circuit)
- [Server Details](#server)
- [MQTT Topic Details](#mqtt)
- [API Details](#api)
- [Usage](#usage)
- [List Of Components](#list)
- [Built Using](#built_using)
- [Authors](#authors)


## 🧐 About <a name = "about"></a>

This repo contains

- Backend
- Firmware
- Client auto-Installer script
- Detailed instructions

for Smart SmartAgri.



## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your system.

### Prerequisites

Things you need to install the FW.

```
- Arduino IDE
```

### Installing <a name = "installing"></a>

A step by step series that tell you how to get the Firmware and Backend running

#### ESP32 Configuration

You should have Arduino IDE Installed

  1.  Add ESP32 Board to your Arduino IDE
    1. In your Arduino IDE, go to File> Preferences
        Installing ESP32 Add-on in Arduino IDE Windows, Mac OS X, Linux open preferences
    2. Enter ```https://dl.espressif.com/dl/package_esp32_index.json``` 
        into the “Additional Board Manager URLs” field then, click the “OK” button:
        Note: if you already have the ESP32 boards URL, you can separate the URLs with a comma(each board will go to neaw line) as follows:
        ```https://dl.espressif.com/dl/package_esp32_index.json,\n http://arduino.esp8266.com/stable/package_esp8266com_index.json```
    
    
  2. Open the Boards Manager. Go to Tools > Board > Boards Manager…
  3. Search for ESP32 and press install button for the ESP32 by Espressif Systems“:
  4. That’s it. It should be installed after a few seconds.
  5.   In your Arduino sketchbook directory, create tools directory if it doesn't exist yet.
  6.  Unpack the tool into tools directory(present in libs/ESP32FS-1.0.zip) (the path will look like <home_dir>/Arduino/tools/ESP32FS/tool/esp32fs.jar).
  7.  Close and re-open the Arduino IDE.

  8.  Now copy the contents of the libs folder to the libraries directory of your Arduino
      1. If you are using windows, the libraries directory will be Documents/Arduino/libraries

##### ESP32 Node FW Uploading
  1.  Select ESP32 Dev Module from Tools->Board->ESP32
  2.  Select the correct port from Tools->Port
  3.  Then open Firmware.ino file,
  4.  Select Tools > ESP32 Sketch Data Upload menu item. This should start uploading the files into ESP32 flash file system.
  5.  Now Upload the Code to your ESP32 Dev Module.
  6.  Your ESP32 is now ready to be used.


## Circuit <a name = "circuit"></a>


### ESP32 Dev Module Pinout


Follow the pinout diagram given below to connect different components to your ESP32 Dev Module board.

![Pinout](Circuit/ESP32-Pinout.jpg)

### Complete Circuit Diagram

Here's the complete circuit diagram of the system.

![CircuitDiagram](Circuit/Circuit_bb.png)


## Server Details <a name = "server"></a>

```diff 
- [THIS SETCTION WILL BE IMPLEMENTED/UPDATED IN THE UPCOMING MILESTONES]
```` 

### Monitoring

- pm2 list
- pm2 monit

### List of Packages installed on server

- Mosquitto Broker
- NodeJS, NPM, Node, NVM
- PM2
- ufw
- mongod
- mongo-express
### Version Details

- Node v12.16.1
- NPM v6.13.4

### Server Links <a name = "srv"></a>

- MQTT Broker Link: hivemq.com
- Backend Link: 
- Frontend Link: 

### Backend

- Backend is based on NodeJS and it is being managed by PM2. It starts automatically on server start.

## MQTT Topic Details <a name = "mqtt"></a>
```diff 
- [THIS SETCTION WILL BE IMPLEMENTED/UPDATED IN THE UPCOMING MILESTONES]
```` 
### Topics List
#### Logs
1.  <span style="color: green">smart-agri/logs</span> `(all log messages are published to this topic) READ-ONLY`

#### Fimrware

1.  <span style="color: green">smart-agri/deviceExists</span> `(Publish DeviceMAC on this topic to check if device exisits in DB) WRITE-ONLY`
    1.  <span style="color: green">smart-agri/deviceExistance</span> `(Response from the above command {null or device MAC}) READ-ONLY`
2.  
3.   <span style="color: green">smart-agri/createNew</span> `(Publish data to create a new device in DB.) WRITE-ONLY`
    - Data Format: DeviceMAC;SENSORS_LIST
4.  <span style="color: green">smart-agri/updateDevice</span> `(Publish data to update a device in DB based on its MAC Address.) WRITE-ONLY`
    - Data Format: DeviceMAC;SENSORS_LIST


## API Details <a name = "api"></a>
```diff 
- [THIS SETCTION WILL BE IMPLEMENTED/UPDATED IN THE UPCOMING MILESTONES]
```` 


<!-- ### Admin Login

```http
POST http://34.214.65.82:8080/v1/loginAdmin
```

| Parameter | Type | Description | 
| :--- | :--- | :--- |
| `Email` | `string` | **Required**.  *Email address of the admin*|
| `Password` | `string` | **Required**.  *Password of the admin*|

### Update Admin

```http
POST http://34.214.65.82:8080/v1/updateAdmin
```

| Parameter | Type | Description | 
| :--- | :--- | :--- |
| `Email` | `string` | **Required**.  *Email address of the admin*|
| `Password` | `string` | **Required**.  *Password of the admin*|

### List Admins

```http
GET http://34.214.65.82:8080/v1/listAll
```

| Parameter | Type | Description | 
| :--- | :--- | :--- |
```nothing```

### Ledger Log

```http
POST http://34.214.65.82:8080/v1/ledgerLog
```

| Parameter | Type | Description | 
| :--- | :--- | :--- |
```nothing```

### Add New Device

```http
POST http://34.214.65.82:8080/v1/addNewDevice
```

| Parameter | Type | Description | 
| :--- | :--- | :--- |
| `DeviceMAC` | `string` | **Required**.  *Email address of the Device*|
| `StartSession` | `string` | **Required**.  *StartSession of the Device*|
| `EndSession` | `string` | **Required**.  *EndSession of the Device*|
| `EndSessionType` | `string` | **Required**.  *EndSessionType of the Device*|
| `Temperature` | `string` | **Required**.  *Temperature of the Device*|
| `SensorFilters` | `string` | **Required**.  *SensorFilters of the Device*|
| `LampMaintenance` | `string` | **Required**.  *LampMaintenance of the Device*|
| `AnnualMaintenance` | `string` | **Required**.  *AnnualMaintenance of the Device*|
| `PowerFactorCorrection` | `string` | **Required**.  *PowerFactorCorrection of the Device*|
| `AnemometerSensor` | `string` | **Required**.  *AnemometerSensor of the Device*|
| `InputVoltage` | `string` | **Required**.  *InputVoltage of the Device*|
| `PresencePhases` | `string` | **Required**.  *PresencePhases of the Device*|
| `Timestamp` | `string` | **NOT Required**.  *Timestamp of the Device*| -->


### Responses
```diff 
- [THIS SETCTION WILL BE IMPLEMENTED/UPDATED IN THE UPCOMING MILESTONES]
```` 

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, Gophish returns a JSON response in the following format:

```javascript
{
  "status"  : int,
  "message" : string
}
```
The `message` attribute contains a message commonly used to indicate errors or to return the logged status/

The `status` attribute describes if the transaction was successful or not.


### Status Codes

IoTManagementSystem Backend returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

## Usage <a name = "usage"></a>

1.  Upload the code to your ESP32.
2.  Open the dashboard to monitor the parameters.
    1.  Dashboard Default credentials
        1.  Email Address: **admin@admin.com**
        2.  Password: **admin**

Dashboard Login Page![SCRD1](Circuit/scrd1.png)
Dashboard Home Page![SCRD2](Circuit/scrd2.png)
Dashboard Profile Page![SCRD3](Circuit/scrd3.png)
3.  You can also download the logs in CSV format from the dashboard home page.
4.  Power on your ESP32, it will present you with an AP named ```SmartA-abc``` (while ```SmartA``` can be changed in the portal and ```abc``` is a unique id for each esp32)
5.  Default captive portal password `12345678AP` which can be changed in captive portal.
6.  Connect to the ESP32 access point and open the web-browser and navigate to the link ```http://esp32.local/_ac```. This link will work on most of the operating systems but if your operating system is not allowing to open it, you may want to check the captive portal IP Address from the serial monitor and can use that IP address inplace of the above mentioned URL.
7.  The default access IP Address is ```http://192.168.4.1/_ac```
8.  You will be presented with a main dashboard as shown below(based on your device)
   ![SCR1](Circuit/scr1.png)

9.  Once connected to a WiFi network, you can again access the captive portal using same URL or the IP Address from the Serial monitor.
10.  The data is published to the MQTT Topic ```SmartA/{hostname}``` while the hostname is the one which you can define in Settings page of the captive portal.
11.  You can open settings page with following default credentials
    1.  User: **AP Name (SmartA)**
    2.  Password: **admin**

## List of Components <a name = "list"></a>

Following components are used to make this project

1.  ESP32 Dev Module
    ○ https://www.amazon.com/ESP32-WROOM-32-Development-ESP-32S-Bluetoot
    h-Arduino/dp/B084KWNMM4/ref=sr_1_10?dchild=1&keywords=esp32+dev+
    module&qid=1631286335&sr=8-10
2.  Atmospheric Temperature and Humidity Sensor (BME280)
    ○ https://www.amazon.com/HiLetgo-Temperature-Humidity-Electronic-Practice
    /dp/B0795F19W6/ref=sr_1_2?dchild=1&keywords=dht22&qid=1631286498&s
    r=8-2
3.  Capacitive Soil Moisture Sensor
    ○ https://www.amazon.com/Icstation-Resistive-Soil-Moisture-Sensor/dp/B076D
    DWDJK/ref=sr_1_7?dchild=1&keywords=soil+moisture+sensor&qid=1631286
    644&sr=8-7
4.  NPK Sensor
    ○ https://www.amazon.com/Neufday-Precision-Nutrient-Intelligent-Fertilizer/d
    p/B0836WYNJ1/ref=sr_1_2?dchild=1&keywords=soil+npk+sensor&qid=16312
    86692&sr=8-2
5.  TTL to RS485 Converter
    ○ https://www.amazon.com/HiLetgo-Reciprocal-Hardware-Automatic-Converter/dp/B082Y19KV9/ref=sr_1_2?crid=1GFISE1RJQ65Z&dchild=1&keywords=ttl+to+rs485+converter&qid=1632822148&sprefix=ttl+to+rs485+co%2Caps%2C728&sr=8-2
6.  Soil pH Sensor
    ○ https://www.amazon.com/Taidacent-Detector-Agricultural-Phosphorus-Potas
    sium/dp/B08MXVSKG9/ref=sr_1_1?dchild=1&keywords=soil%2Bph%2Bsensor
    &qid=1631286952&sr=8-1&th=1
7.  Soil EC Sensor
    ○ https://www.amazon.com/Taidacent-Detector-Agricultural-Phosphorus-Potas
    sium/dp/B08MXVSKG9/ref=sr_1_1?dchild=1&keywords=soil%2Bph%2Bsensor
    &qid=1631286952&sr=8-1&th=1
8.  9V 5A Adapter
    ○ https://www.amazon.com/Supply-Adapter-Converter-Regulator-Monitor/dp/
    B0888DQ343/ref=sr_1_4?dchild=1&keywords=9v+5a+dc+adapter&qid=16312
    87139&sr=8-4
9.  9V to 5V Buck Converter
    ○ https://www.amazon.com/UCTRONICS-Converter-Transformer-Voltage-Regul
    ator/dp/B07XXWQ49N/ref=sr_1_1?dchild=1&keywords=9v+to+5v+step+down
    +converter&qid=1631287177&sr=8-1


## ⛏️ Built Using <a name = "built_using"></a>

- [NodeJS](https://nodejs.org/en/) - JS Framework for Backend Programming
- [Eclipse Paho MQTT](https://www.eclipse.org/paho/index.php?page=clients/python/index.php) - MQTT Client for Backend and RPiClient Software
- [Arduino](https://www.arduino.cc/) - Embedded Framework and IDE - For Sensor Node Design
- [VueJS](https://vuejs.org/) - For Dashboard Design


## ✍️ Authors <a name = "authors"></a>

- [@Nauman3S](https://github.com/Nauman3S) - Development and Deployment
