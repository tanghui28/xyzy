// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnStr: "获取验证码",
    second: 60,
    timer: null,
    phoneNumber:"",
    phoneNumberPass: false,
    verifacationCode: "",
    verifacationCodePass:false
  },
  // 获取验证码
  getVerifacationCode() {
    //正在倒计时则退出
    if (this.data.timer != null) return;
    if (!this.data.phoneNumberPass) { 
      wx.showToast({
        title: "手机号格式错误",
        icon:"none"
      })
      return;
    }

  
    let second = this.data.second;
    this.setData({
      btnStr:second + " S"
    })
    let tempTimer = setInterval(() => {
      this.setData({
        btnStr:--second == 0?"获取验证码":second + " S"
      })
      if (second == 0) {
        clearInterval(tempTimer);
        this.setData({
          timer:null
        })
      }
      
    }, 1000);
    this.setData({
      timer:tempTimer
    })

    app.ajaxNo({
      url: 'generate_code',
      // data: "&mobile=" + this.data.phoneNumber,
      data: {
        mobile: this.data.phoneNumber
      },
      callback:function(res) {
        // console.log(res.success);
        if (!res.success) {
          wx.showToast({
            title: res.info,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: "验证码已发送,请注意查收!",
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
    
  },
  // 手机号输入框正则验证
  testPhoneNumber(e) { 
    // console.log(e);
    let reg = /^1\d{10}$/;
    let val = e.detail.value.trim();
    if (reg.test(val)) {
      // console.log("测试通过");
      this.setData({
        phoneNumberPass:true
      })
    } else {
      this.setData({
        phoneNumberPass: false
      })
    }

    this.setData({
      phoneNumber: val
    })


  },
  // 验证码输入框正则验证
  testVerifacationCode(e) { 

    let reg = /^\d{6}$/;
    let val = e.detail.value;
    if (reg.test(val)) {
      this.setData({
        verifacationCodePass: true
      })
    } else { 
      this.setData({
        verifacationCodePass: false
      })
    }
    this.setData({
      verifacationCode: val
    })

  },
  // 手机号,验证码登录
  login() { 

    app.ajaxNo({
      url: 'LoginForVerificationCode',
      data: {
        mobile: this.data.phoneNumber,
        VerificationCode:this.data.verifacationCode
      },
      // data: "&mobile=" + this.data.phoneNumber + "&VerificationCode=" + this.data.verifacationCode,
      callback: res => { 
        if (res.success) {
          //登录成功 , 如果data大于0则跳转绑定店铺 , 非0则跳转至首页
          if (res.data != 0) {
            wx.switchTab({
              url:"../home/home"
            })
          } else { 
            wx.redirectTo({
              url:"../storeBinding/storeBinding"
            })
          }

        } else { 
          //登录失败
          wx.showToast({
            title: res.info,
            icon:'none'
          })
        }
      }
    })
  },
  // 微信一键登录
  getPhoneNumber(e) {
    // console.log(e.detail.encryptedData);
    if (!e.detail.encryptedData) { 
      wx.showToast({
        title: "未能获得手机号",
        icon:'none'
      })
      return;
    }
    app.ajax({
      url: "LoginForMobile",
      data: e.detail,
      callback: (res) => { 

        if (res.success) {
          //登录成功, data值等于0跳转到绑定店铺页面 , 非0则跳转至首页
          if (res.data != 0) {
            wx.switchTab({
              url:'../home/home'
            })
          } else { 
            wx.redirectTo({
              url: '../storeBinding/storeBinding'
            });
          }


        } else { 
          wx.showToast({
            title: res.info,
            icon:'none'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    if (options.error == "1") { 
      wx.showModal({
        title: "获取token失败,程序无法使用",
        content: options.info,
      })
    }

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