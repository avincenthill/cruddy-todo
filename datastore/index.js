const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
//FIX THESE BELOW//////////////////////
exports.dataDir = path.join(__dirname, 'data');
exports.create = (text, callback) => {
  let id = null;
  counter.getNextUniqueId((err, number) => {
    if (err) {
      console.log('ERROR in create');
    } else {
      id = number;
      // let filePath = path.join(__dirname, 'data', id + '.txt');
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, () => {
        //on failure/success
        //TBD pass in callback instead of this anonf
      });
    }
  });

  //TBD: do we need these below?
  //volatile solution
  items[id] = text;

  //send back success http response
  callback(null, { id: id, text: text });
};

exports.readOne = (id, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id: id, text: item });
  }
};

exports.readAll = callback => {
  var data = [];
  _.each(items, (item, idx) => {
    data.push({ id: idx, text: items[idx] });
  });
  callback(null, data);
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id: id, text: text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

//bash command to clear data stores - AVH
/*
rm /Users/student/hrsf102-cruddy-todo/datastore/data/*.txt && rm /Users/student/hrsf102-cruddy-todo/test/testData/*.txt
*/
