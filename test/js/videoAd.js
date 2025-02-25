
var wxVideoAd = {



    isOnce:true,
    videoAd: null,
    videoAd1: null,
    videoAd2: null,
    videoAd3: null,

    //视频看完回调 
    videoSuccess: null,
    //视频未看完回调 
    videoFail: null,
    //视频调起失败回调
    videoError: null,
    
     /**
     * @param {int} index 视频id的数字编号 1 2 3 
     * @param {string} videoAdUnitId
     * 
     *adSdk.videoSuccess = function(){
     *      //视频看完处理逻辑
     *      this.successFunction();
     * };
     * adSdk.videoFail = function(){
     *      //视频未看完处理逻辑
     *      this.failFunction();`
     * };
     * adSdk.videoError = function(){
     *      //视频调起失败处理逻辑
     *      this.errorFunction();`
     * };
     * var videoAd = adSdk.createVideoAd(1,videoAdUnitId1);
     * videoAd.load().then(() => videoAd.show());
     * //如果多个视频广告id（videoAdUnitId）的情况，通过后台技术配置Config2获取对应的视频广告id，比如：sdk.getConfig2().videoAdUnitId1 或者sdk.getConfig2().videoAdUnitId2
     */
    createVideoAd(index, videoAdUnitId) {
        
        if (index == 1) {
            if (this.videoAd1) {
                return this.videoAd1;
            }
        } else if (index == 2) {
            if (this.videoAd2) {
                return this.videoAd2;
            }

        } else if (index == 3) {
            if (this.videoAd3) {
                return this.videoAd3;
            }
        }
        else {
            if (this.videoAd) {
                return this.videoAd;
            }
        }
        return wxVideoAd.createRewardedVideoAd(index, videoAdUnitId);
    },

    /**
     * 该方法不直接对外提供调用
     * @param {int} index 
     * @param {string} videoAdUnitId1 
     * 
     */
    createRewardedVideoAd(index, videoAdUnitId1) {
        let self = this;
           
        let videoAd = wx.createRewardedVideoAd({ adUnitId: videoAdUnitId1 })

        if(self.isOnce)
        {
            self.isOnce=false;
            videoAd.onLoad(function (res) {
                console.log("sdk VideoAd广告加载事件：", res)
                matrix.BuriedPoint.onAdVideoRequest(wxLogin.curSceneName,true)
            });

            var closeFun1 = function (res) {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    console.log("sdk 看视频成功");
                    self.videoSuccess();
                    matrix.BuriedPoint.onAdVideoClose(wxLogin.curSceneName,true)
                } else {
                    console.error("sdk 看视频失败");
                    self.videoFail();
                    matrix.BuriedPoint.onAdVideoClose(wxLogin.curSceneName,false)
                }
            };


            videoAd.onClose(closeFun1);

            videoAd.onError(function (res) {
                // wx.showToast({
                //     title: '今日视频已上限，明日再来！',
                //     icon: 'none'
                // });
                if (self.videoError) {
                    self.videoError();
                }
                matrix.BuriedPoint.onAdVideoRequest(wxLogin.curSceneName,false)
            });
        }
        

        if (index == 1) {
            this.videoAd1 = videoAd;
        }
        else if (index == 2) {
            this.videoAd2 = videoAd;
        }
        else if (index == 3) {
            this.videoAd3 = videoAd;
        }
        else {
            this.videoAd = videoAd;
        }
        return videoAd;
    }
};

window.wxVideoAd = wxVideoAd;

var wxInterstitialAd={
    createAd(adUnitId){
        var isCompare=wxInterstitialAd.compareVersion(wx.getSystemInfoSync().SDKVersion ,"2.0.4")
        if(isCompare){
            let ad=null;
            if(wx.createInterstitialAd){
                ad=wx.createInterstitialAd({adUnitId:adUnitId});
                ad.onClose(()=>{
                    console.log("关闭插屏广告");
                });
                return ad;                 
            }        
        }
        else{
            console.log("SDK版本低于2.0.4,无法使用插屏广告");
        }
       
    },

    compareVersion(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)
      
        while (v1.length < len) {
          v1.push('0')
        }
        while (v2.length < len) {
          v2.push('0')
        }
      
        for (let i = 0; i < len; i++) {
          const num1 = parseInt(v1[i])
          const num2 = parseInt(v2[i])
      
          if (num1 > num2) {
            return 1
          } else if (num1 < num2) {
            return -1
          }
        }
      
        return 0
      }
    
}
window.wxInterstitialAd = wxInterstitialAd;