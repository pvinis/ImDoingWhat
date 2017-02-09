/**
 * Sample React Native macOS App
 * https://github.com/ptmt/react-native-macos
 */
 import React from 'react';
 import ReactNative from 'react-native-macos';
 const {
   AppRegistry,
   Button,
   NativeEventEmitter,
   StyleSheet,
   Text,
   TextInput,
   View,
 } = ReactNative

import moment from 'moment'

import TimerManager from './TimerManager'

class ImDoingWhat extends React.Component {

  constructor(props) {
    super(props)

    this.timerSubscription = null

    this.state = {
      task: "",
      startTime: null,
      currTime: null,
    }
  }

  _startTimer() {
    const TimerManagerEventEmitter = new NativeEventEmitter(TimerManager)
    if (this.timerSubscription) {
      this.timerSubscription.remove()
    }
    this.timerSubscription = TimerManagerEventEmitter.addListener('tick', this._increaseSecondsPassed)
    TimerManager.start(1000)
  }

  _stopTimer() {
    TimerManager.stop()
    this.timerSubscription.remove()
  }

  _increaseSecondsPassed = () => {
    this.setState({
      currTime: +new Date(),
    })
  }

  _setTask(text) {
    this.setState({
      task: text,
      startTime: +new Date(),
    })
    this._startTimer()
  }

  _timeSinceStart() {
    const { startTime, currTime } = this.state
    const zero = "00:00"

    if (startTime === null || currTime === null) return zero

    const diffSec = (currTime - startTime) / 1000
    if (diffSec < 0) return zero

    const timeSinceStart = moment.unix(diffSec).utc().format('HH:mm:ss').replace(/^00:/, '')
    return timeSinceStart
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.task}
          onChange={(text) => this._setTask(text) }
        />
        <Text style={styles.timer}>
          {this._timeSinceStart()}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F5FCFF',
  },
  task: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginLeft: 70,
    alignSelf: 'center',
  },
  timer: {
    width: 70,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('ImDoingWhat', () => ImDoingWhat);
