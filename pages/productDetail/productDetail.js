// pages/productDetail/productDetail.js
let util = require("../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productDetail: {},
    buyCount: 1,
    date: "",
    remark: ""
  },
  //购买数量++
  addBuyCount() {
    this.setData({
      buyCount: ++this.data.buyCount
    })
  },
  // 购买数量--
  reduceBuyCount() { 
    var temp = --this.data.buyCount;
    this.setData({
      buyCount: temp > 1 ? temp :1
    })
  },
  //input组件购买数量变化
  buyCountChange(e) { 

    this.setData({
      buyCount: e.detail.value
    })
  },
  //input组件blur事件
  buyCountBlur(e) { 
    // console.log(e.detail.value);
    let val = parseInt(e.detail.value);
    if ( val<1 || isNaN(val)) { 
      val = 1;
      wx.showToast({
        title: "请选择大于0的整数",
        icon:"none"
      })
    }
    this.setData({
      buyCount :val
    })


  },
  //picker时间选择
  bindDateChange(e) { 
    // console.log(e.detail.value);
    this.setData({
      date: e.detail.value
    })
  },
  //textarea 备注改变
  remarkChange(e) { 
    // console.log(e.detail.value);
    this.setData({
      remark: e.detail.value.trim()
    })

  },
  //提交订单
  submitProduct() { 

    app.ajax({
      url: "AddValetLookingMedicine",
      data: {
          Goods_ID: this.data.productDetail.goodsId,
          cgsl: this.data.buyCount,
          expectDate: this.data.date,
          remarks: this.data.remark,
          PriceS: this.data.productDetail.priceS,
          PriceE: this.data.productDetail.priceE
      },
      // data: "&Goods_ID=" + this.data.productDetail.goodsId + "&cgsl=" + this.data.buyCount + "&expectDate=" + this.data.date + "&remarks=" + this.data.remark + "&PriceS=" + this.data.productDetail.priceS + "&PriceE=" + this.data.productDetail.priceE,
      callback: res => {
        
        if (!res.success) {
          wx.showToast({
            title: res.info,
            icon: 'none'
          })

        } else { 

          wx.redirectTo({
            url: "/pages/submitSuccess/submitSuccess"
          })

        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // console.log(options);
    var d = new Date();
    d.setDate(d.getDate() + 7);
    let date = util.formatDate(d);
    this.setData({
      date: date,
      productDetail:options
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