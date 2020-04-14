Page({
    component: null,
    data: {
        roomID: '',
        role: 'anchor',
        roomName: '',
        pureAudio: false,
        debug: false,
        muted: false,
        beauty: 5
    },

    onLoad: function (options) {
        const roomID = options.roomID
        const roomName = options.roomName

        this.setData({
            roomID: roomID,
            roomName: roomName,
            role: 'anchor'
        }, function () {
            this.start();
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.component && this.component.resume();
    },

    start: function () {
        this.component = this.selectComponent("#id_liveroom")
        this.component.start();
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.data.roomName
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.component && this.component.pause();
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
        return {
            // title: '多人音视频',
            // path: '/pages/multiroom/roomlist/roomlist',
            // path: '/pages/home-page/main',
            imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
        }
    }
})
