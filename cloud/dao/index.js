// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const { fn, param } = event;
  return dao[fn](param);
};

const db = cloud.database();
const posts = db.collection('posts')
const dao = {
  getList({ page = 1, size = 10 }) {
    const start = (page -1) * size;
    return posts.field({summary:true}).skip(start).limit(size).get();
  },
  getPost({ id }) {
    return posts.doc(id).get();
  }
};
