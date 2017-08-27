### Custom Android Pull to Refresh

Inspired by the shots from the author: https://dribbble.com/yupnguyen

|     Coffee Concept    |  Coin Concept    | Weather Concept
| ------------------------- |:-----------------------:|:-----------------------:|
| ![Output sample](https://github.com/NadiKuts/react-native-pull-down/blob/master/examples/SimpleAnimations/resources/coffee_animation.gif)|![Output sample](https://github.com/NadiKuts/react-native-pull-down/blob/master/examples/SimpleAnimations/resources/coin_animation.gif) |![Output sample](https://github.com/NadiKuts/react-native-pull-down/blob/master/examples/SimpleAnimations/resources/weather_animation.gif)|

### Description

Currently, react-native provides RefreshControl out of the box https://facebook.github.io/react-native/docs/refreshcontrol.html 
However, it is not 'yet' possible to override the animation that runs during refreshing phase. (RefreshControl uses standard circle android animation). 

This package aims to fill this gap and provide a 'relatively' easy way to add your own custom animation. 

### Example
The demo app with umbrella animation can be found at `examples/`.


### Installation

1. Install the package using either: 
```sh
$ npm install --save react-native-pull-refresh
# or
$ yarn add react-native-pull-refresh
```

2. Install and link Lottie package (required for actual animation objects):
```sh
yarn add lottie-react-native
# or
npm i --save lottie-react-native

react-native link lottie-react-native
```

### Usage

This code is taken from examples/weatherAnimation sample

You can find `< Header />` and `< ScrollItem />` components in the sample folder

```jsx
import PullToRefresh from 'react-native-pull-refresh';

export default class weatherAnimation extends Component {
  constructor( ) {
    super( );
    this.state = {
      isRefreshing: false,
    };
  }

  onRefresh() {
    this.setState({isRefreshing: true});
    
    // Simulate fetching data from the server
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 5000);
  }

  render() {
    return (
      <View style={{flex:1}}>
        <Header/>
        <View style={{flex: 7, backgroundColor: '#F8F4FC'}}>
          <PullToRefresh
            isRefreshing= {this.state.isRefreshing}
            onRefresh= {this.onRefresh.bind(this)}
            animationBackgroundColor = {'#564A63'}
            pullHeight = {180}
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
            
            onPullAnimationSrc ={require('./umbrella_pull.json')}
            onStartRefreshAnimationSrc ={require('./umbrella_start.json')}
            onRefreshAnimationSrc = {require('./umbrella_repeat.json')}
            onEndRefreshAnimationSrc = {require('./umbrella_end.json')}
          />
        </View>
      </View>
    );
  }
}
```

### Animation Files Format
Lottie JSON - https://github.com/airbnb/lottie-react-native

Lottie is a mobile library, developed by AirBnB for Android and iOS that parses Adobe After Effects animations exported as JSON with bodymovin and renders them natively on mobile.

Lottie allows to easily use animations in react-native apps. You just need to create an animation in Adobe After Effects and export it with bodymovin addon to AE https://github.com/bodymovin/bodymovin.

You can find file examples in `examples/SimpleAnimations/animations` folder

#### General Props

| Prop | Type | Description |
|---|---|---|
|**`isRefreshing`**|`Boolean`|Refresh state set by parent to trigger refresh.|
|**`pullHeight`**|`Integer`|Pull Distance _Default 180._|
|**`onRefresh`**|`Function`|Callback after refresh event|
|**`contentView`**|`Object`|The content: ScrollView or ListView|
|**`animationBackgroundColor`**|`string`|Background color|
|**`onScroll`**|`Function`|Custom onScroll event|

#### Animation Source Files Props

| Prop | Description |
|---|---|---|
|**`onPullAnimationSrc`**|Animation that runs when scroll view is pulled down|
|**`onStartRefreshAnimationSrc`**|Animation that runs after view was pulled and released|
|**`onRefreshAnimationSrc`**|Animation that runs continuously until isRefreshing props is not changed|
|**`onEndRefreshAnimationSrc`**|Animation that runs after isRefreshing props is changed|

### Demos

Install Expo App on your [Android smartphone](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www) or [iPhone](https://itunes.apple.com/app/apple-store/id982107779?ct=www&mt=8).

Scan this QR-code with your Expo App. 

![alt text](https://github.com/NadiKuts/react-native-animated-menu/blob/master/assets/qr-code.png)

... or go [here](https://expo.io/@devilsanek/animated-menu) and try it out!
