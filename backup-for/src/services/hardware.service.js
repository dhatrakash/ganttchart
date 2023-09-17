const moment = require('moment');
const Hardware = require('../models/hardware.model');

const findDataByTimeFrame = async (requestBody) => {
  const hours = parseInt(requestBody.hours, 10);
  const { mac } = requestBody;
  // Subtract the hours from the current date and time
  const startTime = moment().subtract(hours, 'hours').utc().format();
  const endTime = moment.utc().format();
  const foundData = await Hardware.find({
    'data.mac': mac,
    'data.dtm': { $gte: startTime, $lte: endTime },
  });
  return foundData;
};
const findDataByTimeFrame1 = async (reqQuery) => {
  const hours = parseInt(reqQuery.hours, 10);
  const { mac } = reqQuery;
  // Subtract the hours from the current date and time
  const startTime = moment().subtract(hours, 'hours').utc().format();
  const endTime = moment().utc().format();

  const foundData = await Hardware.find({
    'data.mac': mac,
    'data.dtm': { $gte: startTime, $lte: endTime },
  });

  return foundData;
};

const fetchDataByTimeInterval = async (interval, date) => {
  let hours = 1;
  if (interval === '8h') {
    hours = 8;
  } else if (interval === '24h') {
    hours = 24;
  }
  const selectedDate = moment.utc(`${date}T00:00:00.000Z`);
  const startDate = selectedDate.clone().subtract(hours, 'hours').format('YYYYMMDDHHmmss');
  const endDate = selectedDate.format('YYYYMMDDHHmmss');

  const query = {
    'data.dtm': {
      $gte: startDate,
      $lt: endDate,
    },
  };

  const data = await Hardware.find(query, 'data.io.cycle data.mac');
  return data;
};

const oeeCalculation = async (selectedDateTime, mac) => {
  const windowStart = moment.utc(selectedDateTime, 'YYYYMMDDHHmmss').subtract(24, 'hours');
  const windowEnd = moment.utc(selectedDateTime, 'YYYYMMDDHHmmss');

  const datafetch = await Hardware.find({
    'data.mac': mac,
    'data.dtm': {
      $gte: windowStart.format('YYYYMMDDHHmmss'),
      $lt: windowEnd.format('YYYYMMDDHHmmss'),
    },
  });
  const results = [];
  while (windowStart.isBefore(windowEnd)) {
    const currentHourStart = windowStart.clone();
    const currentHourEnd = windowStart.clone().add(1, 'hour');
    const resultArray = {
      hour: currentHourStart.format('YYYYMMDDHHmmss'),
      productionTime: 0,
      idealTime: 0,
      production: 0,
      OEE: 0,
    };

    datafetch.forEach((doc) => {
      const itemTime = moment(doc.data.dtm, 'YYYYMMDDHHmmss');
      if (itemTime.isBetween(currentHourStart, currentHourEnd)) {
        const machineStatus = doc.data.io.machine_status;
        const cycle = doc.data.io.cycle;
        if (machineStatus === 0) {
          resultArray.idealTime++;
        } else if (machineStatus === 1) {
          resultArray.productionTime++;
        }

        resultArray.production += cycle;

        const totalHour = resultArray.productionTime + resultArray.idealTime;
        const idealCycleTime = 50;
        const rejection = 0;
        const goodUnit = resultArray.production - rejection;

        const availability = resultArray.productionTime / totalHour;
        const performance = (idealCycleTime * resultArray.production) / resultArray.productionTime;
        const quality = 0.7; /*Good Units Produced / Total Units Produced*/
        resultArray.OEE = availability * performance * quality;
      }
    });
    results.push(resultArray);
    windowStart.add(1, 'hour');
  }
  return results;
};

const allMachineOEE = async (selectedDateTime) => {
  const windowStart = moment.utc(selectedDateTime, 'YYYY-MM-DD').subtract(1, 'day');
  const windowEnd = moment.utc(selectedDateTime, 'YYYY-MM-DD');
  const datafetch = await Hardware.find({
    'data.dtm': {
      $gte: windowStart.format('YYYYMMDDHHmmss'),
      $lt: windowEnd.format('YYYYMMDDHHmmss'),
    },
  });

  const results = [];
  while (windowStart.isBefore(windowEnd)) {
    const currentHourStart = windowStart.clone();
    const currentHourEnd = windowStart.clone().add(1, 'hour');
    const resultArray = {
      hour: currentHourStart.format('YYYYMMDDHHmmss'),
      productionTime: 0,
      idealTime: 0,
      production: 0,
      OEE: 0,
    };

    datafetch.forEach((doc) => {
      const itemTime = moment(doc.data.dtm, 'YYYYMMDDHHmmss');
      if (itemTime.isBetween(currentHourStart, currentHourEnd)) {
        const machineStatus = doc.data.io.machine_status;
        const cycle = doc.data.io.cycle;
        if (machineStatus === 0) {
          resultArray.idealTime++;
        } else if (machineStatus === 1) {
          resultArray.productionTime++;
        }

        resultArray.production += cycle;

        const totalHour = resultArray.productionTime + resultArray.idealTime;
        const idealCycleTime = 50;
        const rejection = 0;
        const goodUnit = resultArray.production - rejection;

        const availability = resultArray.productionTime / totalHour;
        const performance = (idealCycleTime * resultArray.production) / resultArray.productionTime;
        const quality = 0.7; /*Good Units Produced / Total Units Produced*/
        resultArray.OEE = availability * performance * quality;
      }
    });
    results.push(resultArray);
    windowStart.add(1, 'hour');
  }
  return results;
};

const dataForPDF = async (date) => {
  const selectedDate = moment.utc(`${date}T00:00:00.000Z`);
  const startDate = selectedDate.clone().subtract(1, 'day').format('YYYYMMDDHHmmss');
  const endDate = selectedDate.format('YYYYMMDDHHmmss');

  const datafetch = await Hardware.find({
    'data.dtm': {
      $gte: startDate,
      $lt: endDate,
    },
  });

  const resultArray = {
    totalHour: 22,
    machineOnTime: 0,
    rejectionQuantity: 0,
    actualProduction: 0,
    part_2055566_3rd: 9,
    production: 0,
    targetProduction: 400,
    firstCycle: 0,
    lastCycle: 0,
    part_8PEE027000161N_2ND: 120,
    avgCycleTime: 0,
    productionTime: 0,
    idealTime: 0,
    mhrLoss: 0,
  };

  const cycleStart = { start: false };
  let cycleTime = '00:00:00';
  let cycleStartstartTime = '00:00:00';
  let cycleCount = 0;
  const results = [];

  datafetch.forEach((doc) => {
    const machineStatus = doc.data.io.machine_status;
    const cycle = doc.data.io.cycle;
    if (cycleStart.start === false) {
      cycleStart.start = true;
      const dateTimeString = doc.data.dtm;
      cycleStartstartTime = moment(dateTimeString, 'YYYYMMDDHHmmss').format('HH:mm:ss');
    }

    if (cycle === 1) {
      cycleStart.start = false;
      cycleCount += 1;
      const dateTimeString = doc.data.dtm;
      const cycleEndTime = moment(dateTimeString, 'YYYYMMDDHHmmss').format('HH:mm:ss');
      const momentTime1 = moment(cycleStartstartTime, 'HH:mm:ss');
      const momentTime2 = moment(cycleEndTime, 'HH:mm:ss');
      const momentTimeToAdd = moment(cycleTime, 'HH:mm:ss');
      const timeDifference1 = momentTime2.diff(momentTime1);
      const timeDifference2 = momentTimeToAdd.diff(moment('00:00:00', 'HH:mm:ss'));
      const sumTimeDifference = timeDifference1 + timeDifference2;
      const Duration = moment.duration(sumTimeDifference, 'seconds');
      cycleTime = moment.utc(Duration.asMilliseconds()).format('HH:mm:ss');
    }

    if (machineStatus === 0) {
      resultArray.idealTime++;
    } else if (machineStatus === 1) {
      resultArray.productionTime++;
    }

    resultArray.production += cycle;
    resultArray.actualProduction = resultArray.production;
    resultArray.machineOnTime = resultArray.productionTime + resultArray.idealTime;
  });

  if (cycleCount !== 0) {
    const duration1 = moment.duration(cycleTime);
    const totalSeconds = duration1.asSeconds();
    const averageTotalSeconds = totalSeconds / cycleCount;
    const averageDuration = moment.duration(averageTotalSeconds, 'seconds');
    const averageTimeString = moment.utc(averageDuration.asMilliseconds()).format('HH:mm:ss');
    resultArray.avgCycleTime = averageTimeString;
  }

  results.push(resultArray);

  return results;
};

const createHardware = async (hardwareData) => {
  try {
    const createdHardware = await Hardware.create(hardwareData);
    return createdHardware;
  } catch (error) {
    throw new Error('Failed to create hardware error');
  }
};

module.exports = {
  // req.body based post
  findDataByTimeFrame,
  // uri based get
  findDataByTimeFrame1,
  // parts count
  fetchDataByTimeInterval,
  // OEE,parts count,performance time,ideal time
  oeeCalculation,
  // OEE calculation include all machine.
  allMachineOEE,
  // data for pdf generation.
  dataForPDF,
  // creating hardware data
  createHardware,
};
