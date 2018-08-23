const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const pfs = Promise.promisifyAll(fs);

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
  exports.readAll((err, todoList) => {
    if (err) {
      console.error('error reading one todo');
      throw 'error reading one todo';
    } else {
      let isFound = false;
      todoList.forEach((todo, index) => {
        if (todo.id === id) {
          callback(null, todo);
          isFound = true;
        }
      });
      if (!isFound) {
        callback('No todo found for that id', null);
      }
    }
  });
};

//GET
exports.readAll = callback => {
  fs.readdir(exports.dataDir, (err, fileNames) => {
    if (err) {
      console.error('Error reading files from directory');
    } else {
      // let fileData = _.map(fileNames, file => {
      //   let id = path.basename(file, '.txt');
      //   let filepath = path.join(exports.dataDir, file);
      //   return pfs.readFileAsync(filepath).then(text => {
      //     return { id, text: text.toString() };
      //   });
      // });
      let todoList = [];
      for (let file of fileNames) {
        let id = path.basename(file, '.txt');
        let filepath = path.join(exports.dataDir, file);
        todoList.push(
          pfs.readFileAsync(filepath).then(text => {
            return { id, text: text.toString() };
          })
        );
      }
      Promise.all(todoList)
        .then(fileData => {
          console.log('success callback');
          callback(null, fileData);
        })
        .catch(err => {
          console.log('failure callback');
          callback(err);
        });
    }
  });
};

//PUT
exports.update = (id, text, callback) => {
  exports.readOne(id, (err, todo) => {
    if (todo) {
      let updateTodoPath = `${exports.dataDir}/${id}.txt`;
      fs.writeFile(updateTodoPath, text, err => {
        if (err) {
          console.error('error updating todo');
          throw 'error updating todo';
        } else {
          callback(null, null);
        }
      });
    } else {
      callback('error updating non-existant todo', null);
    }
  });
};

//DELETE
exports.delete = (id, callback) => {
  exports.readOne(id, (err, todo) => {
    if (todo) {
      let updateTodoPath = `${exports.dataDir}/${id}.txt`;
      fs.unlink(updateTodoPath, err => {
        if (err) {
          console.error('error deleting todo');
          throw 'error deleting todo';
        } else {
          callback(null, null); //TBD a different callback?
        }
      });
    } else {
      callback('error deleting non-existant todo', null);
    }
  });
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
