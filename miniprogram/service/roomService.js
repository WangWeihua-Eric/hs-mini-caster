import {HttpUtil} from "../utils/http-utils/http-util";

const GenerateTestUserSig = require("../pages/mlvb-live-room-demo/debug/GenerateTestUserSig.js")
const liveroom = require('../pages/components/mlvb-live-room/mlvbliveroomcore.js')

let singletonPattern = null;

export class RoomService {
    http = new HttpUtil()

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    /**
     * 登录房间
     */
    loginRoom(roomId, userName, userSig, roomAppId) {
        const roomSig = GenerateTestUserSig.genTestUserSig(roomId)

        const loginInfo = {
            sdkAppID: roomAppId,
            userID: roomId,
            userSig: userSig,
            userName: userName,
            userAvatar: ''
        }

        return new Promise((resolve, reject) => {
            //  MLVB 登录
            liveroom.login({
                data: loginInfo,
                success: (res) => {
                    //  登录成功
                    resolve(res)
                },
                fail: (err) => {
                    //  登录失败
                    reject(err)
                }
            })
        })
    }

    /**
     * 获取连麦列表
     */
    linkmicList(sessionId, roomId) {
        return new Promise((resolve, reject) => {
            const url = '/room/api/linkmic/list'
            const params = {
                appSign: 'hongsongkebiao',
                sessionId: sessionId,
                roomId: roomId
            }
            this.http.get(url, params).then(res => {
                if (res && res.state && res.state.code === '0') {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 老师拒绝连麦
     */
    teacherLinkmicPop(sessionId, roomId, userId) {
        return new Promise((resolve, reject) => {
            const url = '/room/api/anchor/linkmic/pop'
            const params = {
                appSign: 'hongsongkebiao',
                sessionId: sessionId,
                roomId: roomId,
                userId: userId
            }
            this.http.post(url, params).then(res => {
                if (res && res.state && res.state.code === '0') {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 加入连麦
     */
    linkmicPush(sessionId, roomId) {
        return new Promise((resolve, reject) => {
            const url = '/room/api/linkmic/push'
            const params = {
                appSign: 'hongsongkebiao',
                sessionId: sessionId,
                roomId: roomId
            }
            this.http.post(url, params).then(res => {
                if (res && res.state && res.state.code === '0') {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 取消连麦
     */
    linkmicPop(sessionId, roomId) {
        return new Promise((resolve, reject) => {
            const url = '/room/api/linkmic/pop'
            const params = {
                appSign: 'hongsongkebiao',
                sessionId: sessionId,
                roomId: roomId
            }
            this.http.post(url, params).then(res => {
                if (res && res.state && res.state.code === '0') {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 更新连麦权限
     */
    linkmicStatePush(sessionId, roomId, state) {
        return new Promise((resolve, reject) => {
            const url = '/room/api/anchor/linkmic/statepush'
            const params = {
                appSign: 'hongsongkebiao',
                sessionId: sessionId,
                roomId: roomId,
                state: state
            }
            this.http.post(url, params).then(res => {
                if (res && res.state && res.state.code === '0') {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}