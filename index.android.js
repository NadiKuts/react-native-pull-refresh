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


import PullToRefresh from './pullDownAnimation';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

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


export default class lottie_test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
    };
  }

  onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 3000);
  }

  render() {
    return (
      <View style={{flex:1}}>
        <Header/>
        <View style={{flex: 7, backgroundColor: '#F8F4FC'}}>
          <PullToRefresh
            isRefreshing= {this.state.isRefreshing}
            onRefresh= {this.onRefresh.bind(this)}
            animationBackgroundColor = {'#6898E9'}
            pullHeight = {150}
            contentView = {
              <ScrollView>
                <ScrollItem/>
                <ScrollItem/>
                <ScrollItem/>
                <ScrollItem/>
                <ScrollItem/>
                <ScrollItem/>
                <ScrollItem/>
                <ScrollItem/>
                <ScrollItem/>
              </ScrollView>
            }

            onPullAnimationSrc ={require('./coin_pull.json')}
            onStartRefreshAnimationSrc ={require('./christmas_full.json')}
            onRefreshAnimationSrc = {require('./coin_repeat.json')}
            onEndRefreshAnimationSrc = {require('./coin_end.json')}
            >
            </PullToRefresh>
          </View>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },

    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });

  AppRegistry.registerComponent('lottie_test', () => lottie_test);
