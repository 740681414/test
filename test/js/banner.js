window.wxBanner = {
    /**
     * 更新banner位置
     */
    updateBannerPos(){
        var self = this
        // console.log("self.bannerAd.style.top = ",self.bannerAd)
        if(this.isIPhoneX()){
            // console.log("self.bannerAd.style.top2 = ",self.bannerAd)
            if(self.bannerAd){
                // self.bannerAd.style.top = self.h - self.bannerAd.style.realHeight - 20;
                self.bannerAd.style.top = self.bannerAd.style.top1 - self.bannerAd.style.topIndex;
                if(self.bannerAd.style.topIndex == 0){
                    self.bannerAd.style.topIndex++
                }else{
                    self.bannerAd.style.topIndex = 0
                }
            }
        }
    },
    /**
     * 判断是否为IPhoneX
     */
    isIPhoneX(){
        var phone = wx.getSystemInfoSync();
        var model = phone.model
        console.log("phone.model = ",phone.model)
        var reg = new RegExp("iPhone X|iPhone XS|iPhone XR|iPhone XS Max|iPhone x|iPhone xs|iPhone xr|iPhone xs max");
        return reg.test(model)
    },
    
    onAdBannerRequest(){
        matrix.BuriedPoint.onAdBannerRequest()
    },
     /**
     * 
     * @param {json} obj 
     * @param {string} bannerAdUnitId 
     * 多个banner广告id调用如下：（注意第一次调起不需要去做销毁destory）
     *       if(adSdk.bannerAd)
     *       {
     *          adSdk.createBannerAdByAdId({},bannerAdUnitId1).destroy();
     *          adSdk.bannerAd =null;
     *       }
     *       var bannerAd =adSdk.createBannerAdByAdId({},bannerAdUnitId2);
     *       bannerAd.show(); 
     * //如果多个banner广告id（bannerAdUnitId）的情况，通过后台技术配置Config2获取对应的banner广告id，比如：sdk.getConfig2().bannerAdUnitId1 或者sdk.getConfig2().bannerAdUnitId2
     */
    
    createBannerAdByAdId(obj,bannerAdUnitId){
        var self = this;
        if(this.bannerAd){
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
            var phone = wx.getSystemInfoSync();
            var model = phone.model
            this.w = phone.screenWidth / 2;
            this.h = phone.screenHeight;
            var ratio = phone.screenWidth/750
            if (obj.type == "top") {
                obj.style = {};
                console.log(phone)
                // obj.style.left = 0;
                // obj.style.top = 0;
                // obj.style.width = 300;
                obj.style.left = self.w - 300 / 2;
                obj.style.top = self.h - 75;
                if(obj.type != "top" || self.isIPhoneX(model) || this.w < 285){
                    obj.style.width = 300;
                }else{
                    obj.style.height = 180* ratio;
                }
            }else{
                obj.style = {};
                console.log(phone)
                obj.style.left = self.w - 300 / 2;
                obj.style.top = self.h - 75;
                obj.style.width = 300;
            }
            this.bannerAd = wx.createBannerAd({
                adUnitId: bannerAdUnitId,
                style: obj.style
            });
            
            this.bannerAd.onResize(function(res) {
                console.log("sdk BannerAd广告缩放事件：", res)
                console.log("sdk BannerAd广告缩放事件：", self.bannerAd)
                if(self.bannerAd.posLeft){
                    self.bannerAd.style.left = ratio * self.bannerAd.posLeft + .1;
                }else{
                    self.bannerAd.style.left = self.w - res.width / 2 + .1;
                }
                
                if(self.isIPhoneX(model)){
                    self.bannerAd.style.top = self.h - res.height - 1;// - 40* self.h/750;
                    self.bannerAd.style.top1 = self.bannerAd.style.top;
                    // console.log("sdk BannerAd广告缩放事件：", self.bannerAd.style.top)
                    self.bannerAd.style.topIndex = 1;
                }else{
                    if (obj.type == "top") {
                        self.bannerAd.style.top = ratio * 507;
                    }else{
                        self.bannerAd.style.top = self.h - res.height + 1;
                    }
                }
            });
            this.bannerAd.onLoad(function(res){
                if(!self.bannerAd.isShowBanner){
                    self.bannerAd.hide()
                }
                matrix.BuriedPoint.onAdBannerRequest(wxLogin.curSceneName,true)
                console.log("sdk BannerAd广告加载事件：", res)
            });
            this.bannerAd.onError(function(res){
                matrix.BuriedPoint.onAdBannerRequest(wxLogin.curSceneName,false)
                console.log("sdk BannerAd广告错误事件：", res)
            });
            this.bannerAd.isShowBanner = true;
            this.bannerAd.show(wxLogin.curSceneName);
            matrix.BuriedPoint.onAdBannerShow()
            return this.bannerAd;
    },
    show(){
        if(this.bannerAd){
            this.bannerAd.show();
            matrix.BuriedPoint.onAdBannerShow(wxLogin.curSceneName)
            this.bannerAd.isShowBanner = true;
            return true
        }
        return false
    },
    hide() {
        if(this.bannerAd){
            this.bannerAd.hide();
            this.bannerAd.isShowBanner = false;
            return true
        } 
        return false
    },
    /**
     * 销毁广告
     */
    destroy() {
        this.bannerAd && (this.bannerAd.destroy(), this.bannerAd = null)
    }
}
/**
 * 监听微信返回app
 */
wx.onShow(function (res) {
    window.wxBanner.updateBannerPos()
})
