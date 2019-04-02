import uuid from 'uuid';

function matchingId(val) {
  return val.id === this.id;
}

export default class CollectionHelper {
  static CollectionContainsItemById = (collection, item) => {
    const indexOfExisting = collection.findIndex(matchingId, item);
    return indexOfExisting !== -1;
  };

  static GetIndexOfItemById = (collection, item) => collection.findIndex(matchingId, item);

  static AddItem = (collection, item) => {
    const toAdd = item;
    if (!toAdd.id) {
      // eslint-disable-next-line no-param-reassign
      toAdd.id = uuid.v4();
      console.log('item is new, added id');
    }
    collection.push(toAdd);
  };

  static UpdateItemById = (collection, item) => {
    const indexOfExisting = CollectionHelper.GetIndexOfItemById(collection, item);
    if (indexOfExisting !== -1) {
      collection.splice(indexOfExisting, 1, item);
    }
  };

  static RemoveItemById = (collection, id) => {
    const indexOfExisting = CollectionHelper.GetIndexOfItemById(collection, { id });
    console.log(`indexOfExisting=[${indexOfExisting}]`);
    if (indexOfExisting !== -1) {
      collection.splice(indexOfExisting, 1);
      return true;
    }
    return false;
  };

  static GetSetStateDelegate(action, collectionPropertyNameInState, item) {
    return (state) => {
      const newState = {};
      const collection = state[collectionPropertyNameInState];
      newState[collectionPropertyNameInState] = collection;

      console.log(`action is [${action}]`);
      if (action === 'add') {
        CollectionHelper.AddItem(collection, item);
      } else if (action === 'edit') {
        CollectionHelper.UpdateItemById(collection, item);
      } else if (action === 'delete') {
        CollectionHelper.RemoveItemById(collection, item.id);
      }

      console.log('newState');
      console.log(newState);
      return newState;
    };
  }
}
