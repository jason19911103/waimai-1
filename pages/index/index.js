// index.js
var that;

var weather = {
    "100": "wb_sunny",
    "101": "wb_cloudy",
    "102": "cloud_queue",
    "103": "cloud_queue",
    "104": "cloud_queue",
    "200": "flag",
    "201": "flag",
    "202": "flag",
    "203": "flag",
    "204": "flag",
    "205": "flag",
    "206": "flag",
    "207": "flag",
    "208": "format_align_center",
    "209": "format_align_center",
    "210": "format_align_center",
    "211": "format_align_center",
    "212": "format_align_center",
    "213": "format_align_center",
    "300": "grain",
    "301": "grain",
    "302": "grain",
    "303": "grain",
    "304": "grain",
    "305": "grain",
    "306": "grain",
    "307": "grain",
    "308": "grain",
    "309": "grain",
    "310": "grain",
    "311": "grain",
    "312": "grain",
    "313": "grain",
    "400": "ac_unit",
    "401": "ac_unit",
    "402": "ac_unit",
    "403": "ac_unit",
    "404": "ac_unit",
    "405": "ac_unit",
    "406": "ac_unit",
    "407": "ac_unit",
    "500": "brightness_6",
    "501": "format_align_justify",
    "502": "all_inclusive",
    "503": "ac_unit",
    "504": "ac_unit",
    "507": "fast_rewind",
    "508": "fast_rewind",
    "900": "whatshot",
    "901": "ac_unit",
    "999": "all_inclusive"
};

var star = ["star", "star_half", "star_border"];

var count = 0;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_show_search: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;

        getLocal();

    },

    show_search: function (e) {
        if (80 > e.detail.scrollTop) {
            this.setData({
                is_show_search: true
            })
        }
        else {
            this.setData({
                is_show_search: false
            })
        }
    },

    toSearchPage: function () {
        wx.navigateTo({
            url: '../search/search'
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

    },

    onPullDownRefresh: function () {
        //   getLocal();

        wx.stopPullDownRefresh()
    }

});

function getLocal() {
    wx.showLoading({
        title: '加载中'
    });

    wx.getLocation({
        type: "wgs84",
        success: function (res) {
            getCity(res.latitude, res.longitude);

            getBusinesss(++count, res.latitude, res.longitude);
        },
        fail: function () {
            getCityByIp();
        }
    });
}

function getCity(lat, lng) {
    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_location/',
        method: "POST",
        data: {
            "lat": lat,
            "lng": lng
        },
        success: function (res) {
            var _city = res["data"]["result"]["address_component"]["city"];

            that.setData({
                city: _city,
                district: res["data"]["result"]["address_component"]["district"],
                street: res["data"]["result"]["address_component"]["street"]
            });

            getWeather(_city);

        },
        fail: function () {
            console.log('fail');
        }
    });
}

function getCityByIp() {
    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_location_by_ip/',
        method: "GET",
        success: function (res) {
            var _city = res["data"]["data"]["city"];
            that.setData({
                city: _city,
                district: res["data"]["data"]["county"],
            });

            getWeather(_city);

        },
        fail: function () {
            console.log('fail');
        }
    });
}

function getWeather(city) {
    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_weather/',
        method: "POST",
        data: {
            "city": city
        },

        success: function (res) {
            var _now = res["data"]["HeWeather5"][0]["now"];

            that.setData({
                now_cond_code: getIcon(_now["cond"]["code"]),
                now_cond_txt: _now["cond"]["txt"],
                now_temp: _now["tmp"]
            });
        },

        fail: function () {
            console.log('fail');
        }
    })
}

function getIcon(code) {
    return weather[code];
}

function getBusinesss(_count, _lat, _lng) {
    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_businesss/',
        method: "POST",
        data: {
            "count": _count,
            "lat": _lat,
            "lng": _lng
        },

        success: function (res) {
            var _businesss = [];

            for (var i = 0; i < res["data"]["businesss"].length; i++) {
                var temp = {};
                var _business = res["data"]["businesss"][i];
                temp["id"] = _business["id"];

                temp["name"] = _business["name"];
                temp["image"] = _business["image"];
                temp["sale_count"] = _business["sale_count"];
                temp["score"] = String(_business["score"] / _business["sale_count"] * 5).substring(0, 3);

                var _temp = temp["score"];
                var _star = [];
                for (var j = 0; j < 5; j++) {
                    if (1 <= _temp) {
                        _star.push(star[0]);
                    }
                    else if (-1 <= _temp && 0 <= _temp) {
                        _star.push(star[1]);
                    }
                    else {
                        _star.push(star[2]);
                    }
                    _temp--;
                }

                temp["star"] = _star;
                temp["sale_start"] = _business["sale_start"];
                temp["delivery_fee"] = _business["delivery_fee"];

                temp["distance"] = String(_business["distance"]).substring(0, 5);
                temp["min"] = parseInt(temp["distance"]);

                _businesss.push(temp);
            }

            that.setData({
                businesss: _businesss
            });

            wx.hideLoading();
        },

        fail: function () {
            console.log('fail');
        }
    })
}
