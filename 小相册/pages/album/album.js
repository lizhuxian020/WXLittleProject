// album.js
const config = require('../../config.js');
const { listToMatrix, always} = require('../../lib/util.js');
const request = require('../../lib/request.js');
const api = require('../../lib/api.js');

Page({
  data: {
    albumLIst: [],
    layoutList: [],
    layoutColumSize: 3,
    showLoading: false,
    loadingMessage: '',
    showToast: false,
    toastMessage: '',
    showActionsSheet: '',
    imageInAction: '',
    previewMode: false,
    previewIndex: 0,
  },

  showLoading(loadingMessage) {
    this.setData({showLoading: true, loadingMessage});
  },

  hideLoading() {
    this.setData({showLoading: false, loadingMessage: ''});
  },

  showToast(toastMessage) {
    this.setData({ showToast: true, toastMessage});
  },

  hideToast() {
    this.setData({showToast: false, toastMessage: ''});
  },

  hideActionSheet() {
    this.setData({ showActionsSheet: false, imageInAction: ''});
  },

  onLoad() {
    this.renderAlbumList();
    this.getAlbumList().then((resp)=>{
      if (resp.code !== 0) {
        return;
      }
      this.setData({'albumList': this.data.albumList.concat(resp.data)});
      this.renderAlbumList();
    });
  },

  getAlbumList() {
    this.showLoading('加载列表中....');
    setTimeout(()=>this.hideLoading(), 1000);
    return request({method: 'GET', url: api.getUrl('/list')});
  },

  renderAlbumList() {
    let layoutColumnSize = this.data.layoutColumnSize;
    let layoutList = [];
    if (this.data.albumList.length) {
      layoutList = listToMatrix([0].concat(this.data.albumList), layoutColumnSize);
      let lastRow = layoutList[layoutList.length -1];
      if (lastRow.length < layoutColumnSize) {
        let supplement = Array(layoutColumnSize - lastRow.length).fill(0);
        lastRow.push(...supplement);
      }
    }
    this.setData({layoutList});
  },

  chooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.showLoading('正在上传图片....');
        console.log(api.getUrl('/upload'));
        wx.uploadFile({
          url: api.getUrl('/upload'),
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: (res) => {
            let response = JSON.parse(res.data);
            if (response.code === 0) {
              console.log(response);
              let albumList = this.data.albumList;
              albumList.unshift(response.data.imgUrl);
              this.setData({albumList});
              this.renderAlbumList();
              this.showToast('图片上传成功');
            } else {
              console.log(response);
            }
          },
          fail: (res) =>{ 
            console.log('fail', res);
          },
          complete: () => {
            this.hideLoading();
          }
        })
      }
    })
  },

  enterPreviewMode(event) {
    if (this.data.showActionsSheet) {
      return ;
    }
    let imageUrl = event.target.dataset.src;
    let previewIndex = this.data.albumList.indexOf(imageUrl);
    this.setData({previewMode: true, previewIndex: previewIndex});
  },
  
  leavePreviewMode() {
    this.setData({previewMode: false, previewIdnex: 0});
  },

  showActions(event) {
    this.setData({showActionsSheet: true, imageInAction: event.target.dataset.src});
  },

  downloadImage() {
    this.showLoading('正在保存图片...');
    console.log('download_image_url', this.data.imageInAction);
    wx.downloadFile({
      url: this.data.imageInAction,
      type: 'image',
      success: (resp) => {
        wx.saveFile({
          tempFilePath: resp.tempFilePath,
          success: (resp) =>{
            this.showToast('图片保存成功');
          },
          fail: (resp) => {
            console.log('fail', resp);
          },
          complete: (resp) => {
            console.log('complete', resp);
            this.hideLoading();
          },
        });
      },
    });
    this.setData({showActionsSheet: false, imageInAction: ''});
  },

  deleteImage() {
    let imageUrl = this.data.imageInAction;
    let filepath = '/' + imageUrl.split('/').slice(3).join('/');
    this.showLoaidng('正在删除图片');
    this.setData( {showActionsSheet: false, imageInAction: ''});
    request({
      method: 'POST',
      url: api.getUrl('/delete'),
      data: {filepath},
    }).then((resp)=>{
      if (resp.code !== 0) {
        return ;
      }
      let index = this.data.albumList.indexOf(imageUrl);
      if (~index) {
        let albumList = this.data.albumList;
        albumList.splie(index,1);
        this.setData({albumList});
        this.renderAlbumList();
      }
      this.showToast('图片删除成功');
    }).catch(error=>{
      console.log('failed', error);
    }).then(_=>{
      this.hideLoading();
    });
  },
})
