# Copy of node-red-contrib-netatmo-dashboard, only smartly modified to work with Homecoach
[Node-RED](http://nodered.org/docs/getting-started/installation) node to fetch all data (temperature, pressure, humidity, co2, noise, etc) from a NetAtmo homecoach device.

Returns a payload which is split up into to parts: 

* a compact object which contains the most relevant information
* a detailed object which contains the complete return from the netatmo api

__Attention: The reachable status of the complete station seems not to changefor at least a 
couple of hours. While the reachable status of devices change after approximately 1h, 
the station itselve will shown as reachable even if this is not the case__

An Example:

```

{
	"compact": {
		"reachable": true,
		"station_name": "Dom xxxxxxxxxx",
		"last_status_store": 1747776439,
		"temperature": 17.1,
		"co2": 551,
		"humidity": 51,
		"noise": 33,
		"pressure": 1007.3
	},
	"detailed": {
		"body": {
			"devices": [
				{
					"_id": "70:xx:xx:xx:xx:xx",
					"station_name": "Dom Rowerowa",
					"date_setup": 1705524209,
					"last_setup": 1743627937,
					"type": "NHC",
					"last_status_store": 1747776439,
					"firmware": 59,
					"wifi_status": 45,
					"reachable": true,
					"co2_calibrating": false,
					"data_type": [
						"Temperature",
						"CO2",
						"Humidity",
						"Noise",
						"Pressure",
						"health_idx"
					],
					"place": {
						"altitude": 75,
						"city": "Nowy Dwór Mazowiecki",
						"country": "PL",
						"timezone": "Europe/Warsaw",
						"location": [
							20.0000,
							52.0000
						]
					},
					"subtype": "PRO",
					"dashboard_data": {
						"time_utc": 1747776438,
						"Temperature": 17.1,
						"CO2": 551,
						"Humidity": 51,
						"Noise": 33,
						"Pressure": 1007.3,
						"AbsolutePressure": 998.4,
						"health_idx": 1,
						"min_temp": 17.1,
						"max_temp": 21.5,
						"date_max_temp": 1747752262,
						"date_min_temp": 1747776136
					}
				}
			],
			"user": {
				"mail": "anonim@email.pl",
				"administrative": {
					"country": "PL",
					"reg_locale": "pl-PL",
					"lang": "pl",
					"unit": 0,
					"windunit": 0,
					"pressureunit": 0,
					"feel_like_algo": 0
				}
			}
		},
		"status": "ok",
		"time_exec": 0.03810906410217285,
		"time_server": 1747776657
	}
}

```

## Authentication
Use new NetAtmo authentication (from October 2022). From [Netatmo Connect](https://dev.netatmo.com/) obtain: *client_id*, *client_secret* and *refresh_token*.
To get the refresh_token a OAuth2 client is needed (i.e. [Paw](https://paw.cloud/) for MacOS): use these params
[Update - refresh token is available too from dev.netatmo.com]
* client_id: from your app in Netatmo Connect
* client_secret: from your app in Netamo Connect
* Authorization URL: https://api.netatmo.com/oauth2/authorize
* Access URL: https://api.netatmo.com/oauth2/token
* Redirect URL: http://localhost


## The MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
