const express = require('express');
const sensorController = require('../../controllers/sensor.controller');

const router = express.Router();
router.post('/', sensorController.createSensor);
router.get('/', sensorController.findAllSensors);
router.get('/:sensorId', sensorController.findSensorById);
router.put('/:sensorId', sensorController.updateSensor);
router.delete('/:sensorId', sensorController.deleteSensor);

module.exports = router;

/**
 * @swagger
 * /sensors:
 *   post:
 *     summary: Create a new sensor
 *     tags:
 *       - Sensors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       201:
 *         description: Sensor created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sensors:
 *   get:
 *     summary: Get all sensors
 *     tags:
 *       - Sensors
 *     responses:
 *       200:
 *         description: List of sensors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 *       404:
 *         description: Sensors not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sensors/{sensorId}:
 *   get:
 *     summary: Get a sensor by ID
 *     tags:
 *       - Sensors
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         description: ID of the sensor to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sensor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sensors/{sensorId}:
 *   put:
 *     summary: Update a sensor by ID
 *     tags:
 *       - Sensors
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         description: ID of the sensor to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       200:
 *         description: Updated sensor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /sensors/{sensorId}:
 *   delete:
 *     summary: Delete a sensor by ID
 *     tags:
 *       - Sensors
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         description: ID of the sensor to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted sensor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Internal server error
 */
