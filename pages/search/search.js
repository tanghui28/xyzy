// pages/search/search.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyWord:"",
    list:null,
    historyArr: [],
    searchSuggestions: [],
    pageIndex: 1,
    pageTotal: 0,
    getSuggestionTime: 0,
    getSearchTime: 0,
    isInput: true, 
  },
  //点击取消搜索,返回上一页
  cancel() { 
    wx.navigateBack({
      delta: 1
    });
  },
  // 缓存搜索词
  searchSave(word) {
    word = word.trim();
    if (word.length == 0) { 
      return;
    }
    wx.getStorage({
      key:'searchHistory',
      success: (res) => {
        let historyArr = JSON.parse(res.data);
        if (historyArr.length > 0) { //之前的搜索历史数组长度大于0
          
          let wordIndex = historyArr.indexOf(word);
          if (wordIndex == -1) { //搜索历史数组中无相同搜索词
            historyArr.unshift(word);
           
          } else {               //搜索历史数组中有相同搜索词                          
            historyArr.splice(wordIndex, 1);
            historyArr.unshift(word);
          }

          if (historyArr.length > 10) {
            historyArr = historyArr.slice(0, 10)
          }
          
        } else {                    //之前的搜索历史数组长度为0
          historyArr.unshift(word);
        }

        //存入修改之后的搜索历史数组
        wx.setStorage({
          key: 'searchHistory',
          data: JSON.stringify(historyArr),
          success: (result) => {
            // console.log('已成功存入修改之后的搜索历史')
          }
        });

        //更新当前historyArr
        this.setData({
          historyArr:historyArr
        })
        
      },
      fail:()=> {  //读取失败,之前未存入搜索历史 或已被清空
        let historyArr = [];
        historyArr.unshift(word);
        //存入修改之后的搜索历史数组
        wx.setStorage({
          key: 'searchHistory',
          data: JSON.stringify(historyArr),
          success: (res) => {
            // console.log('已成功存入修改之后的搜索历史');
          }
        });
        //更新
        this.setData({
          historyArr:historyArr
        })

      }
    });
  },
  //点击搜索历史
  tapHistory(e){

    this.setData({
      keyWord: e.currentTarget.dataset.name,
      pageIndex: 1,
      pageTotal: 0,
      list: [],
      isInput:false
    }, function () { 
        this.getList();
        this.searchSave(e.currentTarget.dataset.name);
    });
    
    
  },
  // 点击搜索建议词
  tapSuggest(e) { 
    // console.log(e.currentTarget.dataset);
    //缓存搜索关键词
    this.searchSave(e.currentTarget.dataset.dname);
    //清除搜索建议
    // this.setData({
    //   searchSuggestions: []
    // })

    this.setData({
      keyWord: e.currentTarget.dataset.dname + " " + e.currentTarget.dataset.pname,
      pageIndex: 1,
      pageTotal: 0,
      list: [],
      searchSuggestions: []
    })
    //请求数据
    this.getList();
    
   
    
  },
  //点击删除搜索历史,清除当前数据及缓存
  tapDelete() { 
    this.setData({
      historyArr: []
    });
    wx.removeStorage({
      key: 'searchHistory'
    });
  },
  /**
   * 
   * input组件搜索事件
   */
  searchMedicine(e) { 
    // console.log(e.detail.value);

    if (e.detail.value.trim() == "") { 
      return;
    }

    //缓存搜索词
    this.searchSave(e.detail.value);

    //将搜索建议置空

    this.setData({
      keyWord: e.detail.value.trim(),
      searchSuggestions: [],
      pageIndex: 1,
      pageTotal: 0,
      list:null
    })

    this.getList();

  },
  /**
   * input组件输入事件
   */
  getSuggestion(e) { 
    // input组件bug  更改绑定value触发input事件
    if (!this.data.isInput) {

      this.setData({
        isInput: true
      })
      return;

    }
    

    this.setData({
      getSuggestionTime: (new Date()).getTime()
    })

    let keyWord = e.detail.value.trim();
    this.setData({
      keyWord: keyWord
    })
    if (keyWord == "") {                   //input值为空时 , 直接将搜索建议数组置为空

      this.setData({
        searchSuggestions: [],
        list:null
      })

    } else {                               //input值不为空时, 从后端获取数据

      //获取搜索建议
      app.ajaxNo({
        url: 'SearchData',
        data: {
          wordKey: this.data.keyWord
        },
        // data: "&wordKey=" + this.data.keyWord,
        callback: res => { 

          if (res.success) {
            
            if (this.data.getSuggestionTime < this.data.getSearchTime) {    //获取搜索建议之后立刻获取了搜索结果 , 取消赋值
              return;
            }

            this.setData({
              searchSuggestions: res.data
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
  
  
  //请求搜索数据
  getList() { 
    //销毁搜索建议
    // this.searchSuggestions = [];

    this.setData({
      searchSuggestions: [],
      getSearchTime: (new Date()).getTime()
    })

    app.ajax({
      url: "Search",
      data: {
        keyWord: this.data.keyWord,
        page:this.data.pageIndex
      },
      // data: "&keyWord=" + this.data.keyWord + "&page=" + this.data.pageIndex,
      callback: res => { 
        // console.log(res);
        if (res.success) {

          if (res.data.list.length > 0) {

            res.data.list.forEach((val,i) => {
              if (!val.ImagePath) { 
                val.ImagePath = "/images/noPic.jpg";
              }
            })

            this.setData({
              list: res.data.list,
              pageIndex: res.data.page,
              pageTotal: Math.ceil(res.data.recordCount / 10)
            })
          } else { 

             this.setData({
               list: [],
             })

            wx.showToast({
              title: "未搜索到相关产品,请调整关键词后重试!",
              icon:"none"
            })

          }


        } else { 

          wx.showToast({
            title: res.info,
            icon:"none"
          })

        }
      }
    })


  },

  //点击产品跳转至产品详情页面
  toProductDetail(e) { 
    // console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index;
    let drugName = this.data.list[index]['DrugsBase_DrugName'],
      drugSpec = this.data.list[index]['DrugsBase_Specification'],
      drugManufacturer = this.data.list[index]['DrugsBase_Manufacturer'],
      priceS = this.data.list[index]['PriceS'],
      priceE = this.data.list[index]['PriceE'],
      imagePath = this.data.list[index]['ImagePath'],
      goodsId = this.data.list[index]['Goods_ID'];
    // /DrugsBase_ApprovalNumber  DrugsBase_ProName
    let DrugsBase_ProName = this.data.list[index]['DrugsBase_ProName'] || '',
       DrugsBase_ApprovalNumber = this.data.list[index]['DrugsBase_ApprovalNumber'] || '';
    
    wx.navigateTo({
      url: "/pages/productDetail/productDetail?drugName=" + drugName + "&drugSpec=" + drugSpec + "&drugManufacturer=" + drugManufacturer + "&priceS=" + priceS + "&priceE=" + priceE + "&imagePath=" + imagePath + "&goodsId=" + goodsId + '&DrugsBase_ProName=' + DrugsBase_ProName + '&DrugsBase_ApprovalNumber=' + DrugsBase_ApprovalNumber
    })



  },

  /**
   * 
   * 点击手动添加商品
   */
  toAddRequireProduct() { 
    wx.navigateTo({
      url: '/pages/addRequireProduct/addRequireProduct'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取本地缓存搜索历史数组
    wx.getStorage({
      key: 'searchHistory',
      success: res => {
        // console.log(JSON.parse(res.data));
        this.setData({
          historyArr: JSON.parse(res.data)
        })
      },
      fail() {
        //读取失败,未缓存搜索历史
        // console.log('无缓存搜索历史');
      },
      complete() {

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
    // console.log("上拉触底事件");
    let nowIndex = this.data.pageIndex;
    if (this.data.pageIndex < this.data.pageTotal) { 

      this.setData({
         getSearchTime: (new Date()).getTime()
      })

      app.ajaxNo({
        url: "Search",
        data: {
          keyWord: this.data.keyWord,
          page:++nowIndex
        },
        // data: "&keyWord=" + this.data.keyWord + "&page=" + (++nowIndex),
        callback: res => { 
          if (res.success) {

            let tempList = this.data.list;
            res.data.list.forEach((ele, index) => { 
              if (!ele.ImagePath) { 
                ele.ImagePath = "/images/noPic.jpg";
              }
              tempList.push(ele);
            })

            this.setData({
              list: tempList,
              pageIndex: res.data.page,
              pageTotal:Math.ceil(res.data.recordCount / 10)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})