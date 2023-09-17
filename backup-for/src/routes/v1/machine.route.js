const express = require('express');
const machineController = require('../../controllers/machine.controller');

const router = express.Router();

router.post('/addmachine', machineController.createMachine);
router.get('/findAllMachines', machineController.findMachines);
router.get('/findMachineById/:machineId', machineController.findMachineById);

router.get('/:gatewayId/gatewayMachines', machineController.findByGateway);
router.put('/updateMachine/:machineId', machineController.updateMachine);
router.delete('/deleteMachine/:machineId', machineController.deleteMachine);
// router.post('/defineGateway', machineController.updateGateway);
router.put('/:machineId/updateGateway/:gatewayId', machineController.updateGateway);
// dynamic booleans
router.put('/updateMapping/:machineId', machineController.updateMapping);
// slaves add or update slaves which are exists in gateway
router.post('/:machineId/slave', machineController.createSlaveInMachine);
router.put('/:machineId/slave', machineController.updateSlaveInMachine);
router.delete('/:machineId/slave/:slaveId', machineController.deleteSlave);
router.get('/:machineId/slave/:slaveId', machineController.findSlaveById);
// io di
// Create or update  an IO record for a gateway
router.post('/:machineId/io', machineController.createIORecord);
// Get all IO records for a gateway
router.get('/:machineId/io', machineController.getAllIORecords);
// Delete an existing IO record by ID
router.delete('/:machineId/io/:diId', machineController.deleteIORecord);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Machines
 *   description: Machine management
 */
/**
 * @swagger
 * /machines/addmachine:
 *   post:
 *     summary: Create a new machine.
 *     tags:
 *       - Machines
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               machineName:
 *                 type: string
 *               machine_type:
 *                 type: string
 *               machineLocation:
 *                 type: string
 *               machineMake:
 *                 type: string
 *               mfgEmail:
 *                 type: string
 *               machineMakeYear:
 *                 type: integer
 *               machineWarranty:
 *                 type: integer
 *               maintenancePerson:
 *                 type: string
 *               machinePhoto:
 *                 type: string
 *                 format: binary
 *               controllerPhoto:
 *                 type: string
 *                 format: binary
 *           required:
 *             - machineName
 *             - machine_type
 *     responses:
 *       '201':
 *         description: Machine created successfully.
 *         content:
 *           application/json:
 *       '400':
 *         description: Bad request. Invalid input.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /machines/findAllMachines:
 *   get:
 *     summary: Retrieve a list of all machines.
 *     tags: [Machines]
 *     responses:
 *       '200':
 *         description: A list of machines.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /machines/findMachineById/{machineId}:
 *   get:
 *     summary: Retrieve a machine by ID.
 *     description: Use this endpoint to retrieve a machine by its unique ID.
 *     tags: [Machines]
 *     parameters:
 *       - in: path
 *         name: machineId
 *     responses:
 *       '200':
 *         description: A list of machines.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /machines/{gatewayId}/gatewayMachines:
 *   get:
 *     summary: Retrieve a gateway by ID.
 *     description: Use this endpoint to retrieve a machines by its gatewayId.
 *     tags: [Machines]
 *     parameters:
 *       - in: path
 *         name: gatewayId
 *     responses:
 *       '200':
 *         description: A list of machines.
 *       '500':
 *         description: Internal server error.
 */
/**
 * @swagger
 * /machines/deleteMachine/{machineId}:
 *   delete:
 *     summary: Delete a machine by ID.
 *     tags: [Machines]
 *     description: Use this endpoint to delete a machine by its unique ID.
 *     parameters:
 *       - in: path
 *         name: machineId
 *         required: true
 *         description: ID of the machine to delete.
 *     responses:
 *       200:
 *         description: Machine deleted successfully.
 *       404:
 *         description: Machine not found.
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               message: Machine not found
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /machines/{machineId}/updateGateway/{gatewayId}:
 *   put:
 *     summary: Pair Machine and gateway
 *     description: Use this endpoint to update mapping of machine with gateway.
 *     tags: [Machines]
 *     parameters:
 *       - in: path
 *         name: gatewayId
 *       - in: path
 *         name: machineId
 *     responses:
 *       '200':
 *         description: A list of machines.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /machines/updateMachine/{machineId}:
 *   put:
 *     summary: use of postman recommended for this method as swagger creates empty fields which are not filled making empty objects unless all of the properties are updated
 *     tags: [Machines]
 *     description: Use this endpoint to update an existing machine's information.
 *     parameters:
 *       - in: path
 *         name: machineId
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               machineName:
 *                 type: string
 *               machine_type:
 *                 type: string
 *               machineLocation:
 *                 type: string
 *               machineMake:
 *                 type: string
 *               mfgEmail:
 *                 type: string
 *               machineMakeYear:
 *                 type: integer
 *               machineWarranty:
 *                 type: integer
 *               maintenancePerson:
 *                 type: string
 *               machinePhoto:
 *                 type: string
 *                 format: binary
 *               controllerPhoto:
 *                 type: string
 *                 format: binary
 *             required:
 *               - machineName
 *               - machine_type
 *     responses:
 *       200:
 *         description: Machine updated successfully.
 *       400:
 *         description: Invalid request body.
 *       404:
 *         description: Machine not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /machines/updateMapping/{machineId}:
 *   put:
 *     summary: Update a mapping of ideal and productive
 *     tags: [Machines]
 *     description: Use this endpoint to update an existing machine's mapping.
 *     parameters:
 *       - in: path
 *         name: machineId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/statusMapping'
 *     responses:
 *       200:
 *         description: Machine updated successfully.
 *       400:
 *         description: Invalid request body.
 *       404:
 *         description: Machine not found.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /machines/{machineId}/io:
 *   post:
 *     summary: Add or update an IO record for a machine
 *     tags:
 *       - Machines
 *     parameters:
 *       - name: machineId
 *         in: path
 *         required: true
 *         description: ID of the machine to add/update an IO record
 *         schema:
 *           type: string
 *     requestBody:
 *       description: IO data to add/update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diId:
 *                 type: string
 *                 example: "di1"
 *               sensorId:
 *                 type: string
 *                 example: "64fc5cd8212d9b80b90f9c73"
 *               tag:
 *                 type: string
 *                 example: "machine_status"
 *     responses:
 *       '201':
 *         description: IO record added/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 *       '500':
 *         description: Unable to modify IO record
 */
/**
 * @swagger
 * /machines/{machineId}/io:
 *   get:
 *     summary: Get all IO records for a machine
 *     tags:
 *       - Machines
 *     parameters:
 *       - name: machineId
 *         in: path
 *         required: true
 *         description: ID of the machine to get IO records for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of IO records for the machine
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IORecord'
 *       '404':
 *         description: Machine not found
 *       '500':
 *         description: Unable to fetch IO records
 */

/**
 * @swagger
 * /machines/{machineId}/io/{diId}:
 *   delete:
 *     summary: Delete an IO record by ID for a machine
 *     tags:
 *       - Machines
 *     parameters:
 *       - name: machineId
 *         in: path
 *         required: true
 *         description: ID of the machine containing the IO record
 *         schema:
 *           type: string
 *       - name: diId
 *         in: path
 *         required: true
 *         description: ID of the IO record to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: IO record deleted successfully
 *       '404':
 *         description: Machine or IO record not found
 *       '500':
 *         description: Unable to delete IO record
 */

/**
 * @swagger
 * /machines/{machineId}/slave:
 *   post:
 *     summary: create slave for a machine
 *     tags:
 *       - Machines
 *     parameters:
 *       - name: machineId
 *         in: path
 *         required: true
 *         description: ID of the machine to add slave
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

/**
 * @swagger
 * /machines/{machineId}/slave:
 *   put:
 *     summary: update slave for a machine
 *     tags:
 *       - Machines
 *     parameters:
 *       - name: machineId
 *         in: path
 *         required: true
 *         description: ID of the machine to add slave
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

/**
 * @swagger
 * /machines/{machineId}/slave/{slaveId}:
 *   delete:
 *     summary: Delete an slave record by ID for a machine
 *     tags:
 *       - Machines
 *     parameters:
 *       - name: machineId
 *         in: path
 *         required: true
 *         description: ID of the machine containing the slave record
 *         schema:
 *           type: string
 *       - name: diId
 *         in: path
 *         required: true
 *         description: ID of the slave record to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: slave record deleted successfully
 *       '404':
 *         description: Machine or slave record not found
 *       '500':
 *         description: Unable to delete slave record
 */
