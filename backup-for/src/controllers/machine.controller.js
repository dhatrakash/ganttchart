const machineService = require('../services/machine.service');
const multerMiddleware = require('../middlewares/multer');

exports.createMachine = async (req, res) => {
  multerMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    try {
      const createdMachine = await machineService.createMachine(req.body, req.files);
      return res.status(201).json({ createdMachine });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};

exports.findMachineById = async (req, res) => {
  try {
    const { machineId } = req.params;
    const machine = await machineService.findMachineById(machineId);
    res.status(200).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findByGateway = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const machine = await machineService.findMachineByGateway(gatewayId);
    res.status(200).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.findMachines = async (req, res) => {
  try {
    const machines = await machineService.findAllMachines();
    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMachine = async (req, res) => {
  multerMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    try {
      const updatedMachine = await machineService.updateMachine(req.params.machineId, req.body, req.files);
      res.status(200).json(updatedMachine);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.deleteMachine = async (req, res) => {
  try {
    const { machineId } = req.params;
    const deletedMachine = await machineService.deleteMachine(machineId);
    res.status(200).json(deletedMachine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createHardwire = async (req, res) => {
  try {
    const createdhardwire = await machineService.createHardwireMachine(req.body);
    res.status(201).json(createdhardwire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findHardwireData = async (req, res) => {
  try {
    const foundHardwires = await machineService.findHardwireData(req.params.machineId);
    res.status(201).json(foundHardwires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGateway1 = async (req, res) => {
  try {
    const updatedMachine = await machineService.defineGateway(req.body.machineId, req.body.gatewayId);
    res.status(200).json(updatedMachine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMapping = async (req, res) => {
  try {
    const updatedMachine = await machineService.updateMapping(req.params.machineId, req.body);
    res.status(200).json(updatedMachine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createSlaveInMachine = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { slaveId } = req.body;
    const { sensorData } = req.body;
    const machine = await machineService.createSlave(machineId, slaveId, sensorData);
    if (!machine) return res.status(404).json({ error: `slave creation failed` });
    return res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSlaveInMachine = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { slaveId } = req.body;
    const { sensorData } = req.body;
    const machine = await machineService.updateSlaveInMachine(machineId, slaveId, sensorData);
    if (!machine) return res.status(404).json({ error: `slave update failed` });
    return res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGateway = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { gatewayId } = req.params;
    const machine = await machineService.updateGateway(machineId, gatewayId);
    if (!machine) return res.status(404).json({ error: `gateway update failed` });
    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSlave = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { slaveId } = req.params;
    const machine = await machineService.deleteSlaveinMachine(machineId, slaveId);
    if (!machine) return res.status(404).json({ error: `slave delete failed` });
    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findSlaveById = async (req, res) => {
  try {
    const { machineId } = req.params;
    const { slaveId } = req.params;
    const machine = await machineService.findSlaveById(machineId, slaveId);
    if (!machine) return res.status(404).json({ error: `failed to find slave` });
    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createIORecord = async (req, res) => {
  try {
    const { machineId } = req.params;
    const ioRecord = req.body; // Assuming the request body contains the IO record data
    const updatedMachine = await machineService.createIORecord(machineId, ioRecord);
    res.status(201).json(updatedMachine);
  } catch (error) {
    res.status(500).json({ error: `Failed to create IO record: ${error.message}` });
  }
};
exports.getAllIORecords = async (req, res) => {
  try {
    const { machineId } = req.params;
    const ioRecords = await machineService.getAllIORecords(machineId);
    res.status(200).json(ioRecords);
  } catch (error) {
    res.status(500).json({ error: `Failed to get IO records: ${error.message}` });
  }
};
exports.deleteIORecord = async (req, res) => {
  try {
    const { machineId, diId } = req.params;
    const updatedMachine = await machineService.deleteIORecord(machineId, diId);
    res.status(200).json(updatedMachine);
  } catch (error) {
    res.status(500).json({ error: `Failed to delete IO record: ${error.message}` });
  }
};
