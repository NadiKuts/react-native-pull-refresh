import React from 'react'
import {
  View,
  ScrollView,
  Animated,
  PanResponder,
  UIManager,
  Dimensions
} from 'react-native'

import Animation from 'lottie-react-native';

class AnimatedPTR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY : new Animated.Value(0),
      refreshHeight: new Animated.Value(0),
      currentY : 0,
      isScrollFree: false,

      isAnimatedEnded: false,

      isRefreshAnimationStarted: false,
      isRefreshAnimationEnded: false,
      initAnimationProgress: new Animated.Value(0),
      repeatAnimationProgress: new Animated.Value(0),
      finalAnimationProgress: new Animated.Value(0)
    }

    this.onRepeatAnimation = this.onRepeatAnimation.bind(this);
    this.onEndAnimation = this.onEndAnimation.bind(this);

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  static propTypes = {
    /**
    * Refresh state set by parent to trigger refresh
    * @type {Boolean}
    */
    isRefreshing : React.PropTypes.bool.isRequired,
    /**
    * Sets pull distance for how far the Y axis needs to be pulled before a refresh event is triggered
    * @type {Integer}
    */
    pullHeight : React.PropTypes.number,
    /**
    * Callback for when the refreshing state occurs
    * @type {Function}
    */
    onRefresh : React.PropTypes.func.isRequired,
    /**
    * The content view which should be passed in as a scrollable type (i.e ScrollView or ListView)
    * @type {Object}
    */
    contentView: React.PropTypes.object.isRequired,
    /**
    * The content view's background color, not to be mistaken with the content component's background color
    * @type {string}
    */
    animationBackgroundColor: React.PropTypes.string,
    /**
    * Custom onScroll event
    * @type {Function}
    */
    onScroll: React.PropTypes.func
  }

  static defaultProps = {
    pullHeight : 180,
    animationBackgroundColor: 'white'
  }

  componentWillMount() {
    //Android does not allow for negative scroll, so we have to listen to the scroll values ourselves (at least initially)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
    });
  }

  componentWillReceiveProps(props) {
    if(this.props.isRefreshing !== props.isRefreshing) {
      // Finish the animation and set refresh panel height to 0
      if(!props.isRefreshing) {
        Animated.spring(this.state.refreshHeight, {
          toValue: 0,
          bounciness: 12
        }).start(() => {
          this.state.initAnimationProgress.setValue(0);
          this.setState({isAnimatedEnded: false});
        })
      }
    }
  }

  _handleStartShouldSetPanResponder(e, gestureState) {
    return !this.state.isScrollFree;
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    return !this.state.isScrollFree;
  }

  //if the content scroll value is at 0, we allow for a pull to refresh
  _handlePanResponderMove(e, gestureState) {
    if(!this.props.isRefreshing) {
      if((gestureState.dy >= 0 && this.state.scrollY._value === 0) || this.state.refreshHeight._value > 0) {
        this.state.refreshHeight.setValue(-1*gestureState.dy*.5);
      } else {
        // Native android scrolling
        this.refs.scrollComponentRef.scrollTo({y: -1*gestureState.dy, animated: true});
      }
    }
  }

  _handlePanResponderEnd(e, gestureState) {
    if(!this.props.isRefreshing) {
      if(this.state.refreshHeight._value <= -this.props.pullHeight) {
        this.onScrollRelease();
        Animated.parallel([
          Animated.spring(this.state.refreshHeight, {
            toValue: -this.props.pullHeight
          }),
          Animated.timing(this.state.initAnimationProgress, {
            toValue: 1,
            duration: 3000
          })
        ]).start( )
      } else if(this.state.refreshHeight._value <= 0) {
        Animated.spring(this.state.refreshHeight, {
          toValue: 0
        }).start();
      }

      if(this.state.scrollY._value > 0) {
        this.setState({isScrollFree: true});
      }
    }
  }

  onRepeatAnimation(){
    this.state.repeatAnimationProgress.setValue(0);

    Animated.timing(this.state.repeatAnimationProgress, {
      toValue: 1,
      duration: 200
    }).start( () => {
      if(this.props.isRefreshing){
        this.onRepeatAnimation();
      } else {
        this.onEndAnimation();
        this.state.repeatAnimationProgress.setValue(0);
      }
    })
  }

  onEndAnimation(){
    this.setState({isRefreshAnimationEnded: true});
    Animated.sequence([
      Animated.timing(this.state.finalAnimationProgress, {
        toValue: 1,
        duration: 1000
      }),
      Animated.spring(this.state.refreshHeight, {
        toValue: 0,
        bounciness: 12
      })
    ]).start(() => {
      this.state.finalAnimationProgress.setValue(0);
      this.setState({
        isRefreshAnimationEnded: false,
        isRefreshAnimationStarted: false
      })
    })
  }


  onScrollRelease() {
    if(!this.props.isRefreshing) {
      this.setState({isAnimatedEnded: true});
      this.props.onRefresh();
    }
  }

  isScrolledToTop() {
    if(this.state.scrollY._value === 0 && this.state.isScrollFree) {
      this.setState({isScrollFree: false});
    }
  }

  render() {
    let onScrollEvent = (event) => {
      this.state.scrollY.setValue(event.nativeEvent.contentOffset.y)
    };

    let animateHeight = this.state.refreshHeight.interpolate({
      inputRange: [-this.props.pullHeight, 0],
      outputRange: [this.props.pullHeight, 0]
    });

    let animateProgress = this.state.refreshHeight.interpolate({
      inputRange: [-this.props.pullHeight, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    const animationStyle = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: this.props.animationBackgroundColor,
      width: Dimensions.get('window').width,
      height: this.props.pullHeight + 50
    }

    return  (
      <View
        style={{flex:1, justifyContent: 'center', backgroundColor:this.props.animationBackgroundColor}}
        {...this._panResponder.panHandlers}
        >
          <Animation
            style={[animationStyle, {opacity: this.state.isAnimatedEnded? 0 : 1 }]}
            source={this.props.onPullAnimationSrc}
            progress={animateProgress}
          />
          <Animation
            style={[animationStyle,{ opacity: this.state.isAnimatedEnded ? 1 : 0 }]}
            source={this.props.onStartRefreshAnimationSrc}
            progress={this.state.initAnimationProgress}
          />

          <ScrollView ref='scrollComponentRef'
            scrollEnabled={this.state.isScrollFree}
            onScroll={onScrollEvent}
            onTouchEnd= {() => {this.isScrolledToTop()}}
            onScrollEndDrag= {() => {this.isScrolledToTop()}}
            >
              <Animated.View style={{marginTop: animateHeight}}>
                {React.cloneElement(this.props.contentView, {
                  scrollEnabled: false,
                  ref:'scrollComponentRef',
                })}
              </Animated.View>
            </ScrollView>
          </View>
        );
      }
    }

    module.exports = AnimatedPTR;
