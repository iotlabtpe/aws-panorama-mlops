export const CHANGE_LANGUE = "change_language"
export const changeLanguageActionCretor = (languageCode) => {
  return{
    type:CHANGE_LANGUE,
    payload: languageCode
  }
}


