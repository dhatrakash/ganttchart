const Gateway = require('../models/gateway.model');

// Create a new gateway
const createGateway = async (gatewayData) => {
  const gateway = await Gateway.create(gatewayData);
  return gateway;
};

// Get all gateways
const getAllGateways = async () => {
  const gateway = await Gateway.find();
  return gateway;
};

// Get a gateway by ID
const getGatewayById = async (gatewayId) => {
  const gateway = await Gateway.findOne({ gatewayId });
  return gateway;
};

// Update a gateway by ID
const updateGateway = async (gatewayId, gatewayData) => {
  const gateway = await Gateway.findOneAndUpdate({ gatewayId }, gatewayData, { new: true });
  return gateway;
};

// Delete a gateway by ID
const deleteGateway = async (gatewayId) => {
  const gateway = await Gateway.findOneAndRemove({ gatewayId });

  return gateway;
};

const createSlaveInGateway = async (gatewayId, slaveId, sensorData) => {
  try {
    const gateway = await Gateway.findOne({ gatewayId });
    if (!gateway) throw new Error(`gateway not found`);

    let slave = gateway.slaves.find((s) => s.sid === slaveId);
    if (slave) throw new Error(`This slave already exists`);

    if (!slave) {
      // if not then create one with given slaveId
      slave = {
        sid: slaveId,
        connectedSensors: [],
      };
      sensorData.forEach((data) => {
        slave.connectedSensors.push({
          sensorId: data.sensorId,
          tag: data.tag,
        });
      });

      gateway.slaves.push(slave);
    }
    const updatedGateway = await gateway.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to create slave in gateway: ${error.message}`);
  }
};

// slave service in gateway
const updateSlaveInGateway = async (gatewayId, slaveId, sensorData) => {
  try {
    const gateway = await Gateway.findOne({ gatewayId });
    if (!gateway) throw new Error(`gateway not found`);

    const slave = gateway.slaves.find((s) => s.sid === slaveId); // check if slave already exists
    if (!slave) throw new Error(`Error slave Not found`);
    // if exists find the sensor tag already exists in the slave
    slave.connectedSensors = [];
    // else let's create sensor data and push to connectedsensor array
    sensorData.forEach((data) => {
      slave.connectedSensors.push({
        sensorId: data.sensorId,
        tag: data.tag,
      });
    });

    // gateway.slaves.push(slave);
    const updatedGateway = await gateway.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to update slave in gateway: ${error.message}`);
  }
};
const updateSlaveInGateway1 = async (gatewayId, slaveId, sensorData) => {
  try {
    const gateway = await Gateway.findOne({ gatewayId });
    if (!gateway) throw new Error(`gateway not found`);

    const slave = gateway.slaves.find((s) => s.sid === slaveId); // check if slave already exists
    if (!slave) throw new Error(`Error slave Not found`);
    // if exists find the sensor tag already exists in the slave

    const exisitingSensor = slave.connectedSensors.find((s) => s.tag === sensorData.tag);

    // if exists just update sensorId with new one
    if (exisitingSensor) {
      exisitingSensor.sensorId = sensorData.sensorId;
    } else {
      // else let's create sensor data and push to connectedsensor array
      slave.connectedSensors.push({
        sensorId: sensorData.sensorId,
        tag: sensorData.tag,
      });
    }
    // gateway.slaves.push(slave);
    const updatedGateway = await gateway.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to update slave in gateway: ${error.message}`);
  }
};

const deleteSlaveinGateway = async (gatewayId, slaveId) => {
  try {
    const gateway = await getGatewayById(gatewayId);
    const slaveIndex = gateway.slaves.findIndex((slave) => slave.sid === slaveId);
    if (slaveIndex === -1) throw new Error(`slave not found`);
    gateway.slaves.splice(slaveIndex, 1);
    const updatedGateway = await gateway.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to delete slave in gateway: ${error.message}`);
  }
};

const findSlaveById = async (gatewayId, slaveId) => {
  try {
    const gateway = await getGatewayById(gatewayId);
    const slave = gateway.slaves.find((s) => s.sid === slaveId);
    if (!slave) throw new Error(`slave not found`);
    return slave;
  } catch (error) {
    throw new Error(`Failed to find slave in gateway: ${error.message}`);
  }
};

const findAllSlaves = async (gatewayId) => {
  try {
    const gateway = await getGatewayById(gatewayId);
    const { slaves } = gateway;
    return slaves;
  } catch (error) {
    throw new Error(`Failed to find slaves in gateway: ${error.message}`);
  }
};

const deleteSensorInSlavebyId = async (gatewayId, slaveId, sensorId) => {
  try {
    const gateway = await getGatewayById(gatewayId);
    const slave = gateway.slaves.find((s) => s.sid === slaveId);
    const sensorIndex = slave.connectedSensors.findIndex((s) => s.sensorId === sensorId);
    if (sensorIndex === -1) throw new Error(`Sensor in slave not found`);
    slave.connectedSensors.splice(sensorIndex, 1);
    const updatedGateway = await gateway.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to delete sensor in gateway: ${error.message}`);
  }
};

const deleteSensorInSlavebyTag = async (gatewayId, slaveId, sensorTag) => {
  try {
    const gateway = await getGatewayById(gatewayId);
    const slave = gateway.slaves.find((s) => s.sid === slaveId);
    const sensorIndex = slave.connectedSensors.findIndex((s) => s.tag === sensorTag);
    if (sensorIndex === -1) throw new Error(`Sensor in slave not found`);
    slave.connectedSensors.splice(sensorIndex, 1);
    const updatedGateway = await gateway.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to delete sensor in gateway: ${error.message}`);
  }
};
// io service in gateway

// Create an IO record for a gateway
const createIORecord = async (gatewayId, ioRecord) => {
  try {
    const gateway = await getGatewayById(gatewayId);
    if (!gateway) {
      throw new Error('Gateway not found');
    }
    let input = gateway.inputs.find((i) => i.diId === ioRecord.diId);
    if (!input) {
      input = {
        diId: ioRecord.diId,
        sensorId: ioRecord.sensorData,
        tag: ioRecord.tag,
      };

      gateway.inputs.push(input);
    } else {
      input.sensorId = ioRecord.sensorData;
      input.tag = ioRecord.tag;
    }
    const updatedGateway = await gateway.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to create IO record: ${error.message}`);
  }
};

// Get all IO records for a gateway
const getAllIORecords = async (gatewayId) => {
  try {
    const gateway = await getGatewayById(gatewayId);
    if (!gateway) {
      throw new Error('Gateway not found');
    }
    return gateway.inputs;
  } catch (error) {
    throw new Error(`Failed to get IO records: ${error.message}`);
  }
};

// Delete an existing IO record by ID
const deleteIORecord = async (gatewayId, diId) => {
  try {
    const gateway = await getGatewayById(gatewayId);
    if (!gateway) {
      throw new Error('Gateway not found');
    }
    const ioRecordIndex = gateway.inputs.findIndex((io) => io.diId === diId);

    if (ioRecordIndex === -1) {
      throw new Error('IO record not found');
    }

    gateway.inputs.splice(ioRecordIndex, 1);
    const updatedGateway = await gateway.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to delete IO record: ${error.message}`);
  }
};

module.exports = {
  // gateway
  createGateway,
  getAllGateways,
  getGatewayById,
  updateGateway,
  deleteGateway,
  // slaves - sensors
  createSlaveInGateway,
  updateSlaveInGateway,
  deleteSlaveinGateway,
  findSlaveById,
  findAllSlaves,
  deleteSensorInSlavebyId,
  deleteSensorInSlavebyTag,
  // io
  createIORecord,
  getAllIORecords,
  deleteIORecord,
};
