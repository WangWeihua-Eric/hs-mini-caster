import {RoomService} from "../../service/roomService";
import {UserBase} from "../../utils/user-utils/user-base";

const app = getApp()

const roomService = new RoomService()
const userBase = new UserBase()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        debug: {type: Boolean, value: false},
        menuItems: {type: Array, value: []},
        isCaster: {type: Boolean, value: true},
        mainPusherInfo: {type: Object, value: {}},
        beauty: {type: Number, value: 5},
        muted: {type: Boolean, value: false},
        pureaudio: {type: Boolean, value: false},
        userName: {type: String, value: ''},
        visualPlayers: {type: Array, value: []},
        linkPusherInfo: {type: Object, value: {}},
        members: {type: Array, value: []},
        mode: {type: String, value: 'RTC'},
        roomname: {type: String, value: 'undefined'},
        headerHeight: {type: Number, value: app.globalData.headerHeight},
        statusBarHeight: {type: Number, value: app.globalData.statusBarHeight},
        roomTextList: {type: Array, value: []},
        pusherStatus: {type: Number, value: 0},
        requestJoinAnchorList: {type: Array, value: []},
        showUserImgList: {type: Array, value: []},
        roomInfoData: {type: Object, value: {}},
        requestLinkError: {type: Boolean, value: false},
        requestLinkOk: {type: Boolean, value: false},
        preLinkInfo: {type: Object, value: {}},
        linkError: {type: Boolean, value: false},
        linkOk: {type: Boolean, value: false}
    },

    observers: {
        "pusherStatus": function (pusherStatus) {
            console.log("pusherStatus: ", pusherStatus)
        },

        "members": function (members) {
            if(members && members.length) {
                let inLink = false
                members.forEach(item => {
                    if (item.accelerateURL) {
                        inLink = true
                    }
                })
                if (inLink) {
                    this.setUserSelectColor()
                } else {
                    this.setData({
                        userSelectColor: ''
                    })
                }
            } else {
                this.setData({
                    userSelectColor: ''
                })
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        userSelectColor: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        setUserSelectColor() {
            roomService.getUserSelectColor(userBase.getGlobalData().sessionId, userBase.getGlobalData().preLinkUserInfo.userID, userBase.getGlobalData().roomId).then(res => {
                this.setData({
                    userSelectColor: res[0].tagName
                })
            })
        },
        onSendTextMsg(event) {
            const param = event.detail
            this.triggerEvent('sendTextMsgEvent', param)
        },

        onMainPush(event) {
            console.log('播放状态发生变化: ', event)
            this.triggerEvent('mainPushEvent', event)
        },

        onMainError(event) {
            this.triggerEvent('mainErrorEvent', event)
        },

        onLinkPush(event) {
            this.triggerEvent('linkPushEvent', event)
        },

        onLinkError(event) {
            this.triggerEvent('linkErrorEvent', event)
        },

        onLinkTeacherEvent() {
            this.triggerEvent('lintTeacher')
        },
        onMainPlayState(event) {
            this.triggerEvent('statechangeEvent', event)
        },

        onMainPlayError(e) {
            console.log('===> onMainPlayError: ', e)
        },

        onCasterStartEvent() {
            this.triggerEvent('casterStartEvent')
        },
        onChangeBeautyEvent() {
            const beauty = this.data.beauty
            this.setData({
                beauty: beauty === 5 ? 0 : 5
            })
        },
        onSwitchCameraEvent() {
            this.triggerEvent('switchCameraEvent')
        },

        quitLink() {
            this.triggerEvent('quitLinkEvent')
        },

        kickoutJoinAnchor(event) {
            this.triggerEvent('kickoutJoinAnchorEvent', event)
        },

        onCloseLinkEvent(event) {
            const param = {
                currentTarget: {
                    dataset: {
                        userid: event.detail.userID
                    }
                }
            }
            this.triggerEvent('kickoutJoinAnchorEvent', param)
        },

        onOpLinkEvent() {
            this.triggerEvent('opLinkEvent')
        },

        onLivePlayerStatusEvent(event) {
            console.log('拉流网络状态: ', event.info)
        }
    }
})
