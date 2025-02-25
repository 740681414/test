class wxLogin{
    constructor() {
    }
    /**
     * 检查是否已经授权
     * @param {*} callback 
     */
    checkSession(callback) {
        console.log("checkSession")
        this.loginCallback = callback
        wx.checkSession({
            success: function(){
                console.log("checkSession-success")
                wx.getStorage({ key: 'sessionid', 
                    success:function(data){
                        callback(true)
                    }.bind(this),
                    fail: function(){
                        callback(false)
                    }.bind(this)
                })
            }.bind(this),
            fail: function(){
                wx.removeStorage({
                    key: 'sessionid',
                    complete: function() {
                        callback(false)
                    }.bind(this)
                })
            }.bind(this)
        })
    }
    /**
     * 创建微信登陆按钮
     * @param {*} callback 
     */
    createUserInfoButton(callback){
        this.userInfoButton = wx.createUserInfoButton({
            type:"image",
            text:"点击登陆",
            image:"res/game_start.png",
          style: {
            left: window.innerWidth / 2 - window.innerWidth / 750 * 278 /2,
            top: window.innerHeight - window.innerWidth / 750 * 229 - window.innerWidth / 750 * 141/2,
            width: window.innerWidth / 750 * 278,
            height: window.innerWidth / 750 * 141,
            lineHeight: window.innerWidth / 750 * 141,
                backgroundColor: '#00000000',
                color: '#ffffffff',
                textAlign: 'center',
                fontSize: 20,
                borderRadius: 4},
            withCredentials: true,
        });
        this.userInfoButton.onTap(function (res) {
            console.log("onTap",res)
            if (res.errMsg == "getUserInfo:ok" || res.errMsg == "operateWXData:ok") {
                if(this.userInfoButton){
                    this.userInfoButton.hide()
                    this.userInfoButton = null;
                }
                this.userInfo = res.userInfo
                // 调用服务端接口
                var callback1 = callback
                callback = null
                callback1 && callback1(res.userInfo)
                console.log("loging")
            } else {
                this.userInfoButton.show()
                console.log('用户取消授权')
            }
        }.bind(this))
    }
    getUserInfo(){
      wx.getUserInfo({
        withCredentials: true,
        lang: '',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
    /**
     * 隐式登陆
     * @param {*} callback 
     */
    login(callback) {
        console.log("login")
          wx.login({
              success: function(res){
                  console.log("login-success",res.code)
                  var code = res.code
                wx.getSetting({
                  success(res) {
                    console.log("wx.getSetting", res)
                    if (res.authSetting['scope.userInfo']) {
                      wx.getUserInfo({
                        success: function (res) {
                          var userInfo = {}
                          userInfo.userid = "1"
                          userInfo.nickName = res.userInfo.nickName || res.userInfo.nickname
                          userInfo.avatarUrl = res.userInfo.avatarUrl
                          callback(userInfo)
                          // var nickName = userInfo.nickName
                          // var avatarUrl = userInfo.avatarUrl
                          // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                          // var province = userInfo.province
                          // var city = userInfo.city
                          // var country = userInfo.country
                        },
                        fail: function(res) {
                          callback({})
                        }
                      })
                    }else{
                      callback({})
                    }
                  },
                  fail: function(res) {
                    callback({})
                  }
                })
              }.bind(this)
          })
        // })
    }
    /**
     * 
     */
    initGame(){
      
    }
    onGameAwaka(){
      
    }
    onGameSleep(){
      
    }
    onEnterScene(sceneName){
      this.curSceneName = sceneName
    }
    onLeaveScene(sceneName){
    }
    onEventTrigger(evnetName,par1,par2){
    }
    onNavigateBoxItemClick(id){
    }
    onNavigateBoxItemConfirm(id){
    }
  }
window.wxLogin =  new wxLogin()
wx.onShow(function(res){
  window.wxLogin.onGameAwaka()
}.bind(this))
wx.onHide(function(res){
  window.wxLogin.onGameSleep()
}.bind(this))