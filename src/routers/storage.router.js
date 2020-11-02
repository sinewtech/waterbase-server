const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const middlewares = require('../middlewares');
const File = require('../models/Files.model');

const Storage = express.Router();
const dest = process.env.FILES_FOLDER || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, next) => {
    const { path: reqPath } = req.body;
    const justFolders = path.dirname(reqPath);
    const newDestination = path.normalize(`${dest}/${justFolders}`);
    let stat = null;
    try {
      stat = fs.statSync(newDestination);
    } catch (err) {
      fs.mkdirSync(newDestination, { recursive: true });
    }
    if (stat && !stat.isDirectory()) {
      throw new Error(
        `Directory cannot be created because an inode of a different type exists at "${dest}"`,
      );
    }
    next(null, newDestination);
  },
  filename: (req, _file, cb) => {
    const { path: reqPath } = req.body;
    const justFile = path.basename(reqPath);
    cb(null, `${justFile}`);
  },
});

const upload = multer({ storage });

Storage.use(middlewares.keyChecker);

// Get a file
Storage.post('/file', (req, res, next) => {
  const { path: filePath } = req.body;
  const finalPath = path.normalize(filePath);
  File.findOne({ path: finalPath })
    .then((doc) => {
      res.status(200).json({
        success: doc !== null,
        file: doc ? { ...doc.toJSON(), path: `${dest}\\${doc.path}` } : null,
      });
    })
    .catch(next);
});

// Upload a file
Storage.post('/', upload.single('file'), (req, res, next) => {
  const { path: filePath } = req.body;
  File.create({ path: path.normalize(filePath) })
    .then((info) => {
      res.status(200).json({ ...info.toJSON() });
    })
    .catch(next);
});

// Delete a file
Storage.delete('/', (req, res, next) => {
  const { path: filePath } = req.body;
  const finalPath = path.normalize(filePath);
  File.findOneAndDelete({ path: finalPath })
    .then((data) => {
      if (data !== null) {
        fs.unlink(`${dest}\\${filePath}`, (error) => {
          if (error) next(error);
          removeEmptyDirectories(dest).then(() => {
            res.status(200).json({ success: true, info: data });
          });
        });
      } else {
        res.status(200).json({ success: false, info: data });
      }
    })
    .catch(next);
});

// Update a file
Storage.put('/', upload.single('file'), (req, res, next) => {
  const { path: newFilePath, oldPath: oldFilePath } = req.body;
  const newFinalPath = path.normalize(newFilePath);
  const oldFinalPath = path.normalize(oldFilePath);
  File.findOneAndUpdate({ path: oldFinalPath }, { $set: { path: newFinalPath } })
    .then((data) => {
      if (data !== null) {
        fs.unlink(`${dest}\\${oldFilePath}`, (error) => {
          if (error) {
            next(error);
          } else {
            removeEmptyDirectories(dest).then(() => {
              res.status(200).json({ success: true, info: data });
            });
          }
        });
      } else {
        res.status(200).json({ success: false, info: data });
      }
    })
    .catch(next);
});

const removeEmptyDirectories = async (directory) => {
  const fileStats = await fsPromises.lstat(directory);
  if (!fileStats.isDirectory()) {
    return;
  }
  let fileNames = await fsPromises.readdir(directory);
  if (fileNames.length > 0) {
    // eslint-disable-next-line max-len
    const recursiveRemovalPromises = fileNames.map((fileName) =>
      removeEmptyDirectories(path.join(directory, fileName)),
    );
    await Promise.all(recursiveRemovalPromises);

    fileNames = await fsPromises.readdir(directory);
  }
  if (fileNames.length === 0) {
    await fsPromises.rmdir(directory);
  }
};

Storage.use(middlewares.defaultError);

module.exports = Storage;
