import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Navigator, Block } from "@tarojs/components";
import TextChild from "../../components/textchild/textchild";
import "./post.scss";

interface IState {
  post: {
    _id: string;
    summary: {
      tags: string[];
      title: string;
      banner: string;
      date: string;
    };
    lines: Array<{ type: string; child: object[] }>;
  };
}
export default class Post extends Component<{}, IState> {
  state = {
    post: {
      _id: "",
      summary: {
        title: "",
        tags: [],
        banner: "",
        date: ""
      },
      lines: []
    }
  };
  config: Config = {
    navigationBarTitleText: "Jeff's Blog"
  };

  componentWillMount() {
    const id = this.$router.params.id;
    this.getPost(id);
  }

  getDbFn(fn, param) {
    return Taro.cloud.callFunction({
      name: "dao",
      data: { fn, param }
    });
  }
  getPost(id) {
    Taro.showLoading({ title: 'loading', });
    this.getDbFn("getPost", { id: id }).then(res => {
        Taro.hideLoading();
        this.setState({ post: res.result.data });
      })
      .catch(err => {
        Taro.hideLoading();
      });
  }
  onShareAppMessage (res) {
    return {
      title: this.state.post.summary.title,
      path: '/pages/post/post?id='+this.state.post._id
    }
  }
  render() {
    const { summary, lines } = this.state.post;
    return (
      <View className='container'>
        <View className='post'>
          <Image className='banner' mode='widthFix' src={summary.banner} />
          <View className='title'>{summary.title}</View>
          <View className='sub-title'>
            {summary.tags.map((t, i) => (
              <Navigator key={i} className='tag' url={"/pages/list/list?tag=" + t}> {t} </Navigator>
            ))}
            <Text className='time'>{summary.date}</Text>
          </View>
          <View className='article'>
            {lines.map(l => (
              <Block>
                <View className='line'>
                  {l.type.search("h") == 0 && ( <Text className={l.type}>{l.text}</Text> )}
                  {l.type == "link" && ( <Navigator className='link' url={l.href}> {l.text} </Navigator> )}
                  {l.type == "img" && ( <Image className='pic' mode='widthFix' src={l.src} /> )}
                  {l.type == "sl" && ( <Block> 
                      <Text decode className='num'> {l.num}.{" "} </Text>
                      <TextChild list={l.child} />
                    </Block>
                  )}
                  {l.type == "ul" && ( <Block> 
                      <Text decode className='num'> {" "} &bull;{" "} </Text>
                      <TextChild list={l.child} />
                    </Block>
                  )}
                  {l.type == "text" && l.child.length && ( <TextChild list={l.child} /> )}
                </View>
                {l.type == "code" && (
                  <View className='code'>
                    {l.child.map(c => (
                      <View className='code-line'>
                        {c.type == 'comm' && <Text decode className='comm'> {c.text} </Text>}
                        {c.type == 'md' && <Text decode className='text'> {c.text} </Text>}
                        {c.type == 'text' && c.child.map(i => (
                          <Block>
                            {i.type == "comm" && ( <Text decode className='comm'> {i.text} </Text> )}
                            {i.type == "keyword" && ( <Text decode className='keyword'> {i.text} </Text> )}
                            {i.type == "var" && ( <Text decode className='var'> {i.text} </Text> )}
                            {i.type == "fun" && ( <Text decode className='fun'> {i.text} </Text> )}
                            {i.type == "text" && ( <Text decode className='text'> {i.text} </Text> )}
                          </Block>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              </Block>
            ))}
          </View>
        </View>
      </View>
    );
  }
}
