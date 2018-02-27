// wx-key-demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectArray:[
      {id: 5, unique: 'unique_5'},
      { id: 4, unique: 'unique_4' },
      { id: 3, unique: 'unique_3' },
      { id: 2, unique: 'unique_2' },
      { id: 1, unique: 'unique_1' },
      { id: 0, unique: 'unique_0' },
    ],
    numberArray: [1, 2, 3, 4]
  },

  zx_switch: function(e) {
    const length = this.data.objectArray.length
    console.log('----')
    for (let i = 0; i < length; i++) {
      const x = Math.floor(Math.random() * length)//0-6
      
      const y = Math.floor(Math.random() * length)//0-6
      if (x == length-1 || y == length-1) {
        console.log('!! ->' + x + ',' + y)
      }
      const temp = this.data.objectArray[x]
      this.data.objectArray[x] = this.data.objectArray[y]
      this.data.objectArray[y] = temp
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },

  zx_addToFront: function(e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{id: length, unique: 'unique_' + length}].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },

  zx_addNumberToFront: function(e) {
    this.data.numberArray = [ this.data.numberArray.length + 1 ].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  }
})