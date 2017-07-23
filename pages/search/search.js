// search.js
var search_text = "";
var search_fiter = 0;
var price_fiter = 0;
var distance_fiter = 0;
var score_fiter = 0;
var that;
var lat;
var lng;

var star = ["star", "star_half", "star_border"];

Page({

    /**
     * 页面的初始数据
     */
    data: {
        "search_fiter": "店铺",
        "distance_fiter_name": "远近",
        "distance_fiter": "arrow_drop_down",
        "score_fiter": "arrow_drop_down"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;

        wx.getLocation({
            type: "wgs84",
            success: function (res) {
                lat = res.latitude;
                lng = res.longitude;
            },
            fail: function () {
                getCityByIp();
            }
        });
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

    },

    searchChange: function (e) {
        if (search_text !== e["detail"]["value"]) {
            search_text = e["detail"]["value"];
        }
    },

    _search: function () {
        search(search_text);
    },

    searchFiter: function () {
        wx.showActionSheet({
            itemList: ['店铺'],
            success: function(res) {
                if (!res["cancel"]) {
                    search_fiter = parseInt(res["tapIndex"]);
                    if (0 === search_fiter) {
                        that.setData({
                            "search_fiter": "店铺",
                            "distance_fiter_name": "远近"
                        })
                    } else {
                        that.setData({
                            "search_fiter": "菜名",
                            "distance_fiter_name": "价格"
                        })
                    }
                }
            }
        })
    },

    distanceFiter: function () {
        wx.showActionSheet({
            itemList: ["降序", "升序"],
            success: function(res) {
                if (!res["cancel"]) {
                    distance_fiter = parseInt(res["tapIndex"]);
                    if (0 === distance_fiter) {
                        that.setData({
                            "distance_fiter": "arrow_drop_down"
                        })
                    } else {
                        that.setData({
                            "distance_fiter": "arrow_drop_up"
                        })
                    }
                }
            }
        })
    },

    scoreFiter: function () {
        wx.showActionSheet({
            itemList: ["降序", "升序"],
            success: function(res) {
                if (!res["cancel"]) {
                    score_fiter = parseInt(res["tapIndex"]);
                    if (0 === score_fiter) {
                        that.setData({
                            "score_fiter": "arrow_drop_down"
                        })
                    } else {
                        that.setData({
                            "score_fiter": "arrow_drop_up"
                        })
                    }
                }
            }
        })
    },

    onPullDownRefresh: function () {
        search(search_text);

        wx.stopPullDownRefresh()
    }
});

function search(_key) {
    if (_key !== "") {
        wx.showLoading({
            title: '加载中',
        })

        wx.request({
            url: 'https://demo.ztcaoll222.cn/waimai_search/',
            method: "POST",
            data: {
                "count": 1,
                "search_fiter": search_fiter,
                "key": _key,
                "lat": lat,
                "lng": lng,
                "distance_fiter": distance_fiter,
                "score_fiter": score_fiter
            },

            success: function (res) {
                var temp = res["data"]["search_res"]["businesss"];
                for (var i = 0; i < temp.length; i++) {
                    var _temp = temp[i];
                    var score = _temp["_score"];

                    var _star = [];
                    for (var j = 0; j < 5; j++) {
                        if (1 <= score) {
                            _star.push(star[0]);
                        }
                        else if (-1 <= score && 0 <= score) {
                            _star.push(star[1]);
                        }
                        else {
                            _star.push(star[2]);
                        }
                        score--;
                    }

                    temp[i]["distance"] = String(temp[i]["distance"]).substring(0, 5);
                    temp[i]["min"] = parseInt(temp[i]["distance"]);
                    temp[i]["star"] = _star;
                }

                that.setData({
                    "results": temp
                });

                distance_fiter = -1;
                score_fiter = -1;

                wx.hideLoading();
            },

            fail: function () {
                console.log('fail');
            }
        })
    }
}