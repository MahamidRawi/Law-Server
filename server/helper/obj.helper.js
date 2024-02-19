const { v4: uuid_v4 } = require('uuid');

const filterObjectByKeys = (obj, keysToKeep) => {
    const filteredObject = {};
  keysToKeep.forEach(key => {
    if (key in obj) {
      filteredObject[key] = obj[key];
    }
  });
  return filteredObject;
  }


  function updateArray(array, name, role, propertyToChange, newValue) {
    const index = array.findIndex(item => item.name === name && item.role === role);
    if (index !== -1) {
      array[index][propertyToChange] = newValue;
    }
    return array;
  }

  const generateSession = (subpoenee, caseId) => {
      return {
        depositionId: uuid_v4(),
        subpoenee,
        caseId 
      }
  }

module.exports = updateArray
module.exports = generateSession