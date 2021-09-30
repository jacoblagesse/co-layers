import axios from 'axios'

const baseUrl = 'http://localhost:8080/api'

export const state = () => ({
  userId: null,
  username: null,
  authError: null,
  drawColor: 'black',
  drawMode: false,
  drawType: 'Point'
})

export const getters = {
  userId: (state) => {
    return state.userId
  },
  drawColor: (state) => {
    return state.drawColor
  }
}

export const mutations = {
  toggleDrawMode (state) {
    state.drawMode = !state.drawMode
  },
  setDrawType (state, type) {
    state.drawType = type
  },
  setAuthError (state, msg) {
    state.authError = msg
  },
  setUserData (state, data) {
    state.userId = data.id
    state.username = data.username
    state.drawColor = data.color
  }
}

export const actions = {
  async login ({ commit }, params) {
    await axios.post(`${baseUrl}/login`, params)
      .then((res) => {
        commit('setUserData', { id: res.data.id, username: res.data.username, color: res.data.drawColor })
        commit('setAuthError', null)
      })
      .catch(err => commit('setAuthError', err.response.data.message))
  },
  async signup ({ commit }, params) {
    await axios.post(`${baseUrl}/signup`, params)
      .then((res) => {
        commit('setUserData', { id: res.data.id, username: res.data.username, color: res.data.drawColor })
        commit('setAuthError', null)
      })
      .catch(err => commit('setAuthError', err.response.data.message))
  }
}
