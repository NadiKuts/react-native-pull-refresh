import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Animated, PanResponder, UIManager, Dimensions } from 'react-native';

import Animation from 'lottie-react-native';

const AnimatedPullToRefresh = ({
	isRefreshing,
	onRefresh,
	pullHeight = 180,
	animationBackgroundColor = 'white',
	onPullAnimationSrc,
	onStartRefreshAnimationSrc,
	onRefreshAnimationSrc,
	onEndRefreshAnimationSrc,
	children,
}) => {
	const [_state, _setState] = useState({
		currentY: 0,
		isScrollFree: false,
		isRefreshAnimationStarted: false,
		isRefreshAnimationEnded: false,
	});
	const [_animationCount, _setAnimationCount] = useState(0);
	const scrollY = useRef(new Animated.Value(0)).current;
	const refreshHeight = useRef(new Animated.Value(0)).current;
	const initAnimationProgress = useRef(new Animated.Value(0)).current;
	const repeatAnimationProgress = useRef(new Animated.Value(0)).current;
	const finalAnimationProgress = useRef(new Animated.Value(0)).current;

	const scrollComponentRef = useRef(null);
	const _panResponder = useRef(null);

	useEffect(() => {
		_panResponder.current = PanResponder.create({
			onStartShouldSetPanResponder: _handleStartShouldSetPanResponder,
			onMoveShouldSetPanResponder: _handleMoveShouldSetPanResponder,
			onPanResponderMove: _handlePanResponderMove,
			onPanResponderRelease: _handlePanResponderEnd,
			onPanResponderTerminate: _handlePanResponderEnd,
		});
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}, []);

	const _handleStartShouldSetPanResponder = (e, gestureState) => {
		return !_state.isScrollFree;
	};

	const _handleMoveShouldSetPanResponder = (e, gestureState) => {
		return !_state.isScrollFree;
	};

	//if the content scroll value is at 0, we allow for a pull to refresh
	const _handlePanResponderMove = (e, gestureState) => {
		if (!isRefreshing) {
			if ((gestureState.dy >= 0 && scrollY?._value === 0) || refreshHeight?._value > 0) {
				refreshHeight?.setValue(-1 * gestureState.dy * 0.5);
			} else {
				// Native android scrolling
				scrollComponentRef?.current?.scrollTo({
					y: -1 * gestureState.dy,
					animated: true,
				});
			}
		}
	};

	const _handlePanResponderEnd = (e, gestureState) => {
		if (!isRefreshing) {
			if (refreshHeight?._value <= -pullHeight) {
				onScrollRelease();
				Animated.parallel([
					Animated.spring(refreshHeight, {
						toValue: -pullHeight,
						useNativeDriver: false,
					}),
					Animated.timing(initAnimationProgress, {
						useNativeDriver: false,
						toValue: 1,
						duration: 1000,
					}),
				]).start(() => {
					initAnimationProgress?.setValue(0);
					_setState({
						..._state,
						isRefreshAnimationStarted: true,
						isRefreshAnimationEnded: false,
					});
					onRepeatAnimation();
				});
			} else if (refreshHeight?._value <= 0) {
				Animated.spring(refreshHeight, {
					toValue: 0,
					useNativeDriver: false,
				}).start();
			}

			if (scrollY?._value > 0) {
				_setState({ ..._state, isScrollFree: true });
			}
		}
	};
	useEffect(() => {
		if (!_state.isRefreshAnimationStarted && isRefreshing) {
			refreshHeight.setValue(-pullHeight);
			repeatAnimationProgress?.setValue(1);
			_setState({
				..._state,
				isRefreshAnimationStarted: true,
				isRefreshAnimationEnded: false,
			});
			onRepeatAnimation();
		}
	}, [_state.isRefreshAnimationStarted, isRefreshing]);
	useEffect(() => onRepeatAnimation(), [_animationCount]);

	const onRepeatAnimation = () => {
		repeatAnimationProgress?.setValue(0);
		Animated.timing(repeatAnimationProgress, {
			useNativeDriver: false,
			toValue: 1,
			duration: 1000,
		}).start(() => {
			if (isRefreshing) {
				_setAnimationCount((cc) => cc + 1);
			} else {
				repeatAnimationProgress?.setValue(0);
				onEndAnimation();
			}
		});
	};

	const onEndAnimation = () => {
		_setState({ ..._state, isRefreshAnimationEnded: true });
		Animated.sequence([
			Animated.timing(finalAnimationProgress, {
				useNativeDriver: false,
				toValue: 1,
				duration: 1000,
			}),
			Animated.spring(refreshHeight, {
				useNativeDriver: false,
				toValue: 0,
				bounciness: 12,
			}),
		]).start(() => {
			finalAnimationProgress?.setValue(0);
			_setState({
				..._state,
				isRefreshAnimationEnded: false,
				isRefreshAnimationStarted: false,
			});
		});
	};

	const onScrollRelease = () => {
		if (!isRefreshing) {
			onRefresh();
		}
	};

	const isScrolledToTop = () => {
		if (scrollY?._value === 0 && _state.isScrollFree) {
			_setState({ ..._state, isScrollFree: false });
		}
	};
	let onScrollEvent = (event) => {
		scrollY?.setValue(event.nativeEvent.contentOffset.y);
	};

	let animateHeight = refreshHeight?.interpolate({
		inputRange: [-pullHeight, 0],
		outputRange: [pullHeight, 0],
	});

	let animateProgress = refreshHeight?.interpolate({
		inputRange: [-pullHeight, 0],
		outputRange: [1, 0],
		extrapolate: 'clamp',
	});

	const animationStyle = {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		backgroundColor: animationBackgroundColor,
		width: Dimensions.get('window').width,
		height: pullHeight,
	};

	return (
		<View style={{ backgroundColor: animationBackgroundColor }} {..._panResponder?.current?.panHandlers}>
			<Animation style={[animationStyle, { opacity: isRefreshing ? 0 : 1 }]} source={onPullAnimationSrc} progress={animateProgress} />
			<Animation
				style={[
					animationStyle,
					{
						opacity: isRefreshing && !_state.isRefreshAnimationStarted ? 1 : 0,
					},
				]}
				source={onStartRefreshAnimationSrc}
				progress={initAnimationProgress}
			/>
			<Animation
				style={[
					animationStyle,
					{
						opacity: _state.isRefreshAnimationStarted && !_state.isRefreshAnimationEnded ? 1 : 0,
					},
				]}
				source={onRefreshAnimationSrc}
				progress={repeatAnimationProgress}
			/>
			<Animation style={[animationStyle, { opacity: _state.isRefreshAnimationEnded ? 1 : 0 }]} source={onEndRefreshAnimationSrc} progress={finalAnimationProgress} />

			<ScrollView
				keyboardShouldPersistTaps="handled"
				ref={scrollComponentRef}
				scrollEnabled={_state.isScrollFree}
				onScroll={onScrollEvent}
				onTouchEnd={() => {
					isScrolledToTop();
				}}
				onScrollEndDrag={() => {
					isScrolledToTop();
				}}>
				<Animated.View style={{ marginTop: animateHeight }}>
					{React.cloneElement(children, {
						scrollEnabled: false,
						ref: scrollComponentRef,
					})}
				</Animated.View>
			</ScrollView>
		</View>
	);
};

export default AnimatedPullToRefresh;
