//index.js
//获取应用实例
const app = getApp()

Page({
  // 前往相册页
  goToAlbum() {
    wx.navigateTo({
      url: '../album/album',
    })
  }
})
