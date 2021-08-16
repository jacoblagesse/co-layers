import axios from 'axios'

const baseUrl = 'http://localhost:8080/api'

export const state = () => ({
  dbError: '',
  mapFeatures: [],
  savedFeatures: [],
  mapViews: []
})

export const getters = {
  mapFeatures: (state) => {
    return state.mapFeatures
  },
  savedFeatures: (state) => {
    return state.savedFeatures
  }
}

export const mutations = {
  setDbError (state, error) {
    state.dbError = error
  },
  setMapFeatures (state, features) {
    state.mapFeatures = features
  },
  addMapFeature (state, feature) {
    state.mapFeatures.push({
      type: 'Feature',
      geometry: {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates
      },
      properties: {
        color: feature.properties ? feature.properties.color : feature.color,
        savedId: feature.id,
        userId: feature.userId,
        revision: 0
      }
    })
  },
  setSavedFeatures (state, features) {
    state.savedFeatures = features
  },
  updateFeatureRev (state, data) {
    const feature = state.mapFeatures.find(feature => feature.id === data.featureId)
    feature.properties.revision = data.rev
  }
}

export const actions = {
  async getFeatures ({ commit, getters, rootGetters }) {
    const userId = rootGetters.userId

    await axios
      .get(`${baseUrl}/features/${userId}`)
      .then((res) => {
        commit('setSavedFeatures', res.data)
        // this.$root.$emit('featureLayerChange', getters.mapFeatures)
      })
      .catch(err => commit('setDbError', err.response.data.message))
  },
  async saveFeature ({ commit, dispatch, getters, rootGetters }, id) {
    const feature = getters.mapFeatures.find(feature => feature.id === id)

    const params = {
      userId: rootGetters.userId,
      type: feature.geometry.type,
      color: rootGetters.drawColor,
      geom: feature.geometry
    }

    await axios
      .post(`${baseUrl}/features`, params)
      .then((res) => {
        feature.properties.savedId = res.data.id
        dispatch('getFeatures')
      })
      .catch(err => commit('setDbError', err.response.data.message))
  },
  loadFeature ({ commit, getters }, feature) {
    if (!getters.mapFeatures.find(f => f.id === feature.id)) {
      commit('addMapFeature', feature)
    }
  },
  async updateFeature ({ commit, getters }, feature) {
    const params = {
      geom: feature.geometry
    }

    await axios
      .put(`${baseUrl}/features/${feature.properties.savedId}`, params)
      .then(() => {})
      .catch(err => commit('setDbError', err.response.data.message))
  },
  async delFeature ({ commit, dispatch }, id) {
    await axios
      .delete(`${baseUrl}/features/${id}`)
      .then(() => {
        dispatch('getFeatures')
      })
      .catch(err => commit('setDbError', err.response.data.message))
  },
  async delAllFeatures ({ commit, rootGetters }) {
    const userId = rootGetters.userId

    await axios
      .get(`${baseUrl}/features/purge/${userId}`)
      .then(() => commit('setSavedFeatures', []))
      .catch(err => commit('setDbError', err.response.data.message))
  }
}
