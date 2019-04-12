// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
    const { fn, param } = event;
    return dao[fn](param);
};

const db = cloud.database();
const posts = db.collection("posts");
const tags = db.collection("tags");
const archive = db.collection("archive");
const dao = {
    async getList({ page = 1, size = 10 }) {
        const start = (page - 1) * size;
        try {
            const { total } = await posts.count();
            const { data } = await posts
                .field({ summary: true })
                .skip(start)
                .limit(size)
                .get();
            return {
                code: 0,
                list: data,
                total,
                message: "sucess"
            };
        } catch (err) {
            return {
                code: -1,
                list: [],
                total: -1,
                err: err,
                message: "error"
            };
        }
    },
    getPost({ id }) {
        return posts.doc(id).get();
    },
    getTags() {
        return tags.get();
    },
    getTagList({ tag }) {
        return tags.where({ name: tag }).get();
    },
    getArchive() {
        return archive.get();
    },
    async generate() {
        //生成标签和存档数据表
        try {
            let tag = {};
            let year = {};
            const { data } = await posts.field({ summary: true }).get();
            data.forEach(p => {
                p.summary.tags.forEach(t => {
                    tag[t] = tag[t] || [];
                    tag[t].push(p);
                });
                let y = p.summary.date.substr(0, 4);
                year[y] = year[y] || [];
                year[y].push(p);
            });
            const [tRet,aRet] = await Promise.all([tags.where({done:true}).remove(),archive.where({done:true}).remove()]);
            
            for (let [k, v] of Object.entries(tag)) {
                tags.add({
                    data: { name: k, list: v, done:true }
                });
            }
            for (let [k, v] of Object.entries(year)) {
                archive.add({
                    data: { year: k, list: v, done:true}
                });
            }

            return {
                code: 0,
                message: "success"
            };
        } catch (err) {
            return {
                code: -1,
                err: err,
                message: "error"
            };
        }
    }
};
