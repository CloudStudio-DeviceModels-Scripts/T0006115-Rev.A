function parseUplink(device, payload)
{
    // Basic checks
	var bytes = payload.asBytes();
    if (bytes.length != 11)
    {
        env.log("Incorrect payload length, must be 11 bytes");
        return;
    }
    if (payload.port > 0 && payload.port != 103)
    {
        env.log("Incorrect LoRaWAN port, must be 103");
        return;
    }

    // Calculate the different fields from the payload
    var batteryVoltage = ((bytes[1] & 0b00001111) + 25.00) / 10.00;
    var humidity = (bytes[3] & 0b01111111);
    var co2 = bytes[4] + (bytes[5] << 8);
    var voc = bytes[6] + (bytes[7] << 8);
    var aqi = bytes[8] + (bytes[9] << 8);
    var temp = (bytes[10] & 0x7f) - 32;

    // Store humidity
    var e = device.endpoints.byType(endpointType.humiditySensor);
    if (e != null)
        e.updateHumiditySensorStatus(humidity);

    // Store CO2
    e = device.endpoints.byType(endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.carbonDioxide);
    if (e != null)
        e.updatePpmConcentrationSensorStatus(co2);

    // Store VOC
    e = device.endpoints.byType(endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.voc);
    if (e != null)
        e.updatePpmConcentrationSensorStatus(voc);

    // Store AQI
    e = device.endpoints.byType(endpointType.airQualityIndexSensor);
    if (e != null)
        e.updateAqiSensorStatus(aqi);

    // Store temperature
    e = device.endpoints.byType(endpointType.temperatureSensor);
    if (e != null)
        e.updateTemperatureSensorStatus(temp);

    // Store battery voltage
    device.updateDeviceBattery( { voltage: batteryVoltage } );
}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint to which the command will be sent. May be null
	//   if the command is to be sent to the device, and not to an individual
	//   endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

	 payload.port = 25; 	 	 // This device receives commands on LoRaWAN port 25 
	 //payload.buildResult = downlinkBuildResult.ok;
     payload.buildResult = downlinkBuildResult.ok; 
     payload.setAsBytes([1, 2, 3, 4, 5, 6, 7, 8]);
     payload.errorbytes = "This is an error bytes!";
     payload.requiresResponse = false;     
}

function parseUplink(device, payload)
{
	// This function allows you to parse the received payload, and store the 
	// data in the respective endpoints. Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device that produced the payload. 
	//   You can use "device.endpoints" to access the collection 
	//   of endpoints contained within the device. More information
	//   at https://wiki.cloud.studio/page/205
	// - payload: object containing the payload received from the device. More
	//   information at https://wiki.cloud.studio/page/208.

	// This example is written assuming a temperature and humidity sensor that 
	// sends a binary payload with temperature in the first byte, humidity 
	// in the second byte, and battery percentage in the third byte.

/*  
	// Payload is binary, so it's easier to handle as an array of bytes
	var bytes = payload.asBytes();
	
	// Verify payload contains exactly 3 bytes
	if (bytes.length != 3)
		return;

	// Parse and store temperature
	var temperatureSensor = device.endpoints.byType(endpointType.temperatureSensor);
	if (temperatureSensor != null)
	{
		var temperature = bytes[0] & 0x7f;
		if (bytes[0] & 0x80)  // Negative temperature?
			temperature -= 128;
		temperatureSensor.updateTemperatureSensorStatus(temperature);
	}

	// Parse and store humidity
	var humiditySensor = device.endpoints.byType(endpointType.humiditySensor);
	if (humiditySensor != null)
	{
		var humidity = bytes[1];
		humiditySensor.updateHumiditySensorStatus(humidity);
	}	  
	
	// Parse and store battery percentage
	var batteryPercentage = bytes[2];
	device.updateDeviceBattery({ percentage: batteryPercentage });
*/

}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

/*
	 payload.port = 25; 	 	 // This device receives commands on LoRaWAN port 25 
	 payload.buildResult = downlinkBuildResult.ok; 

	 switch (command.type) { 
	 	 case commandType.onOff: 
	 	 	 switch (command.onOff.type) { 
	 	 	 	 case onOffCommandType.turnOn: 
	 	 	 	 	 payload.setAsBytes([30]); 	 	 // Command ID 30 is "turn on" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.turnOff: 
	 	 	 	 	 payload.setAsBytes([31]); 	 	 // Command ID 31 is "turn off" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.toggle: 
	 	 	 	 	 payload.setAsBytes([32]); 	 	 // Command ID 32 is "toggle" 
	 	 	 	 	 break; 
	 	 	 	 default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	 } 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	 }
*/

}