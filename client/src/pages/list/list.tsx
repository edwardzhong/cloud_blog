import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Navigator } from "@tarojs/components";
import "./list.scss";

interface IState {
  name: string;
  list: Array<{ _id: string; summary: { tags: string[]; title: string; date: string } }>;
}
export default class List extends Component<{}, IState> {
  state: IState = {
    name: '',
    list: []
  };
  config: Config = {
    navigationBarTitleText: "标签列表"
  };

  componentWillMount() {
    const tag = this.$router.params.tag;
    this.setState({ name: tag });
    this.getList({ tag });
  }

  getDbFn(fn, param) {
    return Taro.cloud.callFunction({
      name: "dao",
      data: { fn, param }
    });
  }

  getList(param) {
    Taro.showLoading({ title: 'loading', });
    this.getDbFn("getTagList", param).then(res => {
      Taro.hideLoading();
      if (res.result.code == 0) {
        const list = res.result.list;
        this.setState({ list });
      }
    }).catch(() => {
      Taro.hideLoading();
    });
  }
  onShareAppMessage() {
    return {
      title: this.state.name + '标签列表',
      path: '/pages/list/list?tag=' + this.state.name
    }
  }
  render() {
    const name = this.state.name;
    return (
      <View className='container'>
        { this.state.list.map(l => (
          <View className='item' key={ l._id }>
            <Navigator url={ '/pages/post/post?id=' + l._id }>
              {/* <Image className='banner' mode='widthFix' src={l.summary.banner} /> */ }
              <View className='title'>{ l.summary.title }</View>
            </Navigator>
            <View className='sub-title'>
              {
                l.summary.tags.map(t => {
                  if(t == name) return <Text className='notag'>{ t } </Text>
                  return <Navigator className='tag' url={ '/pages/list/list?tag=' + t }> { t } </Navigator>
                })
              }
              <Text className='time'>{ l.summary.date }</Text>
            </View>
          </View>
        )) }
      </View>
    );
  }
}
