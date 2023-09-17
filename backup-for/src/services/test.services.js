const Hardware = require('../models/hardware.model');

const cycleCount = async () => {
  // pipe1 grouping and finding machine_status and adding object array & display
  const pipe1 = [
    { $addFields: { dtmDate: { $toDate: '$data.dtm' } } },
    { $sort: { dtmDate: 1 } },
    {
      $group: {
        _id: '$data.io.machine_status',
        consecutiveDocs: { $push: '$$ROOT' },
        count: { $sum: 1 },
      },
    },
    // { $match: { _id: 0, 'consecutiveDocs.0.data.io.machine_status': 1 } },
    // { $count: 'changeCount' },
  ];
  // pipe2  failed finding which 1's are followed by 0's indirectly counting change in machine_status
  const pipe2 = [
    { $addFields: { dtmDate: { $toDate: '$data.dtm' } } },
    { $sort: { dtmDate: 1 } },
    {
      $group: {
        prevStatus: { $last: '$data.io.machine_status' },
        prevStatus1: { $push: '$prevStatus' },
        _id: null,
        changeCount: {
          $sum: {
            $cond: [
              { $ne: ['$data.io.machine_status', '$prevStatus'] },
              1, // add 1 if not matched
              0, // add 0 if matched
            ],
          },
        },
      },
    },
  ];
  // pipe 3 counts total uptime assumption: json has 1 sec of data
  const pipe3 = [
    { $match: { 'data.io.machine_status': 1 } }, // Match documents with machine_status: 1 you can change to 0 if you want to find out idle time
    { $count: 'machine_status_1_count' }, // Count the documents
  ];
  // avaliablity di1,
  // production time{1} idle time{0} di2 {runtime}
  // continous aggergation

  const result = await Hardware.aggregate(pipe3);
  console.log(result);
};

// uncomment this function call to test

// cycleCount('608A10B60822');
