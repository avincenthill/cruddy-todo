const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
//TBD fix these functions

exports.dataDir = path.join(__dirname, 'data');

//POST
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.error('error getting next unique id');
      throw 'error getting next unique id';
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, err => {
        if (err) {
          console.error('error writing to file');
          throw 'error writing to file';
        } else {
          //pass back todo obj into http body cb in app.post
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};

//GET
exports.readOne = (id, callback) => {
  //TBD: implement nonvolatile solution

  //volatile solution
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id: id, text: item });
  }
};

//GET
exports.readAll = callback => {
  fs.readdir(exports.dataDir, (err, fileNames) => {
    if (err) {
      console.error('error reading from directory');
      throw 'error reading directory';
    } else {
      let todoList = [];
      for (let file of fileNames) {
        todoList.push({ id: file.slice(0, -4), text: file.slice(0, -4) });
      }
      callback(null, todoList);
    }
  });

  // call readdir, async.
  // create objects with just {id: id, text: id}
  // later, when we know promises, we can promise the right text.
  // push objects from result of readdir onto data array.
  // when we get to base of callback hell, invoke original callback with return array.
  //invoke callback on something.
  // return an array with all saved todo objects: {id: id, text: text}
  //volatile solution

  // var data = [];
  // _.each(items, (item, idx) => {
  //   data.push({ id: idx, text: items[idx] });
  // });
  // callback(null, data);
};

//PUT
exports.update = (id, text, callback) => {
  //TBD: implement nonvolatile solution

  //volatile solution
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id: id, text: text });
  }
};

//DELETE
exports.delete = (id, callback) => {
  //TBD: implement nonvolatile solution

  //volatile solution
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
