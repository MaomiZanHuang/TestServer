'use strict';
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const User = app.model.define('qq_email', {
    qq: {
      type: STRING,
      primaryKey: true
    },
    // 是否已发送0未，1已
    is_send: {
      type: INTEGER
    },
    // 标签，qq_zan,ss_zan
    tag: {
      type: STRING
    },
    time: {
      type: STRING
    }
    
  }, {
    freezeTableName: true,
    tableName: 'qq_email',
    timestamps: false
  });
  return User;
}