import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Navigator, Block } from "@tarojs/components";
import "./archive.scss";

interface IState {
  list: Array<{ _id: string; year: string; list: Array<{ _id: string; summary: { title: string; date: string } }> }>;
}
export default class Archive extends Component<{}, IState> {
  state: IState = {
    list: []
  };
  componentWillMount() {
    this.getArchive();
  }
  config: Config = {
    navigationBarTitleText: "文章归档"
  };
  getDbFn(fn, param) {
    return Taro.cloud.callFunction({
      name: "dao",
      data: { fn, param }
    });
  }
  getArchive() {
    Taro.showLoading({ title: 'loading', });
    this.getDbFn('getArchive', {}).then(res => {
      Taro.hideLoading();
      if (res.result.code == 0) {
        const list = res.result.list.sort((a, b) => Number(b.year) - Number(a.year));
        this.setState({ list: list });
      }
    }).catch(() => {
      Taro.hideLoading();
    })
  }
  onShareAppMessage() {
    return {
      title: '文章归档',
      path: '/pages/archive/archive'
    }
  }
  render() {
    return (
      <View className='container'>
        <View className="content">
          { this.state.list.map(l => (
            <Block>
              <View className='year'>{ l.year }</View>
              <View className='list'>
                { l.list.map(p => (
                  <Navigator key={ p._id } className='item' url={ '/pages/post/post?id=' + p._id }>
                    <Text className='date'>{ p.summary.date.substr(5, 5) }</Text><Text className='title'>{ p.summary.title }</Text>
                  </Navigator>
                )) }
              </View>
            </Block>
          )) }
        </View>
      </View>
    )
  }
}