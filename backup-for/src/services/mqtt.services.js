const mqtt = require('mqtt');
const config = require('../config/config');
const logger = require('../config/logger');
const Hardware = require('../models/hardware.model');

const mqttBrokerIp = config.mqtt.brokerIp;
const mqttBrokerPort = config.mqtt.brokerPort;
const mqttTopic = config.mqtt.topic;
// added customerId & mac in env to create customized subject
const { customerId } = config.mqtt;
const { macAddress } = config.mqtt;

// subscribing to multiple topics
const topics = [`dataPub/${customerId}/${macAddress}`, mqttTopic];

const mqttBroker = `mqtt://${mqttBrokerIp}:${mqttBrokerPort}`;

const mqttClient = mqtt.connect(mqttBroker, { keepalive: 5000 });

mqttClient.on('connect', async () => {
  logger.info('Connected to MQTT broker');

  mqttClient.subscribe(topics, (err) => {
    if (err) {
      logger.error('Failed to subscribe to MQTT topic:', err);
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
    const savedMessage = await Hardware.create(ParsedMessage);
    logger.info(`Message inserted into MongoDB`, savedMessage);
  } catch (erro) {
    logger.error(`Failed to save parsed mqtt message to mongodb: ${erro}`);
  }
});
module.exports = mqttClient;

// MQTT format to update here onward
// + reading data
// dataPub/CUSTOMERID/$MAC

// write data (send command)
// cmdSub/CUSTOMERID/$MAC

// command used to flush downtime reason $IPCFG,<DEVCMD: MBCMD=0306000000000000 >
// command used to lock $IPCFG,<DEVCMD: MBCMD=0306000203090000 >
// command used to unlock $IPCFG,<DEVCMD: MBCMD=0306000200000000 >
