import {CHANGE_LANGUE} from '../actions/lang'
import i18n from '../i18n/i18n'

const initialState = {
  language:"en",
  languageList:[
    {name:"English ",code:'en'},
    {name:"简体中文 ",code:'zh'},
    {name:"繁體中文 ",code:'zh-tw'},
  ]
}

const lang = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LANGUE:
      i18n.changeLanguage(action.data)
     return {
        ...state,
        language:action.data
      }
    default:
      // console.log('default!!')
      return state
  }
}

export default lang
