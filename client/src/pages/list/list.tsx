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
      console.log(res);
      const list = res.result.data[0].list;
      this.setState({ list });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    const name = this.state.name;
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
                <Block>
                { t != name && <Navigator className='tag' url={'/pages/list/list?tag=' + t}> {t} </Navigator>}
                { t == name && <Text className='notag'>{t} </Text>}
                </Block>
              ))}
              <Text className='time'>{l.summary.date}</Text>
            </View>
          </Navigator>
        ))}
      </View>
    );
  }
}
