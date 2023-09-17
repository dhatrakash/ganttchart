

// attributes -> sid & sensor name or other value

// temp , energy meter get this sensor list  & conversion parameters

/* 
- adding object of statusmapping in machine schema, 
- we can access machine through (yet to create)  
- function => findmachinebymacId  (hardware service mostly works on macaddress) gateway.macAddress in service layer - - we can assign two variables like ideal and productive  with that object 
  e.g db.find({'data.mac' : 'xyz' , 'data.di1': idle }) // finding idle data 
  e.g db.find({'data.mac' : 'xyz' , 'data.di1': productive }) // finding productive data 

   // here ideal is dynamic because that is fetched from machine.statusmapping object
*/

/* Possible sensor connections
Temperature
Current
Vibration
Acceleration
RPM
Noise
Pressure
Oil Level
Proximity
Flow Meter
Pulse Counter
Load cell
PPM (Parts Per Million)
Moisture Content
Oil Quality 
Oil Temperature
Custom
Generic rating where first value = lower bound and second value = upper bound
Types - Current & Voltage
Generic 4-20 mA 
Generic 0-20 mA
Generic 0-5 V (mV)
*/

take conversion logic

/* 
  so thers is mechanical industry, which will first have sensor configration, then gateway config which will setup all sensors to their slave id as Im using mqtt device to connect them slaves can have multiple sensors usually one slave is connected to one machine mqtt can have multiple slaves at once, gateway can be burnt so we are gonna take isactive to show if it is active, this gateway have multiple machines so we need machines the data generated will come through mqtt device and through broker and with mongoose schema and saved in the mongodb and which will then be used to fetch it when needed with machine id and mac id combo
*/

# what I have done
  - task => give dynamic nature to 0's and 1's
    - resolution => added machine status in machine model and modified related apis.
  - task => Need sensors for modbus 
    - resolution => created sensor model
  - task => sensors need particular conversion
    - resolution => added conversion schema/ model nested in sensor
  - task => need seperate gateway for each mac address
    - resolution => created gateway model
  - task => each gateway has multiple slaves 
    - resolution => added nested slaves schema in gateway to hold slaves array of sensors (slaves can hold multiple sensors )
  - other => added apis  
    -- crud of sensors, gateway, machine
    -- to access sensors nested in slaves 
    -- to access slaves nested in gateway
    -- added api to access multiple gateway (dynamic gantt chart in frontend)

  -- yet to complete 
    -- add sensor or access based on machine in particular gateway
    -- based on that need to add decoding in machine model for hardwire data
