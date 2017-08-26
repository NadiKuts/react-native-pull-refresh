### Custom Android Pull to Refresh

Inspired by the shots from the author: https://dribbble.com/yupnguyen

|     Coffee Concept    |  Coin Concept    | Weather Concept
| ------------------------- |:-----------------------:|:-----------------------:|
| ![Output sample](https://github.com/NadiKuts/react-native-pull-down/blob/master/examples/resources/coffee_animation.gif)|![Output sample](https://github.com/NadiKuts/react-native-pull-down/blob/master/examples/resources/coin_animation.gif) |![Output sample](https://github.com/NadiKuts/react-native-pull-down/blob/master/examples/resources/weather_animation.gif)|

### Demos

Install Expo App on your [Android smartphone](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www) or [iPhone](https://itunes.apple.com/app/apple-store/id982107779?ct=www&mt=8).

Scan this QR-code with your Expo App. 

![alt text](https://github.com/NadiKuts/react-native-animated-menu/blob/master/assets/qr-code.png)

... or go [here](https://expo.io/@devilsanek/animated-menu) and try it out!


### Example
The demo app from the GIF can be found at `examples/`.

#### Using npm:

```sh
$ npm install --save <name>
```

#### Using yarn:

```sh
$ yarn add <name>
```

### Usage

```jsx
import React, { Component } from 'react';

```

#### Props

| Prop | Type | Description |
|---|---|---|
|**`children`**|`ReactElement<any>`|React Element(s) to render.|
|**`flipDuration`**|`?number`|Length of flip animation in milliseconds. _Default 280._|
|**`renderBackface`**|`() => ReactElement<any>`|Callback that renders a backface.|
|**`renderFrontface`**|`() => ReactElement<any>`|Callback that renders a frontface.|
|**`renderLoading`**|`?() => ReactElement<any>`|Callback that renders a temporary view to display before base layout occurs. If not provided, `renderFrontface` is used instead.|



### Instructions

- [Install NodeJS](https://nodejs.org/en/)
- [Install and setup React Native](https://facebook.github.io/react-native/docs/getting-started.html)
- Clone repository: `git clone https://github.com/NadiKuts/react-native-pull-down.git`

- Navigate to the created folder: `cd react-native-pull-down`

- To run on either iPhone or Android check this page: https://github.com/react-community/create-react-native-app#creating-an-app
