import config from '../config'
import TokenService from './token-service'

const LanguageApiService = {

getLanguage () {
  return fetch(`${config.API_ENDPOINT}/language`, {
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${TokenService.getAuthToken()}`
    },
  })
  .then(res => {
    (!res.ok)
    ? res.json().then(e => Promise.reject(e))
    : res.json()
  })
},

 postGuess(guess) {
   return fetch(`${config.API_ENDPOINT}/language/guess`, {
     method: 'POST',
     headers: {
       'content-type':'application/json', 
       'authorization': `bearer ${TokenService.getAuthToken()}`
     },
     body: JSON.stringify({guess})
   })
   .then(res => {
     return(!res.ok)
     ? res.json().then(e=> Promise.reject(e)) : res.json()
   })
 },

 getHead() {
 return fetch(`${config.API_ENDPOINT}/language/head`, {
   method: 'GET',
   headers: {
     'authorization': `bearer ${TokenService.getAuthToken()}`
   },
 })
 .then(res => (
    !res.ok ? res.json().then(e=> Promise.reject(e)) : res.json()
 ))
 }

}

export default LanguageApiService