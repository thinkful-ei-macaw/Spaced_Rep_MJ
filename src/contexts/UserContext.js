import React, { Component } from 'react'
import AuthApiService from '../services/auth-api-service'
import TokenService from '../services/token-service'
import IdleService from '../services/idle-service'

const UserContext = React.createContext({
  user: {},
  error: null,
  language: null, 
  words: null, 
  nextWord: {},
  totalScore: null, 
  currentWord: {},
  guess: false,

  clearError: () => {},
  setUser: () => {},
  setWords: () => {},
  setLanguage: () => {},
  setGuess: () => {},
  setError: () => {},
  setCurrentWord: () => {},
  setNextWord: () => {},
  processLogin:() => {},
  processLogout: () => {},
  setTotalScore: () => {}
})

export default UserContext

export class UserProvider extends Component {
  constructor(props) {
    super(props)
    const state = { user: {}, error: null }

    const jwtPayload = TokenService.parseAuthToken()

    if (jwtPayload)
      state.user = {
        id: jwtPayload.user_id,
        name: jwtPayload.name,
        username: jwtPayload.sub,
      }

    this.state = state;
    IdleService.setIdleCallback(this.logoutBecauseIdle)
  }

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      IdleService.regiserIdleTimerResets()
      TokenService.queueCallbackBeforeExpiry(() => {
        this.fetchRefreshToken()
      })
    }
  }

  componentWillUnmount() {
    IdleService.unRegisterIdleResets()
    TokenService.clearCallbackBeforeExpiry()
  }

 setGuess = guess => {
    this.setState({guess})
  }

 setNextWord = nextWord => {
    this.setState({nextWord})
  }

  setCurrentWord = currentWord => {
    this.setState({currentWord})
  }
  setTotalScore = totalScore => {
    this.setState({totalScore})
  }
  setError = error => {
    console.error(error)
    this.setState({ error })
  }

  clearError = () => {
    this.setState({ error: null })
  }

  setLanguage = (language) => {
    this.setState({language})
  }

  setUser = user => {
    this.setState({ user })
  }

  setWords = (words) => {
    this.setState({words})
  }

  processLogin = authToken => {
    TokenService.saveAuthToken(authToken)
    const jwtPayload = TokenService.parseAuthToken()
    this.setUser({
      id: jwtPayload.user_id,
      name: jwtPayload.name,
      username: jwtPayload.sub,
    })
    IdleService.regiserIdleTimerResets()
    TokenService.queueCallbackBeforeExpiry(() => {
      this.fetchRefreshToken()
    })
  }

  processLogout = () => {
    TokenService.clearAuthToken()
    TokenService.clearCallbackBeforeExpiry()
    IdleService.unRegisterIdleResets()
    this.setUser({})
  }

  logoutBecauseIdle = () => {
    TokenService.clearAuthToken()
    TokenService.clearCallbackBeforeExpiry()
    IdleService.unRegisterIdleResets()
    this.setUser({ idle: true })
  }

  fetchRefreshToken = () => {
    AuthApiService.refreshToken()
      .then(res => {
        TokenService.saveAuthToken(res.authToken)
        TokenService.queueCallbackBeforeExpiry(() => {
          this.fetchRefreshToken()
        })
      })
      .catch(err => {
        this.setError(err)
      })
  }

  render() {
    const value = {
     language: this.state.language,
     error: this.state.error,
     user: this.state.user,
     nextWord: this.state.nextWord,
     setCurrentWord: this.state.setCurrentWord,
     words: this.state.words,
     totalScore: this.state.totalScore,
     guess: this.state.guess,
     setGuess: this.setGuess,
     setWords: this.setWords,
     setLanguage: this.setLanguage,
     setError: this.setError,
     clearError: this.clearError,
     setUser: this.setUser,
     setNextWord: this.setNextWord,
     processLogin: this.processLogin,
     processLogout: this.processLogout,
     setTotalScore: this.setTotalScore
    }
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}
