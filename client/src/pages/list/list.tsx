import Taro, { Component, Config, getWifiList } from "@tarojs/taro";
import { View, Text, Navigator, Block } from "@tarojs/components";
import "./list.scss";

interface IState {
    name:string;
  list: Array<{ _id: string; summary: object }>;
}
export default class List extends Component<{}, IState> {
  state = {
    name:'',
    list: []
  };
  config: Config = {
    navigationBarTitleText: "标签列表"
  };

  componentWillMount() {
    const tag = this.$router.params.tag;
    this.setState({name:tag});
    this.getList({tag});
  }

  getDbFn(fn, param) {
    return Taro.cloud.callFunction({
      name: "dao",
      data: { fn, param }
    });
  }

  getList(param) {
    this.getDbFn("getTagList", param).then(res => {
      if(res.result.code == 0){
        const list = res.result.list;
        this.setState({ list });
      }
    }).catch(err => {
    });
  }
  onShareAppMessage (res) {
    return {
      title: '标签列表',
      path: '/pages/list/list?tag='+ this.state.name
    }
  }
  render() {
    const name = this.state.name;
    return (
      <View className='container'>
        {this.state.list.map(l => (
          <View className='item' key={l._id}>
            <Navigator url={'/pages/post/post?id=' + l._id}>
              <Image className='banner' mode='widthFix' src={l.summary.banner} />
              <View className='title'>{l.summary.title}</View>
            </Navigator>
            <View className='sub-title'>
              {l.summary.tags.map(t => (
                <Text className='notag'>{t} </Text>
              ))}
              <Text className='time'>{l.summary.date}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  }
}
