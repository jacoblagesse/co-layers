<template>
  <v-container
    fluid
    class="pa-0 ma-0 container"
  >
    <FeaturePanel />
    <Toolbar />
    <MetadataPane v-if="featureSelected" :feature="selectedFeature" />
    <Map
      :views="views"
      @moveEnd="sendView"
      @featureSelected="setSelectedFeature"
    />
    <UserPanel :users="clients" />
  </v-container>
</template>

<script>
import Map from '~/components/Map'
import Toolbar from '~/components/Toolbar'
import UserPanel from '~/components/UserPanel'
import FeaturePanel from '~/components/FeaturePanel'
import MetadataPane from '~/components/MetadataPane'

export default {
  name: 'Workspace',
  components: {
    Map,
    Toolbar,
    MetadataPane,
    UserPanel,
    FeaturePanel
  },
  data () {
    return {
      socket: null,
      clients: [],
      views: [],
      featureSelected: false,
      selectedFeature: null
    }
  },
  computed: {
    userId () {
      return this.$store.state.userId
    }
  },
  watch: {
    userId () {
      this.$root.$emit('loggedIn')
      this.setUserInfo({ username: this.$store.state.username, color: this.$store.state.drawColor })
    }
  },
  mounted () {
    this.socket = this.$nuxtSocket({
      channel: '/main'
    })

    this.socket.on('UPDATE_CLIENTS', (data) => {
      this.setClients(data)
    })

    this.socket.on('FEATURES', (data) => {
      this.setFeatures(data)
    })

    this.socket.on('VIEWS', (data) => {
      this.setViews(data)
    })

    this.$root.$on('closed', (data) => {
      this.setUserInfo(data)
    })

    this.$root.$on('featureLayerChange', (features) => {
      this.syncFeatures(features)
    })
  },
  methods: {
    syncFeatures (features) {
      console.log(features.filter(f => f.properties.userId === this.$store.getters.userId))
      this.socket.emit('SET_FEATURE', features.filter(f => f.properties.uerId === this.$store.getters.userId))
      console.log(features.filter(f => f.properties.userId === this.$store.getters.userId))
    },
    sendView (viewData) {
      this.socket.emit('SET_VIEW', viewData)
    },
    setClients (data) {
      this.clients = data
    },
    setFeatures (data) {
      // this.$store.commit('map/setMapFeatures', [])
      data.forEach((client) => {
        if (client.features) {
          client.features.forEach((feature) => {
            this.$store.dispatch('map/loadFeature', feature)
          })
        }
      })
      console.log(this.$store.getters['map/mapFeatures'])
    },
    setViews (data) {
      this.views = []
      data.forEach((client) => {
        if (client.view && this.socket.id !== client.socket_id) {
          client.view.color = client.color
          this.views.push(client.view)
        }
      })
      this.setClients(data)
    },
    setUserInfo (data) {
      this.socket.emit('SET_USER', data)
    },
    setSelectedFeature (id) {
      this.selectedFeature = this.$store.getters['map/features'].find(feature => feature.id === id)
      this.featureSelected = true
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  position: relative;
  height: 100vh;
}
</style>
