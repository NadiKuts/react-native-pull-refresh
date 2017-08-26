import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  PanResponder,
  View,
  Animated,
  ListView,
  RefreshControl,
  Text,
  Progress,
  StyleSheet,
  ScrollView,
  UIManager,
  StatusBar
} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

class ScrollItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      height: 100
    }
  }

  render(){
    const mainStyle = {
      flex: 1,
      height: this.state.height,
      backgroundColor: '#DCDADF',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#8B8393'
    }
    const imgContainer = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }

    const imgStyle = {
      width: this.state.height / 1.5,
      height: this.state.height / 1.5,
      backgroundColor: '#ADA8B3',
      borderRadius: 10
    }

    const textContainer = {
      flex: 3,
      height: this.state.height / 1.5,
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }

    const textStyle = {
      width: WIDTH / 1.8,
      marginBottom: 10,
      height: this.state.height / 8,
      backgroundColor: '#ADA8B3',
      borderRadius: 10
    }

    const textStyleShort = {
      width: WIDTH / 3,
      marginBottom: 10,
      height: this.state.height / 9,
      backgroundColor: '#ADA8B3',
      borderRadius: 12
    }

    return (
      <View style={mainStyle}>
        <View style={imgContainer}>
          <View style={imgStyle}/>
        </View>

        <View style={textContainer}>
          <View style={textStyle}/>
          <View style={textStyle}/>
          <View style={textStyleShort}/>
        </View>

      </View>
    )
  }
}

export default ScrollItem;
