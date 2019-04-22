// pages/chooseStore/chooseStore.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:'',
    storeList: []
  },
  //获取选择门店ID
  getStoreId(e) {
    // console.log(e);
    wx.redirectTo({
      url: '../'+this.data.from+'/'+this.data.from+'?id=' + e.currentTarget.dataset.storeid + "&name=" +
      e.currentTarget.dataset.storename
    });
    


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      from:options.from
    })

    app.ajax({
      url: 'GetShopList',
      callback: res => { 
        // console.log(res);
        if (res.success) {

          this.setData({
            storeList:res.data
          })

        } else { 
          wx.showToast({
            title: res.info,
            icon:"none"
          })
        }


      }
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