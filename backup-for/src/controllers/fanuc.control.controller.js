const express = require('express');

const fanucControlService = require('../services/fanuc.control.service');

const findUptimeByHour = async (req, res) => {
  try {
    const { machine, hours } = req.params; // Destructure the parameters
    const data = await fanucControlService.findUptimeByHour(machine, hours);

    if (!data[0]) {
      return res.status(404).json({ error: 'No data found' });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: `Server error while finding uptime data for machine: ${error}` });
  }
};

module.exports = {
  findUptimeByHour,
};
