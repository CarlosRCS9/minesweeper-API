'use strict';

const arraySample = (array, sampleSize) => {
  const sample = new Array(sampleSize);
  let arrayLength = array.length;
  const taken = new Array(arrayLength);
  if (sampleSize > arrayLength) {
    // eslint-disable-next-line max-len
    throw new RangeError('sampleSize must be less than the number of elements in the array');
  }
  while (sampleSize--) {
    const item = Math.floor(Math.random() * arrayLength);
    sample[sampleSize] = array[item in taken ? taken[item] : item];
    taken[item] = --arrayLength in taken ? taken[arrayLength] : arrayLength;
  }
  return sample;
};

module.exports = arraySample;
