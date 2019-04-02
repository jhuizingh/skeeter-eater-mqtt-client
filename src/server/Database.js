import fs from 'fs';
import path from 'path';
import WebSocketHandler from './web-sockets';
import CollectionHelper from './utilities/collectionHelper';

const dataDir = process.env.DATABASE_DIRECTORY || './src/server/data';
function getCollectionFilename(name) {
  return path.join(dataDir, `${name}.json`);
}

// This is a very simple data store that puts the objects in a file
// corresponding to the name of the collection.
class Database {
  _collections = {};

  _writeFile = async (fileName, collection) => {
    try {
      await fs.promises.writeFile(fileName, JSON.stringify(collection, null, 2), 'utf8');

      return true;
    } catch (writeErr) {
      console.log(`got error writing file [${fileName}]`);
      console.log(writeErr);
      return false;
    }
  };

  async getCollection(name) {
    if (Object.keys(this._collections).includes(name)) {
      return Promise.resolve(this._collections[name]);
    }

    const fileToRead = getCollectionFilename(name);
    // console.log(`Attempting to open ${fileToRead}`);
    try {
      const file = await fs.promises.readFile(fileToRead, 'utf8');

      const collection = JSON.parse(file);

      return collection;
    } catch (readErr) {
      console.log(`got error reading file [${fileToRead}]`);
      console.log(readErr);

      if (readErr.code === 'ENOENT') {
        try {
          const collection = [];
          const writeResult = await this._writeFile(fileToRead, collection);
          if (!writeResult) return false;
          return collection;
        } catch (writeErr) {
          console.log(`got error writing file [${fileToRead}]`);
          console.log(writeErr);
          return false;
        }
      }
    }
    return false;
  }

  async upsert(collectionName, object) {
    const filename = getCollectionFilename(collectionName);

    const collection = await this.getCollection(collectionName);
    console.log('retrieved collection from getCollection=');
    console.log(collection);

    const toSave = object;

    console.log(`Finding id  toSave.id=[${toSave.id}]`);

    let action = '';
    // Save new object
    if (!CollectionHelper.CollectionContainsItemById(collection, toSave)) {
      // if (indexOfExisting === -1) {
      console.log('No match. Add new record to collection.');
      CollectionHelper.AddItem(collection, toSave);
      //        collection.push(toSave);
      action = 'add';
    } else {
      CollectionHelper.UpdateItemById(collection, toSave);
      action = 'edit';
    }

    const writeResult = await this._writeFile(filename, collection);
    if (!writeResult) return false;

    WebSocketHandler.send(collectionName, action, toSave);
    return true;
  }

  delete = async (collectionName, id) => {
    const filename = getCollectionFilename(collectionName);
    const collection = await this.getCollection(collectionName);

    if (!CollectionHelper.RemoveItemById(collection, id)) {
      console.log('Item did not exist in collection. Returning false.');
      return false;
    }

    const writeResult = await this._writeFile(filename, collection);
    if (!writeResult) return false;

    WebSocketHandler.send(collectionName, 'delete', { id });
    return true;
  };
}

const db = new Database();

export default db;
