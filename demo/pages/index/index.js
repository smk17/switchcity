//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '广州',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindSwitChcity: function() {
    wx.navigateTo({
      url: 'switchcity/switchcity'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    console.log('index-onShow')
    this.setData( {
      motto:app.globalData.city
    })
  },
})
