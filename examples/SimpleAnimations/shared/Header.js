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

class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      width: 0,
      height: 0
    }
    this.measureView = this.measureView.bind(this);
  }

  measureView(event) {
    this.setState({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height
    })
  }

  render(){
    const mainStyle = {
      flex: 1,
      backgroundColor: '#F8F4FC',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#8B8393'
    }
    const submenuStyle = {
      width: this.state.width / 2,
      height: this.state.height / 4,
      borderRadius: 50,
      backgroundColor: '#8B8393'
    }
    return (
      <View style={mainStyle} onLayout={(event) => this.measureView(event)}>
        <View style={submenuStyle}/>
      </View>
    )
  }
}

export default Header;
