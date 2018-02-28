// util.js
module.exports = {
  // 一维数组转二维数组
  listToMatrix(list, elementPerSubArray) {
    let matrix = [], i ,k;
    for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }

      matrix[k].push(list[i]);
    }

    return matrix;
  },

  always(promise, callback) {
    promise.then(callback, callback);
    return promise
  }
}