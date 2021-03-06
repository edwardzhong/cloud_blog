import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Navigator } from "@tarojs/components";
import "./tags.scss";

interface IState {
  list: Array<{ _id: string; name: string; list: object[] }>;
}
export default class Tags extends Component<{}, IState> {
  state: IState = {
    list: []
  };
  componentWillMount() {
    this.getTags();
  }
  config: Config = {
    navigationBarTitleText: "标签"
  };
  getDbFn(fn, param) {
    return Taro.cloud.callFunction({
      name: "dao",
      data: { fn, param }
    });
  }
  getTags() {
    Taro.showLoading({ title: 'loading', });
    this.getDbFn('getTags', {}).then(res => {
      Taro.hideLoading();
      this.setState({ list: res.result.data });
    }).catch(() => {
      Taro.hideLoading();
    })
  }
  onShareAppMessage() {
    return {
      title: '标签',
      path: '/pages/tags/tags'
    }
  }
  render() {
    return (
      <View className='container'>
        <View className="list">
          { this.state.list.map(l => (
            <Navigator key={ l._id } className='item' url={ '/pages/list/list?tag=' + l.name }>
              { l.name } <Text className='count'>({ l.list.length })</Text>
            </Navigator>
          )) }
        </View>
      </View>
    )
  }
}