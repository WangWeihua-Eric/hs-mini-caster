import {debounceForFunction} from "../../utils/time-utils/time-utils";
import {RoomService} from "../../service/roomService";
import {UserBase} from "../../utils/user-utils/user-base";
import {CasterActiveService} from "../../utils/room-utils/caster-utils/caster-active-service";

const webimhandler = require('../../pages/components/mlvb-live-room/webim_handler');

const app = getApp()

const roomService = new RoomService()
const userBase = new UserBase()
const casterActiveService = new CasterActiveService()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        roomTextList: {type: Array, value: []},
        pusherStatus: {type: Number, value: 1},
        beauty: {type: Number, value: 5},
        requestJoinAnchorList: {type: Array, value: []},
        members: {type: Array, value: []},
        linkError: {type: Boolean, value: false},
        linkOk: {type: Boolean, value: false}
    },

    /**
     * 组件的初始数据
     */
    data: {
        playStatus: 0,
        readyTime: 3,
        toIndex: '',
        showMessage: true,
        frontCamera: true,
        show: false,
        bgColor: 'rgba(0,0,0,0.75)',
        inLink: false,
        inLinkUser: {},
        linkWiteList: [],
        canLink: false,
        inReview: false,
    },

    observers: {
        "linkOk": function (linkOk) {
            if (linkOk) {
                setTimeout(() => {
                    if(!this.data.inLink) {
                        this.onCloseLink()
                        wx.showModal({
                            content: '对方网络差，连麦失败',
                            showCancel: false
                        })
                    }
                }, 10000)
            }
        },
        "roomTextList": function(roomTextList) {
            if(roomTextList && roomTextList.length) {
                const id = `text-${roomTextList.length - 1}`
                this.setData({
                    toIndex: id
                })
            }
        },
        "showMessage": function (showMessage) {
            if(showMessage) {
                const roomTextList = this.data.roomTextList
                if(roomTextList && roomTextList.length) {
                    const id = `text-${roomTextList.length - 1}`
                    this.setData({
                        toIndex: id
                    })
                }
            }
        },
        "members": function (members) {
            this.updateLinkWiteList()
            if(members && members.length) {
                let inLink = false
                members.forEach(item => {
                    if (item.accelerateURL) {
                        inLink = true
                    }
                })
                if (!inLink) {
                    userBase.setGlobalData({preLinkUserInfo: {}})
                }
                const show = inLink ? false : this.data.show
                this.setData({
                    inLink: inLink,
                    show: show
                })
            } else {
                userBase.setGlobalData({preLinkUserInfo: {}})
                this.setData({
                    inLink: false
                })
            }

            setTimeout(() => {
                wx.setKeepScreenOn({
                    keepScreenOn: true
                })
            }, 10000)
        },
        "requestJoinAnchorList": function () {
            this.updateLinkWiteList()
        },
        "linkError": function (linkError) {
            if (linkError) {
                //  用户拒绝接听
                const userId = userBase.getGlobalData().preLinkUserInfo.userID
                const list = this.data.linkWiteList.filter(item => item.userId !== userId)
                this.setData({
                    linkWiteList: list
                })
                userBase.setGlobalData({preLinkUserInfo: {}})
                this.rejectLink(userId)
            }
        }
    },

    pageLifetimes: {
        show() {
            userBase.setGlobalData({
                preLinkUserInfo: {}
            })
        }
    },

    lifetimes: {
        attached() {
            this.setData({
                inReview: app.globalData.inReview
            })
            wx.setKeepScreenOn({
                keepScreenOn: true
            })
            this.onCloseCanLink()
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        rejectLink(userId) {
            roomService.teacherLinkmicPop(userBase.getGlobalData().sessionId, userBase.getGlobalData().roomId, userId).then(() => {
                this.updateLinkWiteList()
            })
        },
        updateLinkWiteList() {
            casterActiveService.updateLinkList().then(linkWiteList => {
                this.setData({
                    linkWiteList: linkWiteList ? linkWiteList : []
                })
            })
        },
        onPlayLive() {
            this.setData({
                playStatus: 2
            })
            this.onReadyPlay()
        },
        onReadyPlay() {
            setTimeout(() => {
                if (this.data.readyTime > 0) {
                    const time = this.data.readyTime - 1
                    this.setData({
                        readyTime: time
                    })
                    this.onReadyPlay()
                } else {
                    this.toPaly()
                }
            }, 1000)
        },
        toPaly() {
            this.setData({
                playStatus: 3
            })
            this.triggerEvent('casterStartEvent')
        },
        onShowMessage() {
            this.setData({
                showMessage: !this.data.showMessage
            })
        },
        onChangeBeauty() {
            if(debounceForFunction()) {
                return
            }
            this.triggerEvent('changeBeautyEvent')
        },
        onSwitchCameraEvent() {
            if(debounceForFunction()) {
                return
            }
            const frontCamera = this.data.frontCamera
            this.setData({
                frontCamera: !frontCamera
            })
            this.triggerEvent('switchCameraEvent')
        },
        onCloseSheet() {
            this.setData({ show: false });
        },

        onShowSheet() {
            this.updateLinkWiteList()
            this.setData({ show: true });
        },
        onResolveLinkEvent(event) {
            const userInfo = event.currentTarget.dataset.value
            const userID = userInfo.userId
            const userName = userInfo.nick
            const userAvatar = userInfo.avatar
            this.setData({
                show: false
            })
            casterActiveService.resolveLink(userID, userName, userAvatar)
        },
        onRejectLinkEvent(event) {
            if (userBase.getGlobalData().preLinkUserInfo.userID) {
                wx.showModal({
                    content: '正在等待当前用户处理连麦，接通或挂断后再处理下一个人',
                    showCancel: false
                })
                return
            }

            const userInfo = event.currentTarget.dataset.value
            const userID = userInfo.userId
            const userName = userInfo.nick
            const userAvatar = userInfo.avatar
            const list = this.data.linkWiteList.filter(item => item.userId !== userID)
            this.setData({
                linkWiteList: list
            })
            casterActiveService.rejectLink(userID, userName, userAvatar)
        },
        onCloseLink() {
            const closeUser = userBase.getGlobalData().preLinkUserInfo
            if (closeUser) {
                this.triggerEvent('onCloseLinkEvent', closeUser)
            }
            userBase.setGlobalData({
                preLinkUserInfo: null
            })
            this.setData({
                inLink: false
            })
        },
        onBackBtn() {
            wx.navigateBack({
                delta: 1
            })
        },
        onOpenLink() {
            roomService.linkmicStatePush(userBase.getGlobalData().sessionId, userBase.getGlobalData().roomId, 'on').then(() => {
                this.setData({
                    canLink: true
                })
                casterActiveService.sendLinkStatus('on')
            }).catch(() => {
                wx.showModal({
                    title: '连麦权限开启失败',
                    content: '请重试打开连麦权限'
                })
            })
        },
        onCloseCanLink() {
            roomService.linkmicStatePush(userBase.getGlobalData().sessionId, userBase.getGlobalData().roomId, 'off').then(() => {
                this.setData({
                    canLink: false
                })
                casterActiveService.sendLinkStatus('off')
            }).catch(() => {
                wx.showModal({
                    title: '连麦权限关闭失败',
                    content: '请重试关闭连麦权限'
                })
            })
        }
    }
})
