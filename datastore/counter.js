//TBD  do we need the below
// import { write } from 'fs';

const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions-- DO NOT MODIFY
//////////////////////////////////////////////

const zeroPaddedNumber = num => {
  return sprintf('%05d', num);
};

const readCounter = callback => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, err => {
    if (err) {
      throw 'error writing counter';
    } else {
      callback(null, counterString);
    }
  });
};

// Public API -- YOU CAN TOUCH THIS
//////////////////////////////////////////////

exports.getNextUniqueId = callback => {
  //read counter txt
  readCounter((err, num) => {
    //write counter txt and increment counter
    writeCounter(num + 1, (err, uniqueId) => {
      //return counter
      callback(null, uniqueId);
    });
  });
};

// Configuration -- DO NOT MODIFY
//////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
