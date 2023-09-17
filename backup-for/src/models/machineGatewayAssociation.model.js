const mongoose = require('mongoose');

const machineGatewayAssociationSchema = new mongoose.Schema({
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true,
  },
  gatewayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gateway',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const MachineGatewayAssociation = mongoose.model('machineGatewayAssociation', machineGatewayAssociationSchema);

module.exports = MachineGatewayAssociation;
