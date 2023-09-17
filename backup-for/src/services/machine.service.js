const Machine = require('../models/machine.model');
const Gateway = require('../models/gateway.model');
const MachineGatewayAssociation = require('../models/machineGatewayAssociation.model');
const GatewayService = require('./gateway.service');
// as request-body is multipart/form-data use form-data to add properties don't use raw-json

const createMachine = async (data, files) => {
  try {
    const machineData = {
      ...data,
      machinePhoto: files.machinePhoto
        ? {
            base64: files.machinePhoto[0].buffer.toString('base64'),
            mimetype: 'image/png',
          }
        : undefined,
      controllerPhoto: files.controllerPhoto
        ? {
            base64: files.controllerPhoto[0].buffer.toString('base64'),
            mimetype: 'image/png',
          }
        : undefined,
    };
    const createdMachine = await Machine.create(machineData);
    return createdMachine;
  } catch (error) {
    throw new Error(`Failed to create machine: ${error}`);
  }
};

const findAllMachines = async () => {
  try {
    const machines = await Machine.find();
    return machines;
  } catch (error) {
    throw new Error(`Failed to retrieve hardwire data: ${error}`);
  }
};

const findMachineByGateway = async (gatewayId) => {
  try {
    const machines = await Machine.find({ gatewayId });
    return machines;
  } catch (error) {
    throw new Error(`Failed to retrieve hardwire data: ${error}`);
  }
};
const findMachineById = async (id) => {
  try {
    const machine = await Machine.findOne({ machineId: id });
    return machine;
  } catch (error) {
    throw new Error(`Failed to retrieve machine data: ${error}`);
  }
};

const deleteMachine = async (id) => {
  try {
    const deletedMachine = await Machine.deleteOne({ machineId: id });
    return deletedMachine;
  } catch (error) {
    throw new Error(`Failed to retrieve hardwire data: ${error}`);
  }
};

// update machine added support for images
const updateMachine = async (id, updateData, files) => {
  try {
    const machine = await Machine.findOne({ machineId: id });
    if (machine === null) throw new Error(`Machine Not found`);
    const updatedMachine = await Machine.findByIdAndUpdate(machine._id, updateData, {
      new: true, // Return the updated machine after update
    });
    if (files) {
      if (files.machinePhoto) {
        // Update the machine's photo with files.machinePhoto[0].buffer
        updatedMachine.machinePhoto = {
          mimetype: 'image/png', // Adjust the mimetype as needed
          base64: files.machinePhoto[0].buffer.toString('base64'),
        };
      }
      if (files.controllerPhoto) {
        // Update the controller's photo with files.controllerPhoto[0].buffer
        updatedMachine.controllerPhoto = {
          mimetype: 'image/png', // Adjust the mimetype as needed
          base64: files.controllerPhoto[0].buffer.toString('base64'),
        };
      }
      // Save the updated machine with images
      await updatedMachine.save();
    }
    return updatedMachine;
  } catch (error) {
    throw new Error(`Failed to update machine: ${error}`);
  }
};

// set association between machine and gateway
const defineGateway = async (id, gatewayId) => {
  try {
    const machine = await Machine.findOne({ machineId: id });
    const gateway = await Gateway.findById(gatewayId);

    if (!machine || !gateway) {
      throw new Error(`Machine or Gateway not found`);
    }

    const data = {
      machineId: machine.machineId,
      gatewayId: gateway._id,
      isActive: gateway.isActive,
    };
    const exisitingAssociation = await MachineGatewayAssociation.findOneAndUpdate(
      { machineId: data.machineId, gatewayId: data.gatewayId },
      { $set: { isActive: data.isActive } },
      { upsert: true, new: true },
    );
    return exisitingAssociation;
  } catch (error) {
    throw new Error(`Failed to update gateway: ${error}`);
  }
};

const updateGateway = async (machineId, gatewayId) => {
  try {
    const machine = await findMachineById(machineId);
    const gateway = await GatewayService.getGatewayById(gatewayId);
    if (!machine || !gateway) throw new Error(`Failed to find machine or gateway`);
    machine.gatewayId = gatewayId;
    const updatedMachine = await machine.save();
    return updatedMachine;
  } catch (error) {
    throw new Error(`Failed to update gateway: ${error}`);
  }
};

// method to map the di's values of exisiting machine
const updateMapping = async (id, mapping) => {
  try {
    const machine = await Machine.findOne({ machineId: id });
    if (machine === null) throw new Error(`Machine Not found`);
    machine.statusMapping.idle = mapping.idle;
    machine.statusMapping.productive = mapping.productive;
    await machine.save();
    return machine;
  } catch (error) {
    throw new Error(`Failed to update mapping: ${error}`);
  }
};
const createSlave = async (machineId, slaveId, sensorData) => {
  try {
    const machine = await findMachineById(machineId);
    if (!machine) throw new Error(`Machine not found`);

    // validations
    // check if this slave exists in the gateway only then you can add it to the machine
    const gatewaySlave = await GatewayService.findSlaveById(machine.gatewayId, slaveId);
    if (!gatewaySlave) throw new Error(`This slave doesnot exist in your gateway`);

    const gatewaySensor = gatewaySlave.connectedSensors.find((s) => s.tag === sensorData.tag);
    if (!gatewaySensor)
      throw new Error(
        `${sensorData.tag} This sensor tag is not in the slaveId ${gatewaySlave.sid} \n please add slaves and sensors in gateway first`,
      );

    let slave = machine.attributes.find((s) => s.sid === slaveId); // check if slave already exists
    if (slave) throw new Error(`Duplicated Slave already exists`);
    if (!slave) {
      slave = {
        sid: slaveId,
        connectedSensors: [],
      };
      slave.connectedSensors.push({
        sensorId: sensorData.sensorId,
        tag: sensorData.tag,
      });
      machine.attributes.push(slave);
    }
    const updatedMachine = await machine.save();
    return updatedMachine;
  } catch (error) {
    throw new Error(`Failed to create slave in machine: ${error.message}`);
  }
};

const updateSlaveInMachine = async (machineId, slaveId, sensorData) => {
  try {
    const machine = await findMachineById(machineId);
    if (!machine) throw new Error(`Machine not found`);
    const slave = machine.attributes.find((s) => s.sid === slaveId); // check if slave already exists
    if (!slave) {
      throw new Error(`Error slave Not found`);
    }

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
    const updatedMachine = await machine.save();
    return updatedMachine;
  } catch (error) {
    throw new Error(`Failed to update slave in machine: ${error.message}`);
  }
};

const deleteSlaveinMachine = async (machineId, slaveId) => {
  try {
    const machine = await findMachineById(machineId);
    if (!machine) throw new Error(`Machine not found`);
    const slaveIndex = machine.attributes.findIndex((slave) => slave.sid === slaveId);
    if (slaveIndex === -1) throw new Error(`slave not found`);
    machine.attributes.splice(slaveIndex, 1);

    const updatedGateway = await machine.save();
    return updatedGateway;
  } catch (error) {
    throw new Error(`Failed to delete slave in machine: ${error.message}`);
  }
};

const findSlaveById = async (machineId, slaveId) => {
  try {
    const machine = await findMachineById(machineId);
    if (!machine) throw new Error(`Machine not found`);
    const slave = machine.attributes.find((s) => s.sid === slaveId);
    if (!slave) throw new Error(`slave not found`);
    return slave;
  } catch (error) {
    throw new Error(`Failed to find slave in machine: ${error.message}`);
  }
};

const createIORecord = async (machineId, ioRecord) => {
  try {
    const machine = await findMachineById(machineId);
    if (!machine) throw new Error(`Machine not found`);
    let input = machine.inputs.find((i) => i.diId === ioRecord.diId);
    if (!input) {
      input = {
        diId: ioRecord.diId,
        sensorId: ioRecord.sensorData,
        tag: ioRecord.tag,
      };

      machine.inputs.push(input);
    } else {
      input.sensorId = ioRecord.sensorData;
      input.tag = ioRecord.tag;
    }
    const updatedMachine = await machine.save();
    return updatedMachine;
  } catch (error) {
    throw new Error(`Failed to create IO record: ${error.message}`);
  }
};

const getAllIORecords = async (machineId) => {
  try {
    const machine = await findMachineById(machineId);
    if (!machine) throw new Error(`Machine not found`);
    return machine.inputs;
  } catch (error) {
    throw new Error(`Failed to get IO records: ${error.message}`);
  }
};

// Delete an existing IO record by ID
const deleteIORecord = async (machineId, diId) => {
  try {
    const machine = await findMachineById(machineId);
    if (!machine) throw new Error(`Machine not found`);
    const ioRecordIndex = machine.inputs.findIndex((io) => io.diId === diId);

    if (ioRecordIndex === -1) {
      throw new Error('IO record not found');
    }

    machine.inputs.splice(ioRecordIndex, 1);
    const updatedMachine = await machine.save();
    return updatedMachine;
  } catch (error) {
    throw new Error(`Failed to delete IO record: ${error.message}`);
  }
};
module.exports = {
  // machine
  createMachine,
  findAllMachines,
  findMachineById,
  updateMachine,
  deleteMachine,
  // gateway to machines
  findMachineByGateway,
  updateGateway,
  defineGateway,
  // dynamic
  updateMapping,
  // slaves
  createSlave,
  updateSlaveInMachine,
  deleteSlaveinMachine,
  findSlaveById,
  // io
  createIORecord,
  getAllIORecords,
  deleteIORecord,
};
