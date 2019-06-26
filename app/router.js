const routes = require('./router/index');

module.exports = app => {
  Object.keys(routes).forEach(k => {
    let router = routes[k];
    typeof router === 'function' && router(app);
  });
}