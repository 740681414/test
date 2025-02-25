var groupRandomFail = false
window.wxShare = {
/**
     * @apiGroup C
     * @apiName shareAppMessage
     * @api {分享} 主动拉起微信分享 shareAppMessage(分享)
     * @apiParam {int} type=1 后台自定义的分享类型；例如：0：右上角分享、1：普通分享 2：分享加金币
     * @apiParam {int} specialFlag=0 特殊标记,例如0:默认、1：邀新好友、2:邀旧好友
     * @apiParam {String} [title] 转发标题
     * @apiParam {String} [imageUrl] 转发显示图片的链接
     * @apiParam {String} [query] 必须是 key1=val1&key2=val2 的格式。
     * @apiParam {callback} [success] 成功回调
     * @apiParam {callback} [fail] 失败回调
     * @apiParam {callback} [cancel] 点击取消分享按钮回调 
     * 
     * @apiSuccessExample {json} 示例:
     * sdk.shareAppMessage({type: 1,query: "",success:xxx,cancel:xxx,fail:xxx });
     */
    shareAppMessage(obj){

        var self = this;
        //.默认1：普通分享
      var type = 1;
        if(obj.type){
          type = obj.type;
        }
        
        var shareInfo = this.getShareByWeight(type);
        if(obj.title){
            shareInfo.title = obj2.title;
        }
        if(obj.imageUrl){
            shareInfo.imageUrl = obj2.imageUrl;
        }
        if(obj.query){
            shareInfo.query == obj.query;
        }
        
        if (obj.success) {
          shareInfo.successCallback = obj.success;
        }
        if (obj.fail) {
          shareInfo.failCallback = obj.fail;
        }
        if (obj.cancel) {
          shareInfo.cancelCallback = function () {
            self.shareCancelCallback = true;
            obj.cancel();
            console.log("分享取消了");
          }
        }
        console.log("微信分享", shareInfo);

        //self.setWeChatAdEvent("/",2,{},null);
        wx.shareAppMessage(shareInfo);

        var nowTime = new Date().getTime();
        self.shareStartTime = nowTime / 1000;
        self.shareInfo = shareInfo;
    },
    /**
     * @apiGroup C
     * @apiName shareAppMessage
     * @api {分享} 主动拉起微信分享 shareAppMessage(分享)
     * @apiParam {int} type=1 后台自定义的分享类型；例如：0：右上角分享、1：普通分享 2：分享加金币
     * @apiParam {int} specialFlag=0 特殊标记,例如0:默认、1：邀新好友、2:邀旧好友
     * @apiParam {String} [title] 转发标题
     * @apiParam {String} [imageUrl] 转发显示图片的链接
     * @apiParam {String} [query] 必须是 key1=val1&key2=val2 的格式。
     * @apiParam {callback} [success] 成功回调
     * @apiParam {callback} [fail] 失败回调
     * @apiParam {callback} [cancel] 点击取消分享按钮回调 
     * 
     * @apiSuccessExample {json} 示例:
     * sdk.shareAppMessage({type: 1,query: "",success:xxx,cancel:xxx,fail:xxx });
     */
    shareAppMessageGroup(obj){

        var self = this;
        //.默认1：普通分享
        var type = 1;
        if(obj.type){
          type = obj.type;
        }
        var shareInfo = this.getShareByWeight(type);
        if(obj.title){
            shareInfo.title = obj.title;
        }
        if(obj.imageUrl){
            shareInfo.imageUrl = obj.imageUrl;
        }
        if(obj.query){
            shareInfo.query == obj.query;
        }
        
          if(obj.success){
              shareInfo.successCallback = function(){
                  // cc.log("把游戏介绍给其他朋友吧")
                  // cc.toast && cc.toast.show("把游戏介绍给其他朋友吧!",1)
                  if(!groupRandomFail && Math.random() > 0.6){
                      groupRandomFail = true;
                      var strArr = ["奖励获取失败，请分享到不同的群试试","奖励获取失败，请分享到群试试"];
                      wx.showModal({
                          title: '提示',
                          content: strArr[Math.floor((Math.random()*2))],
                          confirmText:"再试一下",
                          success:function(res) {
                              if (res.confirm) {
                              self.shareAppMessageGroup(obj);
                              console.log('用户点击确定')
                              } else  {//if (res.cancel)
                              console.log('用户点击取消')
                              obj.fail && obj.fail()
                              }
                          }
                      })
                  }else{
                      groupRandomFail = false;
                      obj.success && obj.success()
                  }
              };;
          }
          if(obj.fail){
              shareInfo.failCallback = obj.fail;
          }
          if(obj.cancel){
              shareInfo.cancelCallback = function(){
                  self.shareCancelCallback=true;
                  obj.cancel();
                  console.log("分享取消了");
              }
          }
          console.log("微信分享", shareInfo);

          //self.setWeChatAdEvent("/",2,{},null);
          wx.shareAppMessage(shareInfo);

          var nowTime = new Date().getTime();
          self.shareStartTime = nowTime/1000;
          self.shareInfo = shareInfo;
    },
    //.根据权重随机获取指定type类型的分享信息。（没有this.ShareList数据不能调用）
    getShareByWeight(type){
        var data = {}
        // if(shareConfig[type] && shareConfig[type].length > 0){
        //     var index = Math.floor(Math.random() * shareConfig[type].length)
        //     data.title = shareConfig[type][index].title
        //     data.imageUrl = "subpackages/MainScene/share/" + shareConfig[type][index].imageUrl//"https://api.jusie.net/wxShareImage/" + shareConfig[type][index].imageUrl
        // }else{
            data =  {title:"既能做公益，又能涨知识！想不到垃圾还有这么多门道？",imageUrl:"subpackages/MainScene/share/1.jpg"}
        // }
        return data
    }
}
const ShareDoc = ["onShare","SHARE_NORMAL","item"]
/**
 * 监听微信返回app，
 */
wx.onShow(function(res){
    var nowTime = new Date().getTime();
    if(nowTime/1000 - window.wxShare.shareStartTime  > 2){//做分享离开时间判断，大于2秒就分享成功
        if(window.wxShare.shareInfo){
            window.wxShare.shareInfo.successCallback && window.wxShare.shareInfo.successCallback()
        }
    }else{
        if(window.wxShare.shareInfo){
            window.wxShare.shareInfo.failCallback && window.wxShare.shareInfo.failCallback()
        }
    }
    window.wxShare.shareInfo = null
});
/**
 * 打开右上角分享
 */
wx.showShareMenu({
    withShareTicket: true
})
/**
 * 修改右上角分享内容
 */
// wx.onShareAppMessage(() => ({
//     title: '四年一次的乒乓球赛，还不快来尽情扣杀？',
//     imageUrl: 'subpackages/MainScene/share/0.jpg' // 图片 URL
// }))
var shareMenuShareInfo = {}
shareMenuShareInfo = {}
shareMenuShareInfo.title = "既能做公益，又能涨知识！想不到垃圾还有这么多门道？"
shareMenuShareInfo.imageUrl = ""
wx.onShareAppMessage(() => {
    return shareMenuShareInfo
  })
  
/**
 * 分享配置
 */
var shareConfig = []
var shareJson = [
    {
        "id": 1,
        "title": "征战乒乓世界巡回赛，开始你的乒乓冠军之旅！",
        "imageUrl": "1.jpg",
        "type": 1
    },
    {
        "id": 2,
        "title": "一拍在手，保证玩的酣畅淋漓，你也赶紧来领!",
        "imageUrl": "2.jpg",
        "type": 2
    }
]
/**
 * 分类型列表
 */
for(var i = 0;i < shareJson.length;i++){
    var json = shareJson[i]
    shareConfig[json.type] = shareConfig[json.type] || []
    shareConfig[json.type].push(json)
}