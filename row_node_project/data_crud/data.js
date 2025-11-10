const fs = require('fs');
const path = require('path');
const crudFile = {};
///  Base directory
crudFile.baseDir = path.join(__dirname, '../../.data/')

// create data file
crudFile.create = (folder, file, data, callback) => {
    fs.open(crudFile.baseDir + folder + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.write(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false); // ✅ success
                        } else {
                            callback(`Could not close file: ${err3}`);
                        }
                    });
                } else {
                    callback(`Could not write file: ${err2}`);
                }
            });
        } else {
            callback(`Could not open file: ${err}`);
        }
    });
}


crudFile.read = (folder, file, callback) => {
    fs.readFile(crudFile.baseDir + folder + '/' + file + '.json', 'utf-8', (err, data) => {
        if (!err && data) {
            callback(false, data); // file exists, no error
        } else {
            callback(err, null); // file does not exist or read failed
        }
    })
}



crudFile.update = (folder, file, data, callback) => {
    const filePath = path.join(crudFile.baseDir, folder, file + '.json');

    fs.open(filePath, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false); // ✅ success
                                } else {
                                    callback('Could not close file');
                                }
                            });
                        } else {
                            callback('Could not write to file');
                        }
                    });
                } else {
                    callback('Could not truncate file');
                }
            });
        } else {
            callback(`Could not open file: ${err}`);
        }
    });
};

crudFile.delete = (folder, file, callback) => {
    const filePath = path.join(crudFile.baseDir, folder, file + '.json');
    fs.unlink(filePath, (err) => {
        if (!err) {
            callback(false); // ✅ success
        } else {
            callback('Could not delete file'); // actual error
        }
    });
};
module.exports = crudFile;