//app.js
App({
  onLaunch: function () {


    wx.getStorage({
      key: "xySession",
      success:(res)=> { 
        // console.log(res.data);
        // this.globalData.wx_token =  res.data;
        this.globalData.header.Cookie = 'wx_token=' + res.data;

      },
      fail:()=> { 
        // console.log('异步读取失败');
        // wx.login({
        //   success: res => {
        //     if (res.code) {
        //       wx.request({
        //         url: "https://zy.sosoyy.com:449/WXApi/wxlogin",
        //         data: {
        //           code: res.code
        //         },
        //         method: 'post',
        //         dataType: 'json',
        //         success: res => {
        //           //设置全局wx_token
        //           this.globalData.header.Cookie = "wx_token=" + res.data.data;
        //           //  缓存全局wx_token
        //           // wx.setStorage({
        //           //   key: 'xySession',
        //           //   data: res.data.data
        //           // });

        //           //同步缓存
        //           try {
        //             wx.setStorageSync('xySession', res.data.data);
        //           } catch (e) { 

        //           }
                  


        //         }
        //       })
        //     } else {
        //       //登录失败

        //     }

        //   }
        // })


      }
    })

    // https://zy.sosoyy.com:449
    // https://zy.sosoyy.com:449
    

  },
  isLogin() { 
    // var wx_token = wx.getStorageSync("xySession");
    // console.log(wx_token);
    if (this.globalData.Cookie) {
      //console.log("发现本地缓存session");
      this.checkSession();
    } else {
      //console.log("全局无session,开始读取缓存session");
      wx.getStorage({
        key: "xySession",
        success: (res) => {
          // console.log(res.data);
          // this.globalData.wx_token = res.data;
          this.globalData.header.Cookie = 'wx_token='+ res.data;
          this.checkSession();
        },
        fail: () => {
          // console.log('异步读取失败,无缓存 ,重新请求session并跳转至登录页面');
          wx.login({
            success: res => {
              if (res.code) {
                // console.log(res.code);
                wx.request({
                  url: "https://zy.sosoyy.com:449/WXApi/wxlogin",
                  data: {
                    code: res.code
                  },
                  method: 'post',
                  dataType: 'json',
                  success: res => {
                    // console.log(res);
                    if (res.data.success) {

                      //设置全局wx_token
                      // this.globalData.wx_token = res.data.data;
                      this.globalData.header.Cookie = 'wx_token='+ res.data.data;
                      //缓存全局wx_token

                      wx.setStorage({
                        key: 'xySession',
                        data: res.data.data,
                        complete: () => {
                          //跳转
                          wx.redirectTo({
                            url: "/pages/login/login"
                          })
                        }
                      });

                      // //同步缓存
                      // wx.setStorageSync('xySession', res.data.data);

                    } else { 

                      wx.reLaunch({
                        url:"/pages/login/login?error=1&info="+res.data.info
                      })

                      
                   

                    }

                    
                    
                   

                  }
                })
              } else {
                //登录失败

              }

            }
          })


        }
      })

    }
  },
  checkSession() { 
    this.ajaxNo({
      url: "isLogin",
      callback: res => {
        if (res.success) {

          if (!res.data) {
            // 后端确认此登录session已过期 或 未登录 重新请求wxlogin 获取session
            // console.log("有缓存,但是已过期,重新请求session");

            wx.login({
              success: res => {
                if (res.code) {
                  wx.request({
                    url: "https://zy.sosoyy.com:449/WXApi/wxlogin",
                    data: {
                      code: res.code
                    },
                    method: 'post',
                    dataType: 'json',
                    success: res => {
                      //设置全局wx_token
                      this.globalData.header.Cookie = 'wx_token='+ res.data.data;
                      //  缓存全局wx_token
                      wx.setStorage({
                        key: 'xySession',
                        data: res.data.data,
                        complete: () => { 
                          wx.redirectTo({
                            url: "/pages/login/login"
                          })
                        }
                      });

                      //同步缓存
                      // wx.setStorageSync('xySession', res.data.data);

                      //跳转至登录页面
                      // console.log("请求后端session完毕,跳转至登录页面");
                     

                    }
                  })
                } else {
                  //登录失败

                }

              }
            })



          } else {
            // console.log("有缓存且未过期");
            // 成功登陆 , 保存门店简称
            this.globalData.userInfo = res.info;
          }


        } else {
          wx.showToast({
            title: res.info,
            icon: "none"
          })
        }

      }
    })
  },

  //请求数据函数 加载中效果
  ajax({ url, data="", callback }) { 
    wx.showLoading({
      title: '努力加载中...',
      mask: true
    });
    wx.request({
      url: 'https://zy.sosoyy.com:449/WXApi/' + url,
      header:this.globalData.header,
      data:data,
      method: 'post',
      dataType: 'json',
      success: res => { 
        wx.hideLoading();
        callback(res.data)
      },
      fail() { 
        wx.hideLoading();
        wx.showToast({
          title: "网络故障,请重试!",
          icon:"none"
        })

      },
      complete:()=> { 
        // wx.hideLoading();
      }
    })

  },
  //请求数据无加载中效果
  ajaxNo({ url,data="",callback}) {
    wx.request({
      url: 'https://zy.sosoyy.com:449/WXApi/' + url,
      header:this.globalData.header,
      data:data,
      method: 'post',
      dataType: 'json',
      success: res => {
        callback(res.data)
      },
      fail() {
        wx.showToast({
          title: "网络故障,请重试!",
          icon: "none"
        })

      },
      complete: () => {

      }
    })
  },
  //监听userInfo
  watch:function(fun) { 
    var obj = this.globalData;
    Object.defineProperty(obj, 'userInfo', {
      configurable: true,
      enumerable: true,
      set: function (value) { 
        this._userInfo = value;
        fun(value)
      },
      get:function() { 
        return this._userInfo;
      }
    })
  },
  globalData: {
    _userInfo: '',
    wx_token:"",
    header: { "Cookie": '' },      //请求携带此header , 存放后端返回的sessionId
  }
})