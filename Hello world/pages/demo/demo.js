//demo.js

Page({
  formSubmit: function(e) {
    console.log('form happen submit event with data: ', e.detail.value)
  },

  formReset: function() {
    console.log('form happen reset event')
  }
})