// pages/switchStore/switchStore.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeName: '',
    storeId:''
  },

  /**
   * 跳转至 chooseStore
   */
  toChooseStore() { 
    
    wx.redirectTo({
      url:'/pages/chooseStore/chooseStore?from=switchStore'
    })

  },
  /**
   * 确定切换
   */
  goHome() { 
    if (this.data.storeId) {

      app.ajax({
        url: "SelectMd",
        data: {
          mduid: this.data.storeId
        },

        callback: res => {

          if (res.success) {

            wx.reLaunch({
              url: "/pages/home/home"
            })

          } else {

            wx.showToast({
              title: res.info,
              icon: "none"
            })

          }


        }
      })



    } else { 
      wx.switchTab({
        url:'/pages/home/home'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeName: options.name,
      storeId:options.id || ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})