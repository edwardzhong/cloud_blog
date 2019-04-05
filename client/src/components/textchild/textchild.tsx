import Taro, { Component } from "@tarojs/taro";
import { View, Text, Block, Navigator } from "@tarojs/components";
import './textchild.scss'

interface IProp {
    list:Array<{type:string,text:string,href?:string}>
}
export default class TextChild extends Component<IProp> {
    render() {
        return (
            <Block>
              { this.props.list.map(l=>(
                  <Block>
                  { l.type =='bold' && <Text decode className='bold'>{l.text}</Text>}
                  { l.type =='italy' && <Text decode className='italy'>{l.text}</Text>}
                  { l.type =='italybold' && <Text decode className='italy-bold'>{l.text}</Text>}
                  { l.type =='link' && <Navigator className='link' url={l.href}>{l.text}</Navigator>}
                  { l.type =='text' && <Text decode className='text'>{l.text}</Text>}
                  </Block>
              ))}
        </Block>);
      }
}