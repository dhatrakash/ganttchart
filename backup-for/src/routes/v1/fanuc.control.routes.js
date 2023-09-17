const express = require('express');
const fanucController = require('../../controllers/fanuc.control.controller');

const router = express.Router();

router.get('/uptime/:machine/:hours', fanucController.findUptimeByHour);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Fanuc
 *   description: Fanuc Routes
 */

/**
 * @swagger
 * /fanuc/uptime/{machine}/{hours}:
 *  get:
 *    summary: Get uptime by fanuc machine name
 *    tags:
 *      - Fanuc
 *    parameters:
 *       - name: machine
 *         in: path
 *         required: true
 *         description: name of fanuc machine
 *       - name: hours
 *         in: path
 *         required: true
 *         description: how many recent hours?
 *    responses:
 *       '201':
 *         description: uptime data in array
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       '404':
 *         description: No machine found
 *       '500':
 *         description: Unable to fetch uptime
 */
