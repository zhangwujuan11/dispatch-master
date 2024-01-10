// var HOST = "https://edows.txsofts.com/api/";
// var WebHost = "http://www.txsofts.com/dispatch/"

// var HOST = "https://uat.edows.cn/api/"

var HOST = "https://api.edows.cn/api/"; //正式环境
var WebHost ="http://dispatch.edows.cn/"

var Service = {
  /**
   * 用户登录接口
   * option 请求方式（post或者get）
   * params 请求参数
   * callback 回调   下面接口这三个参数的意义相同
   */
  login: function (option, params, callback) {
    var url = HOST + "member/login";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 用户登出接口
   */
  logout: function (option, params, callback) {
    var url = HOST + "member/logout?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 微信授权API
   */
  autoSignature: function (option, params, callback) {
    var url = HOST + "wx/autoSignature";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 微信授权登录
   */
  wxOauth: function (option, params, callback) {
    var url = HOST + "wx/oauth";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取客户类型
   */
  getUserTypeList: function (option, params, callback) {
    var url = HOST + "userType/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 读取行驶证信息
   */
  readDrivingLicense: function (option, params, callback) {
    var url = HOST + "order/readDrivingLicense?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取所有车辆品牌
   */
  getBrandList: function (option, params, callback) {
    var url = HOST + "car/brand/list";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 获取品牌下的车系
   */
  getCarSeriesList: function (option, params, callback) {
    var url = HOST + "car/series/list";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 获取车系下的车型
   */
  getCarSeries: function (option, params, callback) {
    var url = HOST + "car/info/list";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取订单列表 
   */
  getOrderList: function (option, params, callback) {
    var url = HOST + "order/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (option, params, callback) {
    var url = HOST + "order/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 开始订单提交审核 
   */
  updataOrder: function (option, params, callback) {
    var url = HOST + "order/edit?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 取消订单
   */
  cancelOrder: function (option, params, callback) {
    var url = HOST + "order/cancel?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店接单
   */
  orderRecevie: function (option, params, callback) {
    var url = HOST + "order/recevie?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店拒绝接单
   */
  orderRefuse: function (option, params, callback) {
    var url = HOST + "order/refuse?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 会员查询
   */
  queryMember: function (option, params, callback) {
    var url = HOST + "member/query?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 会员编辑
   */
  updateMember: function (option, params, callback) {
    var url = HOST + "member/updateUser?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },


  /**
   * 上传图片
   */
  uploadPic: function (option, params, callback) {
    var url = HOST + "order/upload?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 太阳膜防伪查询
   */
  queryUserSecurityCode: function (option, params, callback) {
    var url = HOST + "orderSale/queryUserSecurityCode"
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店防伪编码集合
   */
  getSecurityCodeList: function (option, params, callback) {
    var url = HOST + "orderSale/securityCodeList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 防伪编码作废
   */
  delSecurityCodeList: function (option, params, callback) {
    var url = HOST + "orderSale/deleteSecurityCode?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取辅料数据
   */
  getProductMateria: function (option, params, callback) {
    var url = HOST + "orderSale/selectProductMateria?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 勘验单列表
   */
  getSurveyList: function (option, params, callback) {
    var url = HOST + "order/survey/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 勘验单详情
   */
  getSurveyDetail: function (option, params, callback) {
    var url = HOST + "order/survey/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店接查勘单
   */
  recevieSurvey: function (option, params, callback) {
    var url = HOST + "order/survey/recevie?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店拒绝勘单
   */
  refuseSurvey: function (option, params, callback) {
    var url = HOST + "order/survey/refuse?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },



  /**
   * 新增勘验单
   */
  addSurvey: function (option, params, callback) {
    var url = HOST + "order/survey/add?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },



  /**
   * 更新勘验单
   */
  editSurvey: function (option, params, callback) {
    var url = HOST + "order/survey/edit?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取所有省
   */
  getProvList: function (option, params, callback) {
    var url = HOST + "area/states/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取省下所有市
   */
  getCityList: function (option, params, callback) {
    var url = HOST + "area/city/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取所有区
   */
  getZoneList: function (option, params, callback) {
    var url = HOST + "area/zones/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 证书查询
   */
  queryAuditCert: function (option, params, callback) {
    var url = HOST + "shopAudit/queryAuditCertificate?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 查询玻璃
   */
  queryGlass: function (option, params, callback) {
    var url = HOST + "glass/query?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 防伪码获奖列表
   */
  getSaleActiveList: function (option, params, callback) {
    var url = HOST + "orderSale/saleActiveList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },


  /**
   * 获取今日码
   */
  getDatecode: function (option, params, callback) {
    var url = HOST + "datecode/today?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取我的门店信息
   */
  getShopDetail: function (option, params, callback) {
    var url = HOST + "shop/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 更新门店信息
   */
  editShop: function (option, params, callback) {
    var url = HOST + "shop/edit?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 修改密码
   */
  changePassword: function (option, params, callback) {
    var url = HOST + "shop/changePassword?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 意见反馈
   */
  addFeedBack: function (option, params, callback) {
    var url = HOST + "feedBack/add?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 店员列表展示
   */
  getShopPersonList: function (option, params, callback) {
    var url = HOST + "shopPerson/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取门店类型
   */
  getCheckShopType: function (option, params, callback) {
    var url = HOST + "shop/check/shopType?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 店员新增接口
   */
  addUpShopPersonList: function (option, params, callback) {
    var url = HOST + "shopPerson/add?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 店员详情接口
   */
  getShopPersonDetail: function (option, params, callback) {
    var url = HOST + "shopPerson/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 删除店员接口
   */
  delShopPerson: function (option, params, callback) {
    var url = HOST + "shopPerson/delete?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 活动列表接口
   */
  getActiveList: function (option, params, callback) {
    var url = HOST + "activities/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 活动列表接口
   */
  getActiveDetail: function (option, params, callback) {
    var url = HOST + "activities/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 活动用户列表接口
   */
  getActivePersonList: function (option, params, callback) {
    var url = HOST + "activities/personList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取选中报名店员信息
   */
  getActivesPersons: function (option, params, callback) {
    var url = HOST + "activities/getPersons?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 活动报名接口
   */
  joinActive: function (option, params, callback) {
    var url = HOST + "activities/join?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 活动报名店员支付接口
   */
  payActive: function (option, params, callback) {
    var url = HOST + "activities/pay?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 取消报名接口
   */
  cancelActive: function (option, params, callback) {
    var url = HOST + "activities/cancel?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 修改个人报名信息接口
   */
  editActive: function (option, params, callback) {
    var url = HOST + "activities/updateJoinInfo?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },


  /**
   * 活动投票信息
   */
  getActiveVoteInfo: function (option, params, callback) {
    var url = HOST + "activities/voteInfo";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 活动投票信息
   */
  getCompetitorList: function (option, params, callback) {
    var url = HOST + "activities/competitorList";
    this.commonMethod(url, option, params, callback);
  },
  getCompetitorDetail: function (option, params, callback) {
    var url = HOST + "activities/competitorDetail";
    this.commonMethod(url, option, params, callback);
  },
  getVoteGuestInfo: function (option, params, callback) {
    var url = HOST + "activities/voteGuestInfo";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 2020年技师决赛投票
   */
  getFinalVote: function (option, params, callback) {
    var url = HOST + "activities/finalVote";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 活动投票
   */
  voteActive: function (option, params, callback) {
    var url = HOST + "activities/vote";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 投票结果名单
   */
  voteResultActive: function (option, params, callback) {
    var url = HOST + "activities/voteResult";
    this.commonMethod(url, option, params, callback);
  },


  /**
   * 投票名单详情   
   */
  getVoteDetail: function (option, params, callback) {
    var url = HOST + "activities/voteDetail";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 技师风采详情   
   */
  gettechStyleDetail: function (option, params, callback) {
    var url = HOST + "activities/competitorDetail";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 图片验证码
   */
  verifyImgCode: function (option, params, callback) {
    var url = HOST + "verifyCode3";
    this.commonMethod(url, option, params, callback);
  },


  /**
   * 技能大赛接口
   */
  joinCompetition: function (option, params, callback) {
    var url = HOST + "competition/join?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 技能大赛列表
   */
  getCompetitionList: function (option, params, callback) {
    var url = HOST + "competition/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 技能大赛详情
   */
  getCompetitionDetail: function (option, params, callback) {
    var url = HOST + "competition/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 消息列表
   */
  getNotesList: function (option, params, callback) {
    var url = HOST + "notes/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 消息详情
   */
  getNoteDetail: function (option, params, callback) {
    var url = HOST + "notes/getInfoById?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 店铺可售卖的权益卡列表
   */
  getRightCardList: function (option, params, callback) {
    var url = HOST + "rightCard/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取权益卡详情
   */
  getRightCardDetail: function (option, params, callback) {
    var url = HOST + "rightCard/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取权益卡审核项
   */
  getRightCardCheckItems: function (option, params, callback) {
    var url = HOST + "rightCard/checkItems?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 购买权益
   */
  createRightCard: function (option, params, callback) {
    var url = HOST + "rightCard/order/create?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 更新会员创建订单
   */
  addUserRightCardOrder: function (option, params, callback) {
    var url = HOST + "member/addUserOrder?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 权益卡订单列表
   */
  getRightCardOrderList: function (option, params, callback) {
    var url = HOST + "rightCard/order/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 权益卡订单详情
   */
  getRightCardOrderDetail: function (option, params, callback) {
    var url = HOST + "rightCard/order/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 权益订单审核项处理
   */
  auditRightCardOrder: function (option, params, callback) {
    var url = HOST + "rightCard/order/audit?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 镀膜认证审核项列表
   */
  getPlatingOrderChekItemList: function (option, params, callback) {
    var url = HOST + "platingOrder/chekItemList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 镀膜补贴申请
   */
  updatePlatingOrderApply: function (option, params, callback) {
    var url = HOST + "platingOrder/platingApply?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 镀膜申请列表
   */
  getPlatingOrderList: function (option, params, callback) {
    var url = HOST + "platingOrder/List?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 镀膜认证详情
   */
  getPlatingOrderDetail: function (option, params, callback) {
    var url = HOST + "platingOrder/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店认证详情
   */
  getShopAuditDetail: function (option, params, callback) {
    var url = HOST + "shopAudit/auditDetail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店认证支付
   */
  shopAuditPay: function (option, params, callback) {
    var url = HOST + "shopAudit/auditPay?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  getCodeSMS: function (option, params, callback) {
    var url = HOST + "shopAudit/getRegistCodeSMS";
    this.commonMethod(url, option, params, callback);
  },

  getAuditSign: function (option, params, callback) {
    var url = HOST + "shopAudit/sign?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取可参与门店认证员工
   */
  getShopAuditPersonList: function (option, params, callback) {
    var url = HOST + "shopAudit/personList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 参与门店认证员工
   */
  getShopAuditCanPersonList: function (option, params, callback) {
    var url = HOST + "shopAudit/canPersonList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取考试信息
   */
  getExamDetail: function (option, params, callback) {
    var url = HOST + "shop/exam/subject/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 提交答案
   */
  answerExam: function (option, params, callback) {
    var url = HOST + "shop/exam/subject/answer?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店认证申请
   */
  applyShopAudit: function (option, params, callback) {
    var url = HOST + "shopAudit/auditApply?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店认证支付
   */
  payShopAudit: function (option, params, callback) {
    var url = HOST + "shopAudit/auditPay?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  getAuditPrice: function (option, params, callback) {
    var url = HOST + "shopAudit/getAuditPrice";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 区详情
   */
  zonesDetail: function (option, params, callback) {
    var url = HOST + "area/zones/Detail";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 门店服务升级
   */
  upgradeShopAudit: function (option, params, callback) {
    var url = HOST + "shopAudit/auditUpgrade?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 知识列表显示
   */
  getKnowledgeList: function (option, params, callback) {
    var url = HOST + "knowledge/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 查看知识详情
   */
  getKnowledgeDetail: function (option, params, callback) {
    var url = HOST + "knowledge/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 查看店员认证信息
   */
  getPersonAuditInfo: function (option, params, callback) {
    var url = HOST + "shopAudit/personAuditInfo?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 提交店员实操认证
   */
  applyPersonAudit: function (option, params, callback) {
    var url = HOST + "shopAudit/personAuditApply?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 门店问题改进信息
   */
  getSupervisionInfo: function (option, params, callback) {
    var url = HOST + "shopAudit/supervisionInfo?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },


  /**
   * 门店问题改进提交
   */
  submitSupervisionApply: function (option, params, callback) {
    var url = HOST + "shopAudit/supervisionApplySubmit?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },


  /**
   * 订单支付
   */
  payRightCard: function (option, params, callback) {
    var url = HOST + "rightCard/order/pay?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取百度用户待结算列表
   */
  getOrderSettleBdDjsList: function (option, params, callback) {
    var url = HOST + "order/settlement/baidu/djslist?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取百度用户结算中列表
   */
  getOrderSettleBdJszlist: function (option, params, callback) {
    var url = HOST + "order/settlement/baidu/jszlist?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取百度用户已结算列表
   */
  getOrderSettleBdYjslist: function (option, params, callback) {
    var url = HOST + "order/settlement/baidu/yjslist?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 确认百度用户结算申请
   */
  applyBdOrderSettle: function (option, params, callback) {
    var url = HOST + "order/settlement/baidu/confirm?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取非百度用户待结算列表
   */
  getOrderSettleDjsList: function (option, params, callback) {
    var url = HOST + "order/settlement/list/djs?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 结算申请
   */
  applyOrderSettle: function (option, params, callback) {
    var url = HOST + "order/settlement/apply?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },



  /**
   * 获取结算单位待确认结算信息
   */
  getSetdqrList: function (option, params, callback) {
    var url = HOST + "order/settlementCompany/dqrlist?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取结算单位已确认结算信息
   */
  getSetyqrList: function (option, params, callback) {
    var url = HOST + "order/settlementCompany/yqrlist?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 结算单位确认提交
   */
  confirmSettleCompany: function (option, params, callback) {
    var url = HOST + "order/settlementCompany/confirm?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取结算中列表
   */
  getOrderSettleJszList: function (option, params, callback) {
    var url = HOST + "order/settlement/list/jsz?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取结算详情
   */
  getOrderSettleDetail: function (option, params, callback) {
    var url = HOST + "order/settlement/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取结算单下的工单数据
   */
  getSubOrderSettleList: function (option, params, callback) {
    var url = HOST + "order/settlement/orderList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 提交订单争议处理
   */
  bargainOrder: function (option, params, callback) {
    var url = HOST + "order/bargain?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取快递列表
   */
  getExpressList: function (option, params, callback) {
    var url = HOST + "express/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 结算发票信息
   */
  expressOrderSettle: function (option, params, callback) {
    var url = HOST + "order/settlement/express?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取已结算列表
   */
  getOrderSettleYjsList: function (option, params, callback) {
    var url = HOST + "order/settlement/list/yjs?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },



  /**
   * 结算单位列表
   */
  getShopSettleList: function (option, params, callback) {
    var url = HOST + "shopSettlement/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 添加/编辑结算单位
   */
  editShopSettle: function (option, params, callback) {
    var url = HOST + "shopSettlement/edit?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 删除结算单位
   */
  delShopSettle: function (option, params, callback) {
    var url = HOST + "shopSettlement/delete?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 查看结算单位详情
   */
  getShopSettleDetail: function (option, params, callback) {
    var url = HOST + "shopSettlement/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 获取销售单列表
   */
  getOrderSaleList: function (option, params, callback) {
    var url = HOST + "orderSale/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 新增编辑销售单
   */
  editOrderSale: function (option, params, callback) {
    var url = HOST + "orderSale/editInfo?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 销售单详情
   */
  getOrderSaleDetail: function (option, params, callback) {
    //var url = HOST + "orderSale/detailInfo?token=" + (userInfo ? userInfo.token : '');
    var url = HOST + "orderSale/detailInfo";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 销售单报表
   */
  getOrderSaleReportForm: function (option, params, callback) {
    var url = HOST + "orderSale/reportForm?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 销售单报表详情
   */
  getOrderSaleReportFormInfo: function (option, params, callback) {
    var url = HOST + "orderSale/reportFormInfo?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 删除销售单
   */
  delSaleDetail: function (option, params, callback) {
    var url = HOST + "orderSale/delete?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 下载售单
   */
  downOrderSale: function (option, params, callback) {
    var url = HOST + "orderSale/download?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 销售单评价发布
   */
  evaluOrderSale: function (option, params, callback) {
    var url = HOST + "orderSale/publishComment";
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 付款码列表
   */
  getShopPayMethodList: function (option, params, callback) {
    var url = HOST + "shopPayMethod/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 新增/编辑付款码
   */
  editShopPayMethod: function (option, params, callback) {
    var url = HOST + "shopPayMethod/edit?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 付款码详情
   */
  getShopPayMethodDetail: function (option, params, callback) {
    var url = HOST + "shopPayMethod/detailInfo?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 删除付款码
   */
  delShopPayMethod: function (option, params, callback) {
    var url = HOST + "shopPayMethod/delete?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 预约服务
   */
  subReservationService: function (option, params, callback) {
    var url = HOST + "reservationService/submit";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 玻璃商品名称查询
   */
  queryGlassByKw: function (option, params, callback) {
    var url = HOST + "glass/kw/query?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   * 识别VIN码
   */
  vinCode: function (option, params, callback) {
    var url = HOST + "baidu/vinCode?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * VIN-玻璃查询
   */
  vinQuery: function (option, params, callback) {
    var url = HOST + "glass/vin/query?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  setExport: function (option, params, callback) {
    var url = HOST + "order/settlement/export?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  setAuditZg: function (option, params, callback) {
    var url = HOST + "shopAudit/auditZg?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  consumeHistory: function (option, params, callback) {
    var url = HOST + "shop/consumeHistory?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  createBalanceOrder: function (option, params, callback) {
    var url = HOST + "shop/createBalanceOrder?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  balancePay: function (option, params, callback) {
    var url = HOST + "shop/balancePay?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  getShopBalance: function (option, params, callback) {
    var url = HOST + "shop/getShopBalance?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sigParts: function (option, params, callback) {
    var url = HOST + "claim/sig/parts?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  generalBasic: function (option, params, callback) {
    var url = HOST + "baidu/generalBasic?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  generalBasic: function (option, params, callback) {
    var url = HOST + "baidu/generalBasic?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sopAdd: function (option, params, callback) {
    var url = HOST + "sop/add?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sopEdit: function (option, params, callback) {
    var url = HOST + "sop/edit?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sopCheckItem: function (option, params, callback) {
    var url = HOST + "sop/checkItem?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sopGlassList: function (option, params, callback) {
    var url = HOST + "sop/glassList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sopMaterialItem: function (option, params, callback) {
    var url = HOST + "sop/sopMaterialItem?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sopMaterialList: function (option, params, callback) {
    var url = HOST + "sop/sopMaterialList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sopList: function (option, params, callback) {
    var url = HOST + "sop/sopList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  checkMaterialList: function (option, params, callback) {
    var url = HOST + "sop/checkMaterialList?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  sopDelete: function (option, params, callback) {
    var url = HOST + "sop/delete?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },


  userCheck: function (option, params, callback) {
    var url = HOST + "claim/clic/userCheck";
    this.commonMethod(url, option, params, callback);
  },
  myRight: function (option, params, callback) {
    var url = HOST + "claim/clic/myRight";
    this.commonMethod(url, option, params, callback);
  },

  myOrderInfo: function (option, params, callback) {
    var url = HOST + "order/myOrderInfo";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 国寿财-理赔直接派查勘
   */
  claimSendSurvey: function (option, params, callback) {
    var url = HOST + "claim/clic/order/sendSurvey";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 国寿财-理赔直接派工单
   */
  claimSendOrder: function (option, params, callback) {
    var url = HOST + "claim/clic/order/sendOrder";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 国寿财-理赔单返回保险
   */
  claimRefuse: function (option, params, callback) {
    var url = HOST + "claim/clic/order/refuse";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 国寿财-理赔单已联系客户
   */
  claimPass: function (option, params, callback) {
    var url = HOST + "claim/clic/order/pass";
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 国寿财-获取理赔待处理订单
   */
  claimList: function (option, params, callback) {
    var url = HOST + "claim/clic/order/dcl/List?openId=" + (window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '');
    this.commonMethod(url, option, params, callback);
  },
  /**
   *  国寿财-理赔单详情
   */
  claimOrderDetail: function (option, params, callback) {
    var url = HOST + "claim/clic/order/detail?openId=" + (window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '');
    this.commonMethod(url, option, params, callback);
  },

  glassQuery: function (option, params, callback) {
    var url = HOST + "glass/product/query";
    this.commonMethod(url, option, params, callback);
  },

  shopQuery: function (option, params, callback) {
    var url = HOST + "shop/query";
    this.commonMethod(url, option, params, callback);
  },

  glassBanrdList: function (option, params, callback) {
    var url = HOST + "glass/banrdList";
    this.commonMethod(url, option, params, callback);
  },

  glassChangeParts: function (option, params, callback) {
    var url = HOST + "glass/changeParts";
    this.commonMethod(url, option, params, callback);
  },
  /**
   *  获取理赔审核项
   */
  claimChekItem: function (option, params, callback) {
    var url = HOST + "order/claimChekItem";
    this.commonMethod(url, option, params, callback);
  },
  /**
   *  门店创建查勘单
   */
  surveyAdd: function (option, params, callback) {
    var url = HOST + "order/insurance/survey/add?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   *  保险客户类型
   */
  insuranceSurveyList: function (option, params, callback) {
    var url = HOST + "insurance/userType/list";
    this.commonMethod(url, option, params, callback);
  },

  /**
   *  保险客户类型
   */
  memberGetUser: function (option, params, callback) {
    var url = HOST + "member/getUser?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },

  /**
   *  信息单列表
   */
  msgOrderList: function (option, params, callback) {
    var url = HOST + "msgOrder/list?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   *  门店信息工单详情
   */
  msgOrderDetail: function (option, params, callback) {
    var url = HOST + "msgOrder/detail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   *  信息工单单接单
   */
  msgOrderRecevie: function (option, params, callback) {
    var url = HOST + "msgOrder/recevie?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   *  门店拒绝接信息工单
   */
  msgOrderRefuse: function (option, params, callback) {
    var url = HOST + "msgOrder/refuse?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   *  获取门店已报名技师列表
   */
  joinList: function (option, params, callback) {
    var url = HOST + "activities/joinList?token=" + userInfo.token + "&activId=" + params;
    this.commonMethod(url, option, params, callback);
  },

  /**
   *  作品上传
   */
  uploadWorks: function (option, params, callback) {
    var url = HOST + "activities/uploadWorks?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  /**
   * 获取已提交作品信息
   */
  worksDetail: function (option, params, callback) {
    var url = HOST + "activities/worksDetail?token=" + userInfo.token;
    this.commonMethod(url, option, params, callback);
  },
  
  

  // /**
  //  * ETC读取行驶证信息
  //  */
  // readDriveLicensePartner: function(option, params, callback) {
  //     var url = HOST + "partner/readDriveLicense?openId=" +( window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '') ;
  //     this.commonMethod(url, option, params, callback);
  // },

  // 操作提示
  showTip: function (msg, url) {
    //console.log("url is "+ url) ;
    msg = msg || '出错啦，请稍后再试～';
    $('#tip-mes').html(msg);
    if (url) {
      $('#tip-box').show().delay(2000).hide(0);
      setTimeout(function () {
        window.location.href = url;
      }, 1000);
    } else {
      $('#tip-box').show().delay(2000).hide(0);
    }
  },
  commonMethod: function (url, option, params, callback) {
    fn.showLoading();
    $.ajax({
        url: url,
        type: option,
        data: params,
        contentType: "application/json;charset-UTF-8",
        dataType: "json",
        headers: {
          'token': userInfo ? userInfo.token : ""
        },
      })
      .done(function (data) {
        if (data.code == 200) {
          fn.closeLoading();
          callback(data);
        } else if (data.code == 401) {
          fn.closeLoading();
          //跳转登录页面
          setTimeout(function () {
            //window.localStorage.clear();
            // window.localStorage.setItem("userInfo", "");
            // window.location.href = "login.html?returnUrl=" + window.location.href;
          }, 100);
        } else if (data.code == 406) {
          fn.closeLoading();
          //跳转登录页面
          setTimeout(function () {
            // window.localStorage.setItem("userInfo", "");
            // window.location.href = "login.html?returnUrl=" + window.location.href;
          }, 100);
        } else {
          fn.closeLoading();
          callback(data);
          fn.showTip(data.message);
        }
      })

  }
};
$(function () {
  // alert(window.innerHeight)
  // fn.watermark({
  //   watermark_txt: ''
  // })
  var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
  var code = tempJson.code ? tempJson.code : '';
  // 微信登录授权开始
  // if (window.localStorage.getItem("openId")) {

  // } else {
  //   if (code) {
  //     var params = {
  //       code: code
  //     };
  //     console.log(params)
  //     $.ajax({
  //         url: HOST + "wx/oauth",
  //         type: "GET",
  //         data: params,
  //         contentType: "application/json;charset-UTF-8",
  //         dataType: "json"
  //       })
  //       .done(function (data) {
  //         console.log(data)
  //         if (data.code == 200) {
  //           window.localStorage.setItem("openId", data.data.openId);
  //         } else {
  //           //fn.showTip(data.message);
  //           window.location.href = "wxOath.html?redirectUrl=" + window.location.href;
  //         }
  //       })
  //   } else {
  //     window.location.href = "wxOath.html?redirectUrl=" + window.location.href;
  //   }
  // }
  // 微信登录授权结束
});