/**
 * 派发信息到开发域
 */
class OpenDataContext{
    constructor() {
    }
    /**
     * 结算排名信息
     * @param {*} level 
     * @param {*} userScore 
     * @param {*} enemyScore 
     * @param {*} time 
     */
    postGameOverRanking(level,userScore,enemyScore,time) {
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            type: 'setLevelScore',
            score : userScore - enemyScore,
            userScore : userScore,
            enemyScore : enemyScore,
            level:level,
            time:time
        })
    }
    /**
     * 通关排名信息
     * @param {*} level 
     */
    postPassLevel(level) {
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            type: 'setPassLevel',
            level:level
        })
    }
    /**
     * 通关排名信息
     * @param {*} level 
     */
    setGrade(grade) {
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            type: 'setGrade',
            grade:grade
        })
    }
    /**
     * 通知开发域打开结算信息
     * @param {*} width 
     * @param {*} height 
     * @param {*} level 
     */
    openGameOverRanking(width,height,level){
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            type: 'openGameOverRanking',
            width:width,
            height:height,
            level:level,
        })
    }
    /**
     * 通知开放域打开总排名
     * @param {*} width 
     * @param {*} height 
     */
    openLevelRanking(width,height){
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            type: 'openLevelRanking',
            width:width,
            height:height
        })
    }
    /**
     * 通知开放域打开总排名
     * @param {*} width 
     * @param {*} height 
     */
    openGradeRanking(width,height){
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            type: 'openGradeRanking',
            width:width,
            height:height
        })
    }
    /**
     * 通知开放域打开总排名
     * @param {*} width 
     * @param {*} height 
     */
    close(){
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            type: 'close'
        })
    }
    /**
     * 通知开放域打开群排名
     * @param {*} shareTicket 
     * @param {*} width 
     * @param {*} height 
     */
    openGroupRanking(shareTicket,width, height) {
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
          type: 'openGroupRanking',
          width: width,
          height: height,
          shareTicket: shareTicket
        })
      }
    }
window.openDataContext = new OpenDataContext()
/**
 * 监听打开app，获取群信息
 */
wx.onShow(function(res){
    console.log("res",res)
    if(res.query){
        window.openDataContext.startGameType = res.query.gameShareType
        window.openDataContext.startGameData = res.query.gameShareData
        window.openDataContext.startGameTime = new Date().getTime()
    }
    window.openDataContext.shareTicket = res.shareTicket
}.bind(this))