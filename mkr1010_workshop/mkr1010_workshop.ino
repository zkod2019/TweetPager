#include <SPI.h>
#include <ArduinoHttpClient.h>
#include <WiFiNINA.h>

char ssid[] = "AssemblyZaya";          //  your network SSID (name)
char pass[] = "assembly123";       // your network password

IPAddress dns(8, 8, 8, 8); //Google dns
IPAddress laptop(192, 168, 43, 79); //Google dns
//IPAddress laptop(37, 16, 4, 227);
int status = WL_IDLE_STATUS;

// Initialize the client library
//"wandering-silence-8110.fly.dev"
WiFiClient wifi;
HttpClient client = HttpClient(wifi, laptop, 80);

void setup() {
  Serial.begin(9600);

  while (!Serial);
  status = WiFi.begin(ssid, pass);

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to network: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }
  WiFi.setDNS(dns);
  Serial.print("Dns configured.");
}

void loop() {
   Serial.println("making GET request");
  client.get("/makesmartthings");

  // read the status code and body of the response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);
  Serial.println("Wait 1 hour");
  delay(1000*60*60);
}
