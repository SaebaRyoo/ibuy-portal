// Utility function to transform spec object
const transformSpecObject = specObject => {
  return Object.keys(specObject).map(key => ({
    name: key,
    value: specObject[key],
  }))
}

export default transformSpecObject
