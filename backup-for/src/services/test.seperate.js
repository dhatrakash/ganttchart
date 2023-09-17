const mqtt = require('mqtt');
const mongoose = require('mongoose');
const Fanuc = require('../models/fanuc.mqtt.model'); // Import your MongoDB model here

const mqttBrokerIp = '3.109.134.21';
const mqttBrokerPort = '1883';

const topics = [
  'fanuc/f_sim_mqtt_long/tool/1',
  'fanuc/f_sim_mqtt_long/alarms/1',
  'fanuc/f_sim_mqtt_long/messages/1',
  'fanuc/f_sim_mqtt_long/machine/1',
  'fanuc/f_sim_mqtt_long/state/1',
  'fanuc/f_sim_mqtt_long/production/1',
  'fanuc/f_sim_mqtt_long/gcode/1',
  'fanuc/f_sim_mqtt_long/axis/1/X',
  'fanuc/f_sim_mqtt_long/axis/1/Y',
  'fanuc/f_sim_mqtt_long/axis/1/Z',
  'fanuc/f_sim_mqtt_long/spindle/1/S1',
];

const mqttBroker = `mqtt://${mqttBrokerIp}:${mqttBrokerPort}`;

const mqttClient = mqtt.connect(mqttBroker, { keepalive: 5000 });

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker of fanuc');

  mqttClient.subscribe(topics, (err) => {
    if (err) {
      console.error('Failed to subscribe to MQTT topics:', err);
      return err;
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  try {
    console.log('Received MQTT message:');
    const mqttMessage = message.toString();

    let parsedMessage;
    try {
      parsedMessage = JSON.parse(mqttMessage);
    } catch (err) {
      console.error(`Failed to parse the MQTT message: ${err}`);
      return;
    }

    // Save the parsed message to the MongoDB collection
    const savedMessage = await Fanuc.create(parsedMessage);
    console.log(`Message inserted into MongoDB`, savedMessage);
  } catch (error) {
    console.error(`Failed to save parsed MQTT message to MongoDB: ${error}`);
  }
});

// Connect to your MongoDB instance
mongoose
  .connect(
    'mongodb+srv://MachineWiseAtlasDBUsernme:MachineWiseAtlasDBPassword@machinewisecluster.vxwxrdm.mongodb.net/MWDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
