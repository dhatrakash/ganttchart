const gatewayService = require('../services/gateway.service');

// Create a new gateway
const createGateway = async (req, res) => {
  try {
    const gateway = await gatewayService.createGateway(req.body);
    res.status(201).json(gateway);
  } catch (error) {
    res.status(500).json({ error: `Unable to create gateway ${error}` });
  }
};

// Get all gateways
const getAllGateways = async (req, res) => {
  try {
    const gateways = await gatewayService.getAllGateways();
    if (!gateways[0]) return res.status(404).json(`Getways not found`);
    return res.status(201).json(gateways);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch gateways' });
  }
};

// Get a gateway by ID
const getGatewayById = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const gateway = await gatewayService.getGatewayById(gatewayId);

    if (gateway) return res.status(201).json(gateway);
    return res.status(404).json({ error: 'Gateway not found' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch gateway by id' });
  }
};

// Update a gateway by ID
const updateGateway = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const updatedGateway = req.body;
    const gateway = await gatewayService.updateGateway(gatewayId, updatedGateway);
    if (!gateway) return res.status(404).json({ error: 'Gateway not found' });
    return res.status(201).json(gateway);
  } catch (error) {
    res.status(500).json({ error: `Unable to update gateway ${error}` });
  }
};

// Delete a gateway by ID
const deleteGateway = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const gateway = await gatewayService.deleteGateway(gatewayId);
    if (!gateway) return res.status(404).json({ error: 'Gateway not found' });
    return res.status(201).json({ message: 'Gateway deleted successfully', deletedGateway: gateway });
  } catch (error) {
    res.status(500).json({ error: `Unable to delete gateway ${error.message}` });
  }
};

const createSlaveInGateway = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const { slaveId } = req.body;
    const { sensorData } = req.body;
    const updatedGateway = await gatewayService.createSlaveInGateway(gatewayId, slaveId, sensorData);
    return res.status(201).json(updatedGateway);
  } catch (error) {
    res.status(500).json({ error: `Unable to create slave ${error.message}` });
  }
};

const updateSlave = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const { slaveId } = req.body;
    const { sensorData } = req.body;
    const updatedGateway = await gatewayService.updateSlaveInGateway(gatewayId, slaveId, sensorData);
    return res.status(201).json(updatedGateway);
  } catch (error) {
    res.status(500).json({ error: `Unable to modify slave ${error.message}` });
  }
};

const deleteSlave = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const { slaveId } = req.body;
    const updatedGateway = await gatewayService.deleteSlaveinGateway(gatewayId, slaveId);
    return res.status(201).json(updatedGateway);
  } catch (error) {
    res.status(500).json({ error: `Unable to delete slave ${error.message}` });
  }
};

const findSlaveById = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const { slaveId } = req.body;
    const slave = await gatewayService.findSlaveById(gatewayId, slaveId);
    return res.status(201).json(slave);
  } catch (error) {
    res.status(500).json({ error: `Unable to find the slave ${error.message}` });
  }
};

const findAllSlaves = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const slaves = await gatewayService.findAllSlaves(gatewayId);
    if (!slaves[0]) return res.status(404).json({ error: 'NO slaves found' });
    res.status(201).json(slaves);
  } catch (error) {
    res.status(500).json({ error: `unable to find the slaves ${error.message}` });
  }
};

const createIORecord = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const ioRecord = req.body; // Assuming the request body contains the IO record data
    const updatedGateway = await gatewayService.createIORecord(gatewayId, ioRecord);
    res.status(201).json(updatedGateway);
  } catch (error) {
    res.status(500).json({ error: `Failed to create IO record: ${error.message}` });
  }
};
const getAllIORecords = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const ioRecords = await gatewayService.getAllIORecords(gatewayId);
    res.status(200).json(ioRecords);
  } catch (error) {
    res.status(500).json({ error: `Failed to get IO records: ${error.message}` });
  }
};
const deleteIORecord = async (req, res) => {
  try {
    const { gatewayId, diId } = req.params;
    const updatedGateway = await gatewayService.deleteIORecord(gatewayId, diId);
    res.status(200).json(updatedGateway);
  } catch (error) {
    res.status(500).json({ error: `Failed to delete IO record: ${error.message}` });
  }
};

module.exports = {
  createGateway,
  getAllGateways,
  getGatewayById,
  updateGateway,
  deleteGateway,
  createSlaveInGateway,
  updateSlave,
  deleteSlave,
  findSlaveById,
  findAllSlaves,
  createIORecord,
  deleteIORecord,
  getAllIORecords,
};
