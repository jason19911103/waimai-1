// finish_order.js
var _id = 0;
var _user_id = 0;
var that;

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        _user_id = 1;
        _id = options.id;
        that = this;

        wx.showLoading({
            title: '加载中'
        });

        wx.getLocation({
            type: "wgs84",
            success: function (res) {
                getCity(res.latitude, res.longitude);
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

    funishOrder: function() {
        wx.showToast({
            title: '请稍后',
            icon: 'loading'
        })

        wx.request({
            url: 'https://demo.ztcaoll222.cn/finish_order/',
            method: "POST",
            data: {
                "user_id": _user_id
            },
            success: function (res) {
                if (res["data"]["result"] == true) {
                    wx.hideLoading();

                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                    });

                    wx.switchTab({
                        url: "../order/order"
                    })
                }
            },
            fail: function () {
                console.log('fail');
            }
        });
    }
})

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
                city: res["data"]["result"]["address_component"]["street"]
            });

            get_temp_order();
            getPerson();
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
                city: _city
            });

            get_temp_order();
            getPerson();
        },
        fail: function () {
            console.log('fail');
        }
    });
}

function get_temp_order() {
    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_temp_order/',
        method: "POST",
        data: {
            "id": _id,
            "user_id": _user_id
        },

        success: function (res) {
            if (res["data"]["result"] == true) {
                that.setData({
                    order_item: res["data"]["temp"]["orders"],
                    buiness_name: res["data"]["temp"]["buiness"]["name"],
                    price: res["data"]["temp"]["price"]
                })
            }

            wx.hideLoading();
        },

        fail: function () {
            console.log('fail');
        }
    })
}

function getPerson(_id) {
    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_person/',
        method: "POST",
        data: {
            "id": _user_id
        },

        success: function (res) {
            that.setData({
                person: res["data"]["person"]
            })
        },

        fail: function () {
            console.log('fail');
        }
    })
}
