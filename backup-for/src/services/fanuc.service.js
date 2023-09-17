const mqtt = require('mqtt');
const logger = require('../config/logger');
const fanuc = require('../models/fanuc.mqtt.model');

const mqttBrokerIp = `3.109.134.21`;
const mqttBrokerPort = `1883`;

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

const mqttClient = mqtt.connect(mqttBroker, { keepalive: 5000, clean: true });

mqttClient.on('connect', async () => {
  logger.info('Connected to mqtt broker of fanuc');

  mqttClient.subscribe(topics, (err) => {
    if (err) {
      logger.error('Failed to subscribe to MQTT topics:', err);
      return err;
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  try {
    logger.info('Recieved mqtt message:');
    const mqttMessage = message.toString();

    let ParsedMessage;
    try {
      ParsedMessage = JSON.parse(mqttMessage);
    } catch (err) {
      logger.error(`Failed to parse the mqtt message: ${err}`);
      return;
    }
    const savedMessage = await fanuc.create(ParsedMessage);
    // logger.info(savedMessage);
    logger.info(`Message inserted into MongoDB`, savedMessage);
  } catch (erro) {
    logger.error(`Failed to save parsed mqtt message to mongodb: ${erro}`);
  }
});
module.exports = mqttClient;
