// detail.js
var id;
var that;
var _dishess = [];
var _order = [];

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0,
        swiper_h: 2
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;
        _dishess = [];

        id = options.id;

        getDetail(1, id);
        getEvaluation(1, id);
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

    switchTab: function (e) {
        this.setData({
            currentTab: e["currentTarget"]["dataset"]["tab"]
        })
    },

    tabChange: function (e) {
        this.setData({
            currentTab: e["detail"]["current"]
        })
    },

    finishOrder: function () {
        wx.request({
            url: 'https://demo.ztcaoll222.cn/add_order/',
            method: "POST",
            data: {
                "dish_id": _order.join(","),
                "id": 1
            },

            success: function (res) {
                if (res["data"]["resulr"] = true) {
                    wx.navigateTo({
                        url: "../finish_order/finish_order?id="+id
                    })
                }
            },

            fail: function () {
                console.log('fail');
            }
        })
    },

    orderChange: function (e) {
        _order = e["detail"]["value"];
        var _price = 0;
        if (_order.length > 0) {
            for (var i = 0; i < _order.length; i++) {
                _price += getPrice(_order[i]);
            }
            this.setData({
                order_btn_color: "#58d178",
                order_btn_action: "finishOrder",
                order_price: _price
            })
        } else {
            this.setData({
                order_btn_color: "",
                order_btn_action: "",
                order_price: _price
            })
        }
    },
});

function getDetail(_count, _id) {
    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_dishes/',
        method: "POST",
        data: {
            "count": _count,
            "id": _id
        },

        success: function (res) {
            dishessAdd(res["data"]["dishes"]);

            that.setData({
                business: res["data"]["business"],
                dishess: _dishess,
            })
        },

        fail: function () {
            console.log('fail');
        }
    })
}

function dishessAdd(_temp) {
    for (var i = 0; i < _temp.length; i++) {
        _dishess.push(_temp[i]);
    }
}

function getPrice(_id) {
    var price = 0;
    for (var i = 0; i < _dishess.length; i++) {
        if (_id == _dishess[i]["id"]) {
            price = _dishess[i]["price"];
            break;
        }
    }
    return price;
}

function getEvaluation(_count, _id) {
    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_evaulation/',
        method: "POST",
        data: {
            "count": _count,
            "id": _id
        },

        success: function (res) {
            that.setData({
                evaluations: res["data"]["evalustions"]
            })
        },

        fail: function () {
            console.log('fail');
        }
    })
}
