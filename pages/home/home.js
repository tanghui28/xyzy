// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
  },

  /**
   * 
   * input tap事件
   */
  focusHandler(){
    wx.navigateTo({
      url: '../search/search'
    });
  },

  /**
   * 切换门店按钮  跳转至门店切换页面
   */
  toSwitchStore() { 
    // https://zy.sosoyy.com:449
    // http://192.168.1.49:8083

    wx.navigateTo({
      url:'/pages/switchStore/switchStore?name='+this.data.userInfo[1]
    })

  },
  watchBack(value) { 
    let arr = value.split(',')
    this.setData({
      userInfo:arr
    })
  },

  /**
   *  退出
   */
  logOut(){


     wx.showModal({
       title: '',
       content: '是否确认退出 ?',
       success: (res) => {
         if (res.confirm) {
           //确认退出
           app.ajaxNo({
             url: "LogOut",
             callback: res => {
               if (!res.success) {
                 wx.showToast({
                   title: res.info,
                   icon: "none"
                 })
               } else { 
                 wx.reLaunch({
                   url:'/pages/login/login'
                 })
               }
             }
           })



         } else if (res.cancel) {

         }
       }
     })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getApp().watch(this.watchBack)
    app.isLogin();


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