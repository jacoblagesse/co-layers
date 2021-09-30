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
  userMapFeatures: (state, getters, rootState, rootGetters) => {
    return state.mapFeatures.filter(feature => feature.properties.userId === rootGetters.userId)
  },
  savedFeatures: (state) => {
    return state.savedFeatures
  },
  dbError: (state) => {
    return state.dbError
  }
}

export const mutations = {
  setDbError (state, error) {
    state.dbError = error
  },
  setMapFeatures (state, features) {
    console.log(features)
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
        color: feature.properties.color,
        savedId: feature.properties.savedId,
        userId: feature.properties.userId,
        createdAt: feature.properties.createdAt,
        updatedAt: feature.properties.updatedAt,
        revision: 0
      }
    })
  },
  setSavedFeatures (state, features) {
    state.savedFeatures = features
  },
  setFeatureSavedProps (state, data) {
    console.log(data.id, state.mapFeatures)
    const feature = state.mapFeatures.find(feature => feature.id === data.id)
    console.log(feature, data)
    feature.properties.savedId = data.savedId
    feature.properties.createdAt = data.createdAt
    feature.properties.updatedAt = data.updatedAt
    feature.properties.revision = 0
  },
  updateFeatureRev (state, data) {
    const feature = state.mapFeatures.find(feature => feature.id === data.featureId)
    feature.properties.revision = data.rev
  },
  updateMapFeature (state, data) {
    const feature = state.mapFeatures.find(feature => feature.properties.savedId === data.featureId)
    feature.properties.updatedAt = data.updatedAt
    feature.geometry = data.geometry
  },
  updateFeatureCoords (state, data) {
    state.mapFeatures.forEach((feature) => {
      feature.geometry = data.find(f => f.id === feature.id).geometry
    })
  }
}

export const actions = {
  // API
  async getFeatures ({ commit, dispatch, getters, rootGetters }) {
    const userId = rootGetters.userId

    await axios
      .get(`${baseUrl}/features/${userId}`)
      .then((res) => {
        commit('setSavedFeatures', res.data.map(feature => ({
          type: 'Feature',
          geometry: feature.geometry,
          properties: {
            color: feature.color,
            userId: feature.userId,
            savedId: feature.id,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt
          }
        })))
        dispatch('syncFeatures')
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

    return await axios
      .post(`${baseUrl}/features`, params)
      .then((res) => {
        console.log('Saved feature', res)
        console.log('Updating saved feature props')
        commit('setFeatureSavedProps', { id: feature.id, savedId: res.data.id, createdAt: res.data.createdAt, updatedAt: res.data.updatedAt })
        dispatch('getFeatures')
        return res.data
      })
      .catch(err => err.response ? commit('setDbError', err.response.data.message) : console.log(err))
  },
  loadFeature ({ commit, getters }, feature) {
    const existingFeature = getters.mapFeatures.find(f => f.properties.savedId === feature.properties.savedId)
    if (!existingFeature) {
      commit('addMapFeature', feature)
    } else if (existingFeature.properties.updatedAt !== feature.properties.updatedAt) {
      console.log('upadting geom and ts')
      commit('updateMapFeature', {
        featureId: feature.properties.savedId,
        gemoetry: feature.geometry,
        updatedAt: feature.properties.updatedAt
      })
    }
  },
  async updateFeature ({ commit, getters }, feature) {
    console.log(feature)
    const params = {
      geom: feature.geometry,
      updatedAt: feature.properties.updatedAt
    }

    return await axios
      .put(`${baseUrl}/features/${feature.properties.savedId}`, params)
      .then((res) => {
        console.log(res.data)
        commit('updateMapFeature', {
          featureId: res.data.id,
          geometry: res.data.geometry,
          updatedAt: res.data.updatedAt
        })
        return res.data
      })
      .catch(err => err.response ? commit('setDbError', err.response.data.message) : console.log(err))
  },
  async delFeature ({ commit, dispatch }, id) {
    await axios
      .delete(`${baseUrl}/features/${id}`)
      .then(() => {
        dispatch('getFeatures')
      })
      .catch(err => err.response ? commit('setDbError', err.response.data.message) : console.log(err))
  },
  async delAllFeatures ({ commit, rootGetters }) {
    const userId = rootGetters.userId

    await axios
      .get(`${baseUrl}/features/purge/${userId}`)
      .then(() => {
        commit('setSavedFeatures', [])
        commit('setMapFeatures', [])
      })
      .catch(err => commit('setDbError', err.response.data.message))
  },

  // SOCKET

  syncFeatures ({ dispatch }) {
    console.log('dispatching to socket server')
    dispatch('$nuxtSocket/emit', {
      label: 'dflt/main',
      evt: 'SET_FEATURES',
      msg: getters.mapFeatures
    }, { root: true })
  }
  // loadClientFeatures ({}, data) {
  //   // this.$store.commit('map/setMapFeatures', [])
  //   data.forEach((activeClient) => {
  //     if (activeClient.features) {
  //       console.log
  //       activeClient.features.forEach((feature) => {
  //         console.log(feature)
  //         this.$store.dispatch('map/loadFeature', feature)
  //       })
  //     }
  //   })
  //   console.log(this.$store.getters['map/mapFeatures'])
  // }
}
