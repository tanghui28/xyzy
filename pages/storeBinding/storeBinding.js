// pages/storeBinding/storeBinding.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: "",
    storeName:""
  },
  //点击input跳转至门店选择页面
  chooseStore() { 
    wx.navigateTo({
      url: '../chooseStore/chooseStore?from=storeBinding'
    });
  },
  goHome() { 

    if (this.data.storeId) { 

      app.ajax({
        url: "SelectMd",
        data: {
          mduid: this.data.storeId
        },
        // data: "&mduid=" + this.data.storeId,
        callback: res => { 

          if (res.success) {

            wx.switchTab({
              url:"/pages/home/home"
            })

          } else { 

            wx.showToast({
              title: res.info,
              icon:"none"
            })

          }

          
        }
      })



    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    if (options.id) {
      this.setData({
        storeId: options.id,
        storeName: options.name
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
  
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