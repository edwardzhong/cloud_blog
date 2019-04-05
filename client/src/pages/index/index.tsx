import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Navigator } from "@tarojs/components";
import "./index.scss";

interface IState {
  list: Array<{ _id: string; summary: object }>;
}
export default class Index extends Component<{}, IState> {
  state = {
    list: []
  };
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "Jeff's Blog"
  };

  componentWillMount() {
    this.getList();
  }

  getDbFn(fn, param) {
    return Taro.cloud.callFunction({
      name: "dao",
      data: { fn, param }
    });
  }

  getList() {
    this.getDbFn("getList", {})
      .then(res => {
        console.log(res);
        this.setState({ list: res.result.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <View className='container'>
        {this.state.list.map(l => (
          <Navigator
            className='item'
            key={l._id}
            url={'/pages/post/post?id=' + l._id}>
            <Image className='banner' mode='widthFix' src={l.summary.banner} />
            <View className='title'>{l.summary.title}</View>
            <View className='sub-title'>
              {l.summary.tags.map(t => (
                <Navigator className='tag' url={'/pages/tags/tags?id=' + t}>
                  {t}
                </Navigator>
              ))}
              <Text className='time'>{l.summary.date}</Text>
            </View>
          </Navigator>
        ))}
      </View>
    );
  }
}
