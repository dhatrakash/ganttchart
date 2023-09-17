const moment = require('moment');
const Fanuc = require('../models/fanuc.mqtt.model');

const findUptimeByHour = async (machineName, hours) => {
  const startTime = moment().subtract(hours, 'hours').unix();
  const name = 'state';
  const projection = {
    'state.data.run': 1,
    'observation.time': 1,
  };
  const foundData = await Fanuc.find(
    {
      'observation.machine': machineName,
      'observation.time': {
        $gte: startTime,
      },
      'observation.name': name,
    },
    projection,
  );
  return foundData;
};

const findFeedByHour = async (machineName, hours) => {
  const startTime = moment().subtract(hours, 'hours').unix();
  const name = 'state';
  const projection = {
    'state.data.override.feed': 1,
    'observation.time': 1,
  };
  const foundData = await Fanuc.find(
    {
      'observation.machine': machineName,
      'observation.time': {
        $gte: startTime,
      },
      'observation.name': name,
    },
    projection,
  );
  console.log(foundData);
  return foundData;
};

findFeedByHour('f_sim_mqtt_long', 200);
module.exports = {
  findUptimeByHour,
  // findFeedByHour,
};
