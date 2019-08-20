// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageTotal:0,
    keyWord:'',
    filterItem: [
      {
        filterName: "全部",
        selected: true,
        refresh:false
      },
      {
        filterName: "待审核",
        selected: false,
        refresh: false
      },
      {
        filterName: "已采购",
        selected: false,
        refresh: false
      },
      {
        filterName: "已出库",
        selected: false,
        refresh: false
      },
      {
        filterName: "已取消",
        selected: false,
        refresh: false
      }
    ],
    orderList: [],
    showAll: false,
    _hasGoods:1,                       //  1有货需求   0无货需求
    // hasGoods:1,                       //  1有货需求   0无货需求
  },

  /**
   * 
   * 有货需求 / 无货需求  切换
   */
  switchTab(e) { 
    if (e.currentTarget.dataset.status == 0) {

      this.setData({
        hasGoods:0
      })

    } else { 

      this.setData({
        hasGoods: 1
      })

    }


  },

  // 筛选
  tapFilter(e) { 
    let temp = this.data.filterItem.slice(0);
    temp.forEach((val,index,arr) => {
     val.selected = index == e.target.dataset.index ? true : false;
    });
    this.setData({
      filterItem: temp,
      pageIndex:1
    })

    this.getList(this.data.pageIndex);



  },
  // 删除
  deleteOrder(e) { 

    wx.showModal({
      title: '',
      content: '要删除这条需求吗?',
      success:(res) =>{ 
        if (res.confirm) {
          //确认删除
          let temp = this.data.orderList;
          temp.splice(e.target.dataset.index, 1);
          this.setData({
            orderList: temp
          })

          app.ajax({
            url: "CancelValetLookingMedicine",
            data: {
              id: e.target.dataset.id
            },
            // data: "&id=" + e.target.dataset.id,
            callback: res => { 
              if (!res.success) { 
                wx.showToast({
                  title: res.info,
                  icon:"none"
                })
              }
            }
          })



        } else if (res.cancel) { 

        }
      }
    })

    

  },
  //input  change更新
  bindInputChange(e) { 
    this.setData({
      keyWord:e.detail.value
    })
  },
  //input 键盘事件 / 搜索按钮
  searchMedicine() { 

    this.setData({
      pageIndex:1
    })
    if ( this.data.hasGoods == 1 ) { 
      this.getList(this.data.pageIndex);
    } else {
      this.getNoProductList(this.data.pageIndex);
    }
    
  },
  // 获取有货需求数据函数
  getList(pageIndex = 1) { 
    let tempFilter = this.data.filterItem;
    let filterState = "";
    tempFilter.forEach((val,index,arr) => { 
      if (val.selected) { 
        filterState = val.filterName
      }
    })
    
    app.ajax({
      url: "GetList",
      data: {
        keyWord: this.data.keyWord,
        states: filterState,
        page: pageIndex
      },

      callback: res => { 

        if (res.success) {
          res.data.list.forEach((val,i) => { 
            if (!val.ImagePath) { 
              val.ImagePath = "/images/noPic.jpg";
            }
          })
          this.setData({
            orderList: res.data.list,
            pageIndex: res.data.page,
            pageTotal: Math.ceil(res.data.recordCount / 10 )
          })
          wx.stopPullDownRefresh();
          if (res.data.list.length == 0 ) {
            wx.showToast({
              title: "暂无需求",
              icon:"none"
            })
          }

        } else { 
          wx.stopPullDownRefresh();
          wx.showToast({
            title: res.info,
            icon:"none"
          })
          
        }


        
        

      }
      
    })
    

  },
  // 获取无货需求数据
  getNoProductList(pageIndex  = 1) { 

    app.ajax({
      url: "GetDemandGoodsList",
      data: {
        keyWord: this.data.keyWord,
        page: pageIndex
      },

      callback: res => {

        if (res.success) {

          this.setData({
            orderList: res.data.list,
            pageIndex: res.data.page,
            pageTotal: Math.ceil(res.data.recordCount / 10)
          })
          wx.stopPullDownRefresh();
          if (res.data.list.length == 0) {
            wx.showToast({
              title: "暂无需求",
              icon: "none"
            })
          }

        } else {
          wx.stopPullDownRefresh();
          wx.showToast({
            title: res.info,
            icon: "none"
          })

        }

      }

    })


  },
  // 错误图片
  errorPic(e) { 
    
    let index = e.currentTarget.dataset.index;
    let temp = this.data.orderList[e.currentTarget.dataset.index];
    temp.ImagePath = "/images/noPic.jpg";

    let src = "orderList[" + index + "]";
    this.setData({
      src:temp
    })
    

  },

  /**
   * 
   * 删除无货需求
   */
  deleteNoGoods(e) { 

    let index = e.currentTarget.dataset.index;
    let id = this.data.orderList[index]['Id'];

    wx.showModal({
      content: '要删除这条需求吗?',
      success: res => { 

        if (res.confirm) {
          let temp = this.data.orderList.slice(0);
          temp.splice(index, 1);
          this.setData({
            orderList: temp
          })
          app.ajaxNo({
            url: 'DeleteDemandGoods',
            data: {
              id
            },
            callback: res => {
              if (res.success) {
                wx.showToast({
                  title: "删除成功",
                  icon: "success"
                })
              } else {
                wx.showToast({
                  title: res.info,
                  icon: "none"
                })
              }
            }
          })

        }

      }
    })

    


  },

  /**
   * 
   * 编辑无货需求
   */
  NoGoodsEdit(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.orderList[index]['Id'];
    let drugName = this.data.orderList[index]['DrugsBase_DrugName'];
    let spec = this.data.orderList[index]['DrugsBase_Specification'];
    let factory = this.data.orderList[index]['DrugsBase_Manufacturer'];
    let count = this.data.orderList[index]['ProcurementNumber'];
    let imgs = this.data.orderList[index]['ImageListImageList'];
    wx.navigateTo({

      url: `/pages/addRequireProduct/addRequireProduct?drugName=${drugName}&spec=${spec}&factory=${factory}&count=${count}&id=${id}&imgs=${imgs}`

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getList(1);
    let obj = this.data;
    let that = this;
    Object.defineProperty(obj, 'hasGoods', {
      configurable: true,
      enumerable: true,
      get: function () {
        return this._hasGoods;

      },
      set: function (val) {
        if (val == this._hasGoods) {
          return;
        }
        that.setData({
          _hasGoods: val
        })
        if (val == 1) {
          that.getList(1);
        } else { 
          that.getNoProductList(1);
        }
        
      }
    })
    
    this.setData({
      hasGoods:1
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
  onShow: function (e) {

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
  onPullDownRefresh: function (e) {
    // 下拉刷新
    this.setData({
      pageIndex: 1
    });
    if (this.data.hasGoods == 1) {
      this.getList();
    } else { 
      this.getNoProductList();
    }
    
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    // 上拉加载更多
    if (this.data.pageIndex < this.data.pageTotal) { 

      let tempFilter = this.data.filterItem;
      let filterState = "";
      tempFilter.forEach((val, index, arr) => {
        if (val.selected) {
          filterState = val.filterName
        }
      })

      if (this.data.hasGoods == 1) {
        app.ajaxNo({
          url: "GetList",
          data: {
            keyWord: this.data.keyWord,
            states: filterState,
            page: this.data.pageIndex + 1
          },
          // data: "&keyWord=" + this.data.keyWord + "&states=" + filterState + "&page=" + (this.data.pageIndex + 1),
          callback: res => {
            if (res.success) {

              let tempList = this.data.orderList;
              res.data.list.forEach((val, ind) => {
                if (!val.ImagePath) {
                  val.ImagePath = "/images/noPic.jpg";
                }
                tempList.push(val);
              })

              this.setData({
                orderList: tempList,
                pageIndex: res.data.page,
                pageTotal: Math.ceil(res.data.recordCount / 10)
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

        app.ajaxNo({
          url: "GetDemandGoodsList",
          data: {
            keyWord: this.data.keyWord,
            page: this.data.pageIndex + 1
          },
          callback: res => {
            if (res.success) {

              let tempList = this.data.orderList;
              res.data.list.forEach((val, ind) => {

                tempList.push(val);
              })

              this.setData({
                orderList: tempList,
                pageIndex: res.data.page,
                pageTotal: Math.ceil(res.data.recordCount / 10)
              })


            } else {

              wx.showToast({
                title: res.info,
                icon: "none"
              })

            }

          }
        })



      }

      

    }
    

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})