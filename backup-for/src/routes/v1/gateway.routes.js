const express = require('express');
const gatewayController = require('../../controllers/gateway.controller');

const router = express.Router();
// Create a new gateway
router.post('/', gatewayController.createGateway);
// Get all gateways
router.get('/', gatewayController.getAllGateways);
// Get a gateway by ID
router.get('/:gatewayId', gatewayController.getGatewayById);
// Update a gateway by ID
router.put('/:gatewayId', gatewayController.updateGateway);
// Delete a gateway by ID
router.delete('/:gatewayId', gatewayController.deleteGateway);

// update salve with gateway id
router.post('/slave/:gatewayId', gatewayController.createSlaveInGateway);
router.put('/slave/:gatewayId', gatewayController.updateSlave);
router.delete('/slave/:gatewayId', gatewayController.deleteSlave);
router.get('/slave/:gatewayId', gatewayController.findSlaveById);
router.get('/slave/all/:gatewayId', gatewayController.findAllSlaves);

// Create or update  an IO record for a gateway
router.post('/:gatewayId/io', gatewayController.createIORecord);
// Get all IO records for a gateway
router.get('/:gatewayId/io', gatewayController.getAllIORecords);
// Delete an existing IO record by ID
router.delete('/:gatewayId/io/:diId', gatewayController.deleteIORecord);

module.exports = router;

/**
 * @swagger
 * /gateway:
 *   post:
 *     summary: Create a new gateway
 *     tags:
 *       - Gateways
 *     requestBody:
 *       description: Gateway data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gateway'
 *     responses:
 *       '201':
 *         description: Gateway created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       '500':
 *         description: Unable to create gateway
 */

/**
 * @swagger
 * /gateway:
 *   get:
 *     summary: Get all gateways
 *     tags:
 *       - Gateways
 *     responses:
 *       '201':
 *         description: List of gateways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gateway'
 *       '404':
 *         description: No gateways found
 *       '500':
 *         description: Unable to fetch gateways
 */

/**
 * @swagger
 * /gateway/{gatewayId}:
 *   get:
 *     summary: Get a gateway by ID
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Gateway found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       '404':
 *         description: Gateway not found
 *       '500':
 *         description: Unable to fetch gateway by ID
 */

/**
 * @swagger
 * /gateway/{gatewayId}:
 *   put:
 *     summary: Update a gateway by ID
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated gateway data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gateway'
 *     responses:
 *       '201':
 *         description: Gateway updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       '404':
 *         description: Gateway not found
 *       '500':
 *         description: Unable to update gateway
 */

/**
 * @swagger
 * /gateway/{gatewayId}:
 *   delete:
 *     summary: Delete a gateway by ID
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to delete
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Gateway deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GatewayResponse'
 *       '404':
 *         description: Gateway not found
 *       '500':
 *         description: Unable to delete gateway
 */
/**
 * @swagger
 * /gateway/slave/{gatewayId}:
 *   delete:
 *     summary: Delete a slave from a gateway
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to delete a slave from
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Slave data to delete
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorData'
 *     responses:
 *       '201':
 *         description: Slave deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       '500':
 *         description: Unable to delete slave
 */

/**
 * @swagger
 * /gateway/slave/{gatewayId}:
 *   get:
 *     summary: Find a slave by ID for a gateway
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to find a slave in
 *         schema:
 *           type: string
 *       - name: slaveId
 *         in: query
 *         required: true
 *         description: ID of the slave to find
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Slave found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       '500':
 *         description: Unable to find the slave
 */

/**
 * @swagger
 * /gateway/slave/all/{gatewayId}:
 *   get:
 *     summary: Find all slaves for a gateway
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to find all slaves in
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: List of slaves
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *       '404':
 *         description: No slaves found
 *       '500':
 *         description: Unable to find the slaves
 */

/**
 * @swagger
 * /gateway/{gatewayId}/io:
 *   get:
 *     summary: Find all io records for a gateway
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to find all io records
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: List of slaves
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *       '404':
 *         description: No slaves found
 *       '500':
 *         description: Unable to find the slaves
 */
/**
 * @swagger
 * /gateway/{gatewayId}/io/{diId}:
 *   delete:
 *     summary: Delete io from gateway
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway
 *       - name: diId
 *         in: path
 *         required: true
 *         description: ID of io record
 *     responses:
 *       '204':
 *         description: IO record deleted successfully
 *       '500':
 *         description: Unable to delete IO record
 */
/**
 * @swagger
 * /gateway/{gatewayId}/io:
 *   post:
 *     summary: Add or update a io record for a gateway
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to add/update a slave
 *         schema:
 *           diId:
 *            type: string
 *            example: "di1"
 *           sensorId:
 *            type: string
 *            example: "64fc5cd8212d9b80b90f9c73"
 *           tag:
 *            type: string
 *            example: "machine_status"
 *     requestBody:
 *       description: Slave data to add/update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorData'
 *     responses:
 *       '201':
 *         description: Slave added/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       '500':
 *         description: Unable to modify slave
 */

/**
 * @swagger
 * /gateway/{gatewayId}/slave:
 *   post:
 *     summary: create slave for a gateway
 *     tags:
 *       - Gateways
 *     parameters:
 *       - name: gatewayId
 *         in: path
 *         required: true
 *         description: ID of the gateway to add slave
 *         schema:
 *           type: string
 *     requestBody:
 *       description: slave data to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slaveId:
 *                 type: string
 *                 example: "s10"
 *               sensorData:
 *                  type: object
 *                  properties:
 *                    sensorId:
 *                      type: string
 *                      example: "64fc5cd8212d9b80b90f9c73"
 *                    tag:
 *                      type: string
 *                      example: "machine_status"
 *     responses:
 *       '201':
 *         description: slave record added successfully
 *         content:
 *           application/json:
 *       '500':
 *         description: Unable to modify IO record
 */
