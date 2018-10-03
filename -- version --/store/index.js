import Vuex from 'vuex'
import ResumeStore from './resume'

export default () => {
  return new Vuex.Store({
    modules: {
      resume: ResumeStore
    }
  })
}
