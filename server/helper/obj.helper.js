const filterObjectByKeys = (obj, keysToKeep) => {
    const filteredObject = {};
  keysToKeep.forEach(key => {
    if (key in obj) {
      filteredObject[key] = obj[key];
    }
  });
  return filteredObject;
  }