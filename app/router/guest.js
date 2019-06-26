/**
 * 访客模式下一些接口
 */
module.exports = ({middleware, router, controller}) => {
  /** 商品分类 */
  router.get('/guest/spider', controller.guest.getLastPage);
  router.get('/guest/mail', controller.guest.sendMail);
};