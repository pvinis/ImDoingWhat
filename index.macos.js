/**
 * Sample React Native macOS App
 * https://github.com/ptmt/react-native-macos
 */
 import React from 'react';
 import ReactNative from 'react-native-macos';
 const {
   AppRegistry,
   AsyncStorage,
   Button,
   NativeEventEmitter,
   StyleSheet,
   Text,
   TextInput,
   View,
 } = ReactNative

import moment from 'moment'

import TimerManager from './TimerManager'

const STORAGE_TASKS = '@ImDoingWhat:tasks'

class ImDoingWhat extends React.Component {

  constructor(props) {
    super(props)

    this.timerSubscription = null

    this.state = {
      task: "",
      startTime: null,
      secondsPassed: 0,
      dbg: "start",
      started: false,
      paused: false,
      listShown: false,
      tasks: [],
    }
  }

  componentDidMount() {
    const TimerManagerEventEmitter = new NativeEventEmitter(TimerManager)
    this.timerSubscription = TimerManagerEventEmitter.addListener('tick', this._increaseSecondsPassed)
    TimerManager.start(1000)

    this._loadFromStorage().done()
  }

  componentWillUnmount() {
    TimerManager.stop()
    this.timerSubscription.remove()
  }

  _loadFromStorage = async () => {
    this.setState({dbg: "loading"})
    try {
     const task = await AsyncStorage.getItem(STORAGE_TASK)
      if (task) {
        this.setState({
          task,
        })
        this.setState({dbg: "did load"})
      }
    } catch (error) {
      this.setState({dbg: "didnt load"})
    }
  }

  _saveToStorage = async (task) => {
    this.setState({dbg: "saving"})
    try {
      await AsyncStorage.setItem(STORAGE_TASK, task)
      this.setState({dbg: "did save"})
    } catch (error) {
      this.setState({dbg: "didnt save"})
    }
  }

  _startTimer() {
    const { tasks, task } = this.state
    const newTasks = [...tasks, task]
    this.setState({
      started: true,
      tasks: newTasks,
    })
  }

  _pauseTimer() {
    if (!this.state.started) return

    this.setState({
      paused: !this.state.paused,
    })
  }

  _stopTimer() {
    this.setState({
      started: false,
      secondsPassed: 0,
    })
  }

  _increaseSecondsPassed = () => {
    if (!this.state.started) return
    if (this.state.paused) return

    const { secondsPassed } = this.state

    this.setState({
      secondsPassed: secondsPassed + 1,
    })
  }

  _setTask(text) {
    this.setState({
      task: text,
    })
  }

  _timeFormat() {
    const { secondsPassed } = this.state

    const timeFormat = moment.unix(secondsPassed).utc().format('HH:mm:ss').replace(/^00:/, '')
    return timeFormat
  }

  _toggleList() {
    this.setState({
      listShown: !this.state.listShown,
    })
  }

  renderTaskList() {
    if (!this.state.listShown) return null

    return (
      this.state.tasks.map((task) => {
        return (
          <Text
            style={{color: Colors.Foreground, textAlign: 'center'}}
            key={task}>
            {task}
          </Text>
        )
      })
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          onChange={(event) => this._setTask(event.nativeEvent.text) }
          style={styles.task}
        />
        <Text style={styles.timer}>
          {this._timeFormat()}
        </Text>
        <Button style={styles.button} title='start'
          onClick={() => this._startTimer()}
        />
        <Button style={styles.button} title={this.state.paused ? 'resume' : 'pause'}
          onClick={() => this._pauseTimer()}
        />
        <Button style={styles.button} title='stop'
          onClick={() => this._stopTimer()}
        />
        <View>
          <Button style={styles.button} title={this.state.listShown ? 'hide list' : 'show list'}
            onClick={() => this._toggleList()}
          />
          {this.renderTaskList()}
        </View>
      </View>
    )
  }
}

const Colors = {
  Background: '#2d2d2d',
  LightBackground: '#393939',
  Foreground:  '#f2f0ec',
  Blue:       '#6699cc',
  Red:        '#f2777a',
  Orange:        '#ffcc66',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.Background,
    borderWidth: 2,
    borderColor: Colors.Red,
  },

  task: {
    flex: 1,
    fontSize: 30,
    textAlign: 'center',
    height: 44,
    margin: 10,
    marginLeft: 70,
    alignSelf: 'center',
    backgroundColor: Colors.LightBackground,
    color: Colors.Foreground,
  },

  timer: {
    width: 70,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: Colors.Blue,
  },

  button: {
    width: 80,
  }
});

AppRegistry.registerComponent('ImDoingWhat', () => ImDoingWhat);
