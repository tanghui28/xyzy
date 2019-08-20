// pages/addRequireProduct/addRequireProduct.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    drugName: '',                  //通用名
    spec: '',                      //规格
    factory: '',                   //厂家
    count: '',                     //需求数量
    productName: '',               //商品名
    pw:'',                         //批准文号
    len: 0,
    remarks: '',
    files: [],                     //图片文件
    id: null,                       //用于编辑无货需求 , 编辑模式
    addUrl: 'AddDemandGoods',       //添加无货需求url
    editUrl: 'EditDemandGoods',      //编辑无货需求url
  },

  /**
   * 
   * drugNameInput
   */
  drugNameInput(e) {
    this.setData({
      drugName:e.detail.value.trim()
    })
  },

  /**
   * 
   * specInput
   */
  specInput(e) {
    this.setData({
      spec: e.detail.value.trim()
    })
  },
  

  /**
   * 
   * factoryInput
   */
  factoryInput(e) { 
    this.setData({
      factory: e.detail.value.trim()
    })
  },

  /**
   * 
   * countInput
   */

  countInput(e) {
    let value = e.detail.value.trim();
    if ( isNaN( Number(value) ) ) { 
      value = 1;
    }
    this.setData({
      count: value
    })
  },

  /**
   * 
   * productName
   */
  productNameInput(e) {

    this.setData({
      productName:e.detail.value.trim()
    })
  },

  /**
   * 
   * pw
   */
  pwInput(e) { 

    this.setData({
      pw: e.detail.value.trim()
    })

  },
  
  /**
   * 
   * 备注输入
   */
  remarkInput(e) {
    if (e.detail.value.length > 200 ) {
      return;
    }
    this.setData({
      len: e.detail.value.length,
      remarks: e.detail.value
    })
  },

  /**
   * 
   * 选择图片
   */
  chooseImg() { 
    if ( this.data.files.length >= 5 ) { 
      wx.showToast({
        title: '最多只能选择五张',
        icon:'none'
      })
      return;
    }

    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'],
      success: e => { 
        this.setData({
          files:[...this.data.files,...e.tempFiles]
        })


      }
    })

  },


  /**
   * 
   * 删除图片
   */
  deleteImg(e) { 

    let index = e.currentTarget.dataset.index;
 
    let arr = this.data.files.slice(0);

    arr.splice(index, 1);
    this.setData({
      files: arr
    })


  },

  /**
   * 
   * 提交
   */
  commit() { 
    if ( this.data.drugName == "" || this.data.spec == "" || this.data.factory == "" || this.data.count <= 0  ) { 
      wx.showToast({
        title: '请完善必填内容后提交 !',
        icon:'none'
      })
      return;
    }

    app.ajax({
      url: this.data.id !== null ? this.data.editUrl : this.data.addUrl,
      data: {
        DrugsBase_DrugName: this.data.drugName,
        DrugsBase_Specification: this.data.spec,
        DrugsBase_Manufacturer: this.data.factory,
        ProcurementNumber: this.data.count,
        DrugsBase_ProName: this.data.productName,
        DrugsBase_ApprovalNumber: this.data.pw,
        remarks: this.data.remarks,
        Id:this.data.id
      },
      callback: (res) => { 
        // console.log(res);
        if (!res.success) { 
          wx.showToast({
            title: res.info,
            icon:'none'
          })
          return;
        }

        if (this.data.id !== null) { 
          this.clearData();
          wx.showToast({
            title: '提交成功!',
            icon: 'success',
            complete: () => { 

              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500);
              
            }
          })
          

          

          return;
        }

        let id = res.data;

        // 图片上传
        let uploads = [];
        for (var i = 0; i < this.data.files.length; i++) { 
          uploads[i] = new Promise((resolve,reject) => { 

            wx.uploadFile({
              url: app.globalData.url + 'AddDemandGoodsFile',
              filePath: this.data.files[i]['path'],
              name: 'file',
              formData: {
                id
              },
              header: {
                'Cookie':app.globalData.header.Cookie
              },
              success: (res) => { 
                resolve();
              },
              fail: () => { 
                reject();
              }
            })


          })

        }
        Promise.all(uploads).then(res => { 
          this.clearData();
          wx.showToast({
            title: '提交成功!',
            icon: 'success',
            complete: () => {

              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500);
            }
          })
          
        }).catch(err => { 
          
          wx.showToast({
            title: '图片上传失败, 请重试',
            icon:'none'
          })

        })

      }
    })





  },

  /**
   * 
   * 提交成功 清空数据
   */
  clearData() { 

    this.setData({
      drugName: '', //通用名
      spec: '', //规格
      factory: '', //厂家
      count: '', //需求数量
      productName: '', //商品名
      pw: '', //批准文号
      len: 0,
      remarks: '',
      files: [], //图片文件
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    if (options.drugName) {

      this.setData({
        drugName: options.drugName,
        spec: options.spec || '',
        factory: options.factory || '',
        count: options.count || '',
        id:options.id || null
      })

    }
    if ( options.imgs  && options.imgs.indexOf(',') != -1) { 
      options.imgs = options.imgs.slice(0, -1);
      let temp = options.imgs.split(',');
      let arr = [];
      for (let item of temp) { 
        arr.push({
          path:app.globalData.imgUrl + item
        })
      }
      this.setData({
        files:arr
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