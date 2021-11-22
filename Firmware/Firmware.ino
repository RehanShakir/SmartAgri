#include "headers.h"   //all misc. headers and functions
#include "MQTTFuncs.h" //MQTT related functions
#include "webApp.h"    //Captive Portal webpages
#include <FS.h>        //ESP32 File System
#include "commHandler.h"
#include "BMEHandler.h"
#include "soilMoistureHandler.h"
#include "dataHandler.h"
IPAddress ipV(192, 168, 4, 1);
char npkData[2024] = {"0.0,0.0,0.0"};
TaskHandle_t npkTask;
String loadParams(AutoConnectAux &aux, PageArgument &args) //function to load saved settings
{
    (void)(args);
    File param = FlashFS.open(PARAM_FILE, "r");
    String v1 = "";
    String v2 = "";
    if (param)
    {
        Serial.println("load params func");
        aux.loadElement(param);

        // curSValueElm.value="CurS:7788";
        param.close();
    }
    else
        Serial.println(PARAM_FILE " open failed");
    return String("");
}

String saveParams(AutoConnectAux &aux, PageArgument &args) //save the settings
{
    serverName = args.arg("mqttserver"); //broker
    serverName.trim();

    channelId = args.arg("channelid");
    channelId.trim();

    userKey = args.arg("userkey"); //user name
    userKey.trim();

    apiKey = args.arg("apikey"); //password
    apiKey.trim();

    apPass = args.arg("apPass"); //ap pass
    apPass.trim();

    settingsPass = args.arg("settingsPass"); //ap pass
    settingsPass.trim();

    hostName = args.arg("hostname");
    hostName.trim();

    // The entered value is owned by AutoConnectAux of /mqtt_setting.
    // To retrieve the elements of /mqtt_setting, it is necessary to get
    // the AutoConnectAux object of /mqtt_setting.
    File param = FlashFS.open(PARAM_FILE, "w");
    portal.aux("/mqtt_setting")->saveElement(param, {"mqttserver", "channelid", "userkey", "apikey", "hostname", "apPass", "settingsPass"});
    param.close();

    // Echo back saved parameters to AutoConnectAux page.
    AutoConnectText &echo = aux["parameters"].as<AutoConnectText>();
    echo.value = "Server: " + serverName + "<br>";
    echo.value += "Channel ID: " + channelId + "<br>";
    echo.value += "Username: " + userKey + "<br>";
    echo.value += "Password: " + apiKey + "<br>";
    echo.value += "ESP host name: " + hostName + "<br>";
    echo.value += "AP Password: " + apPass + "<br>";
    echo.value += "Settings Page Password: " + settingsPass + "<br>";

    return String("");
}
bool loadAux(const String auxName) //load defaults from data/*.json
{
    bool rc = false;
    Serial.println("load aux func");
    String fn = auxName + ".json";
    File fs = FlashFS.open(fn.c_str(), "r");
    if (fs)
    {
        rc = portal.load(fs);
        fs.close();
    }
    else
        Serial.println("Filesystem open failed: " + fn);
    return rc;
}
uint8_t inAP = 0;
bool whileCP()
{

    if (inAP == 0)
    {
        ledState(AP_MODE);
        inAP = 1;
    }
    // Serial.println("AP MODE");

    loopLEDHandler();
}
void getNPKData()
{
    String message = "";
    if (queue != NULL)
    {
        char element[2024];
        xQueueReceive(queue, &element, (TickType_t)(100 / portTICK_PERIOD_MS));
        message = String(element);
        String n = ss.StringSeparator(message, ';', 0);
        String p = ss.StringSeparator(message, ';', 1);
        String k = ss.StringSeparator(message, ';', 2);
        setN(n);
        setP(p);
        setK(k);
    }
}
void loopNPKSensor(void *pvParameters)
{

    setupCommsHandler();
    for (;;)
    {
        getNPK();
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}
void setup() //main setup functions
{
    Serial.begin(115200);

    setupBME280();
    setupSoilMoisture();
    queue = xQueueCreate(1, sizeof(npkData));
    if (queue == NULL)
    {
        Serial.println("Error creating the queue");
    }

    xQueueSend(queue, &npkData, portMAX_DELAY);

    xTaskCreatePinnedToCore(
        loopNPKSensor, /* Task function. */
        "Twitter",     /* name of task. */
        10000,         /* Stack size of task */
        NULL,          /* parameter of the task */
        1,             /* priority of the task */
        &npkTask,      /* Task handle to keep track of created task */
        1);
    delay(500);
    delay(1000);

    if (!MDNS.begin("esp32")) //starting mdns so that user can access webpage using url `esp32.local`(will not work on all devices)
    {
        Serial.println("Error setting up MDNS responder!");
        while (1)
        {
            delay(1000);
        }
    }
#if defined(ARDUINO_ARCH_ESP8266)
    FlashFS.begin();
#elif defined(ARDUINO_ARCH_ESP32)
    FlashFS.begin(true);
#endif
    loadAux(AUX_MQTTSETTING);
    loadAux(AUX_MQTTSAVE);
    AutoConnectAux *setting = portal.aux(AUX_MQTTSETTING);
    if (setting) //get all the settings parameters from setting page on esp32 boot
    {
        Serial.println("Setting loaded");
        PageArgument args;
        AutoConnectAux &mqtt_setting = *setting;
        loadParams(mqtt_setting, args);
        AutoConnectInput &hostnameElm = mqtt_setting["hostname"].as<AutoConnectInput>();
        AutoConnectInput &apPassElm = mqtt_setting["apPass"].as<AutoConnectInput>();
        AutoConnectInput &serverNameElm = mqtt_setting["mqttserver"].as<AutoConnectInput>();
        AutoConnectInput &channelidElm = mqtt_setting["channelid"].as<AutoConnectInput>();
        AutoConnectInput &userkeyElm = mqtt_setting["userkey"].as<AutoConnectInput>();
        AutoConnectInput &apikeyElm = mqtt_setting["apikey"].as<AutoConnectInput>();
        AutoConnectInput &settingsPassElm = mqtt_setting["settingsPass"].as<AutoConnectInput>();
        //vibSValueElm.value="VibS:11";
        serverName = String(serverNameElm.value);
        channelId = String(channelidElm.value);
        userKey = String(userkeyElm.value);
        apiKey = String(apikeyElm.value);
        hostName = String(hostnameElm.value);
        apPass = String(apPassElm.value);
        settingsPass = String(settingsPassElm.value);
        if (hostnameElm.value.length())
        {
            //hostName=hostName+ String("-") + String(GET_CHIPID(), HEX);
            //;
            //portal.config(hostName.c_str(), apPass.c_str());
            // portal.config(hostName.c_str(), "123456789AP");
            config.apid = hostName + "-" + String(GET_CHIPID(), HEX);
            config.password = apPass;
            config.psk = apPass;
            // portal.config(hostName.c_str(), "123456789AP");
            Serial.println("(from hostELM) hostname set to " + hostName);
        }
        else
        {

            // hostName = String("OEE");;
            // portal.config(hostName.c_str(), "123456789AP");
            config.apid = hostName + "-" + String(GET_CHIPID(), HEX);
            config.password = apPass;
            config.psk = apPass;
            //config.hostName = hostName;//hostnameElm.value+ "-" + String(GET_CHIPID(), HEX);
            // portal.config(hostName.c_str(), "123456789AP");
            Serial.println("hostname set to " + hostName);
        }
        config.homeUri = "/_ac";
        config.apip = ipV;

        portal.on(AUX_MQTTSETTING, loadParams);
        portal.on(AUX_MQTTSAVE, saveParams);
    }
    else
    {
        Serial.println("aux. load error");
    }
    //config.homeUri = "/_ac";
    config.apip = ipV;
    config.autoReconnect = true;
    config.reconnectInterval = 1;
    Serial.print("AP: ");
    Serial.println(hostName);
    Serial.print("Password: ");
    Serial.println(apPass);
    config.title = "Smart Agri Device"; //set title of webapp
    Serial.print("Device Hostname: ");
    Serial.println(hostName);
    //add different tabs on homepage

    //  portal.disableMenu(AC_MENUITEM_DISCONNECT);
    server.on("/", handleRoot);
    // Starts user web site included the AutoConnect portal.

    config.auth = AC_AUTH_DIGEST;
    config.authScope = AC_AUTHSCOPE_PARTIAL;
    config.username = hostName;
    config.password = settingsPass;

    portal.config(config);
    portal.whileCaptivePortal(whileCP);
    portal.onDetect(atDetect);
    portal.load(FPSTR(PAGE_AUTH));
    if (portal.begin())
    {
        Serial.println("Started, IP:" + WiFi.localIP().toString());
        ledState(AP_MODE);
    }
    else
    {
        Serial.println("Connection failed.");
        while (true)
        {
            yield();
            delay(100);
        }
    }

    MDNS.addService("http", "tcp", 80);
    mqttConnect(); //start mqtt

    mqttPublish("smart-agri/deviceExists", ss.getMacAddress());
}

void loop()
{
    server.handleClient();
    portal.handleRequest();

    if (millis() - lastPub > updateInterval) //publish data to mqtt server
    {
        // mqttPublish("smart-agri/" + String(hostName) + String("bme280/"), String(getBMEVal()));             //publish data to mqtt broker
        // mqttPublish("smart-agri/" + String(hostName) + String("npk/"), String(getNPK()));                   //publish data to mqtt broker
        // mqttPublish("smart-agri/" + String(hostName) + String("soilMoisture/"), String(getSoilMoisture())); //publish data to mqtt broker
        String bme = getBMEVal();
        getNPKData();

        sendData(ss.StringSeparator(bme, ';', 0), ss.StringSeparator(bme, ';', 1), ss.StringSeparator(bme, ';', 2), String(getSoilMoisture()), String("0.0"), String("0.0"), getN(), getP(), getK());
        //send values
        ledState(ACTIVE_MODE);

        lastPub = millis();
    }
    if (!mqttClient.connected())
    {
        reconnect();
    }
    mqttClient.loop();
    if (WiFi.status() == WL_IDLE_STATUS)
    {
        ledState(IDLE_MODE);
        ESP.restart();

        delay(1000);
    }
}