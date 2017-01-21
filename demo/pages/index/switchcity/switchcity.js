var city = require('../../../utils/city.js');
//欢迎关注:http://www.wxapp-union.com/portal.php
//CSDN微信小程序开发专栏:http://blog.csdn.net/column/details/13721.html
var app = getApp()
Page({
  data: {
    location:{
      class:"location_text",
      name:"正在定位中...",
      isget:false
    },
    hotCityList:["北京","上海","广州","深圳","苏州","长沙","杭州","成都"],
    searchLetter: [],
    searchBarList:[],
    showLetter: "",
    rpxTopx: 0,
    tHeight: 0,
    bHeight: 0,
    startPageY: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,
    scrollIntoView:'A',
    isSearchFocus:false,
    isSearchInput:false,
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    let that = this;
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    // console.log(cityInfo);

    var sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    var rpxTopx = (sysInfo.windowWidth/750);
    var tabHeight = 96 * rpxTopx;
    var scrollHeight = sysInfo.windowHeight - tabHeight;

    //添加要匹配的字母范围值
    //1、更加屏幕高度设置子元素的高度
    var itemH = scrollHeight / (searchLetter.length+1);
    var tempObj = [];
    tempObj.push({
      name:"~",
      tHeight:itemH + tabHeight,
      bHeight:2 * itemH + tabHeight
    });
    for (var i = 1; i < searchLetter.length+1; i++) {
      var temp = {};
      temp.name = searchLetter[i-1];
      temp.tHeight = i * itemH + tabHeight;
      temp.bHeight = (i + 1) * itemH + tabHeight;

      tempObj.push(temp)
    }

    this.setData({
      scrollHeight: scrollHeight,
      rpxTopx: rpxTopx,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })

    console.log(this.data.cityInfo);
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res);
        wx.request({  
　　　　　　　url: 'https://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=1',       
            data: {},  
　　　　　　  header: { 'Content-Type': 'application/xml'},  
            dataType:'json',  
            success: function(ops) {  
              console.log(ops.data);
              var city = ops.data.result.addressComponent.city;
              if (city.search('市')) {
                city = city.slice(0,-1);
              }else if (city.search('特别行政区')) {
                city = city.slice(0,-5);
              }else if (city.search('自治')) {
                city = city.slice(0,-3);
              }else if (city.search('地区')) {
                city = city.slice(0,-2);
              };
              that.setData({
                location:{
                  class:"",
                  name:city,
                  isget:true
                },
              })
　　　　　　　}
　　　    })
      }
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  bindinput(e) {
    console.log(e);
    var value = e.detail.value;
    if (value == "") {
      this.setData({
        searchBarList : [],
        isSearchInput: false
      })
    }else {
      let searchBarList = city.searchCity(value);
      this.setData({
        searchBarList : searchBarList,
        isSearchInput: true
      })
    };
    
  },
  bindfocus() {
    this.setData({
      isSearchFocus: true
    })
  },
  bindblur() {
    this.setData({
      isSearchFocus: false,
      isSearchInput: false
    })
  },
  searchStart: function (e) {
    var showLetter = e.currentTarget.dataset.letter;
    var scrollIntoView = showLetter;
    var pageY = e.touches[0].pageY;
    if (showLetter == "~") {
      scrollIntoView = "top";
    };
    this.nowLetter(pageY, this);
    this.setData({
      showLetter: showLetter,
      startPageY: pageY,
      isShowLetter: true,
      scrollIntoView:scrollIntoView,
    })
  },
  searchMove: function (e) {
    var pageY = e.touches[0].pageY;
    var startPageY = this.data.startPageY;
    var tHeight = this.data.tHeight;
    var bHeight = this.data.bHeight;
    var showLetter = 0;
    if (startPageY - pageY > 0) { //向上移动
      if (pageY < tHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    } else {//向下移动
      if (pageY > bHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    }
  },
  searchEnd: function (e) {
    // console.log(e);
    // var showLetter=e.currentTarget.dataset.letter;
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 500)

  },
  nowLetter: function (pageY, that) {//当前选中的信息
    var letterData = this.data.searchLetter;
    var bHeight = 0;
    var tHeight = 0;
    var showLetter = "";
    for (var i = 0; i < letterData.length; i++) {
      if (letterData[i].tHeight <= pageY && pageY <= letterData[i].bHeight) {
        bHeight = letterData[i].bHeight;
        tHeight = letterData[i].tHeight;
        showLetter = letterData[i].name;
        break;
      }
    }
    var scrollIntoView = showLetter;
    if (showLetter == "~") {
      scrollIntoView = "top";
    };
    that.setData({
      bHeight: bHeight,
      tHeight: tHeight,
      showLetter: showLetter,
      startPageY: pageY,
      scrollIntoView:scrollIntoView,
    })
  },
  bindScroll: function (e) {
    //console.log(e.detail)
  },
  bindCity: function (e) {
    var city = e.currentTarget.dataset.city;
    app.globalData.city = city;
    console.log(app.globalData.city);
    wx.navigateBack({
      delta: 1
    })
  },
  bindLocationCity(){
    console.log(this.data.location);
    if (this.data.location.isget) {
      app.globalData.city = this.data.location.name;
      wx.navigateBack({
        delta: 1
      })
    };
  }
})