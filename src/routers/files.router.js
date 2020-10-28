const express = require('express');
const multer = require('multer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const middlewares = require('../middlewares');
const File = require('../models/Files.model');

const Files = express.Router();
const dest = process.env.FILES_FOLDER || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, next) => {
    const { path: reqPath } = req.body;
    const newDestination = `${dest}/${reqPath}`;
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
  filename: (_req, file, cb) => {
    // randomBytes function will generate a random name
    const customFileName = crypto.randomBytes(18).toString('hex');
    // get file extension from original file name
    const fileExtension = path.extname(file.originalname).split('.')[1];
    cb(null, `${customFileName}.${fileExtension}`);
  },
});

const upload = multer({ storage });

// Get all the media files
Files.get('/', (req, res, next) => {
  File.find()
    .then((data) => {
      res.status(200).json({ success: true, files: data });
    })
    .catch(next);
});

Files.get('/:id', (req, res, next) => {
  const { id } = req.params;
  File.findOne({ _id: id })
    .then((data) => {
      res.status(200).json({ success: true, files: data });
    })
    .catch(next);
});

// Upload a file
Files.post('/', upload.single('file'), (req, res, next) => {
  const { file } = req;
  File.create({ name: file.originalname, path: file.path })
    .then((info) => {
      res.status(200).json({ success: true, ...info.toObject() });
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

// Delete file
Files.delete('/', (req, res, next) => {
  const { body } = req;
  const { where } = body;
  File.findOneAndDelete(where)
    .then((data) => {
      fs.unlink(data.path, (error) => {
        if (error) next(error);
        removeEmptyDirectories(dest).then(() => {
          res.status(200).json({ success: true, info: data });
        });
      });
    })
    .catch(next);
});

// Update file
Files.put('/', upload.single('file'), (req, res, next) => {
  const { file } = req;
  const { id } = req.body;

  File.findOneAndUpdate({ _id: id }, { $set: { name: file.originalname, path: file.path } })
    .then((data) => {
      const object = data.toObject();
      fs.unlink(object.path, (err) => {
        if (err) next(err);
        removeEmptyDirectories(dest).then(() => {
          res.status(200).json({ success: true, ...object });
        });
      });
    })
    .catch(next);
});

Files.use(middlewares.defaultError);

module.exports = Files;
