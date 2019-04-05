import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";

export default class Info extends Component {
  state = {
    context: {}
  };
  getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        console.log(res);
        this.setState({
          context: res.result
        });
      });
  };
  getUserInfo = () => {
    Taro.getSetting().then(res => {
      if (res.authSetting["scope.userInfo"]) {
        Taro.getUserInfo().then(res => {
          console.log(res);
        });
      }
    });
  };

  render() {
    return (
      <View className="index">
        <Button type="primary" onClick={this.getLogin}>
          获取登录云函数
        </Button>
        <Text>context：{JSON.stringify(this.state.context)}</Text>
        <Button type="warn" onClick={this.getUserInfo}>
          获取用户信息
        </Button>
      </View>
    );
  }
}
