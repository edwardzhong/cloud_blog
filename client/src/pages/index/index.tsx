import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Navigator } from "@tarojs/components";
import "./index.scss";

interface IState {
  loading: boolean;
  size: number;
  page: number;
  total: number;
  list: Array<{ _id: string; summary: object }>;
  context:object;
}
export default class Index extends Component<{}, IState> {
  state = {
    loading: false,
    size: 10,
    page: 0,
    total: -1,
    list: [],
    context:{}
  };
  config: Config = {
    navigationBarTitleText: "Jeff's Blog",
    onReachBottomDistance: 50
  };

  componentWillMount() {
    this.getList();
    this.getLogin();
  }

  getDbFn(fn, param) {
    return Taro.cloud.callFunction({
      name: "dao",
      data: { fn, param }
    });
  }

  onReachBottom() {
    this.getList();
  }

  getLogin(){
    Taro.cloud.callFunction({
      name: "login",
      data: {}
    }).then(res => {
      this.setState({ context: res.result });
    }).catch(err=>{
    });
  }
  getList() {
    const { size, page, total, loading } = this.state;
    if (loading) return;
    if (total >= 0 && size * page >= total) return;
    this.setState({ loading: true });
    this.getDbFn("getList", { size, page: page + 1 }).then(res => {
      const total = res.result.total;
      const list = this.state.list.concat(res.result.list);
      this.setState({ loading: false, page: page + 1, total, list });
    }).catch(err => {
      this.setState({ loading: false });
    });
  }
  generate(){
    this.getDbFn("generate",{}).then(res=>{
      if(res.result.code == 0){
        Taro.showToast({
          title:'生成数据成功'
        });
      } else {
        Taro.showToast({
          icon:'none',
          title:'生成数据失败'
        });
      }
    }).catch(err=>{
      Taro.showToast({
        icon:'none',
        title:'生成数据失败'
      });
    })
  }
  onShareAppMessage (res) {
    return {
      title: "Jeff's Blog",
      path: '/pages/index/index'
    }
  }
  render() {
    return (
      <View className='container'>
        { this.state.context.openid == 'oSwD25Uw9XzuoEt7VCLdPxHDKWvY' && <Button className='btn' type='primary' onClick={this.generate}> 生成数据 </Button>}
        {this.state.list.map(l => (
          <View className='item' key={l._id}>
            <Navigator url={'/pages/post/post?id=' + l._id}>
              <Image className='banner' mode='widthFix' src={l.summary.banner} />
              <View className='title'>{l.summary.title}</View>
            </Navigator>
            <View className='sub-title'>
              {l.summary.tags.map(t => (
                <Navigator className='tag' url={'/pages/list/list?tag=' + t}> {t} </Navigator>
              ))}
              <Text className='time'>{l.summary.date}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  }
}
