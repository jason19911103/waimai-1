// person.js
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
        that = this;

        getPerson(1);
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
        getPerson(1);

        wx.stopPullDownRefresh()
    }
})

function getPerson(_id) {
    wx.showLoading({
        title: '加载中'
    });

    wx.request({
        url: 'https://demo.ztcaoll222.cn/get_person/',
        method: "POST",
        data: {
            "id": _id
        },

        success: function (res) {
            that.setData({
                person: res["data"]["person"]
            });

            wx.hideLoading();
        },

        fail: function () {
            console.log('fail');
        }
    })
}
