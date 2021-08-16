<template>
  <v-container
    fluid
    class="pa-0 ma-0 container"
  >
    <v-navigation-drawer
    permanent
    left
    class="sidebar"
    style="height: 100vh; width: 420px;"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h5">
            Vaccine Finder
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-text-field
          id="input"
          outlined
          placeholder="Enter your zip code"
          v-model="input"
        >
          Default Slot
        </v-text-field>
      </v-list-item>

      <v-list-item>
        <v-checkbox
          v-model="vac1"
          :label="'Moderna'"
        ></v-checkbox>
      </v-list-item>
      <v-list-item>
        <v-checkbox
          v-model="vac2"
          :label="'Pfizer'"
        ></v-checkbox>
      </v-list-item>
      <v-list-item>
        <v-checkbox
          v-model="vac3"
          :label="'Johnson & Johnson'"
        ></v-checkbox>
      </v-list-item>

      <v-list-item>
        <v-btn
          color="info"
          @click="sendMessage"
          style="width: 300px; margin: auto;"
          large
          fixed
          bottom
        >
            Search
        </v-btn>
      </v-list-item>

    </v-navigation-drawer>
    <Toolbar />

  </v-container>
</template>

<script>
import axios from 'axios'
// import io from 'socket.io-client'
import { transformExtent } from 'ol/proj'
// import Projection from 'ol/proj/Projection.js'
// import * as proj from 'ol/proj'

import Toolbar from '~/components/Toolbar.vue'

export default {
  name: 'Main',
  components: {
    Toolbar
  },
  data () {
    return {
      socket: null,
      user: '',
      message: '',
      extent: [],
      extents: [],
      providers: [],
      input: '',
      vac1: true,
      vac2: true,
      vac3: true
    }
  },
  computed: {},
  mounted () {
    this.socket = this.$nuxtSocket({
      channel: '/index'
    })

    this.socket.on('FEATURES', (msg, cb) => {
      this.setFeatures(msg)
    })
  },
  methods: {
    sendFeature () {
      this.socket.emit('SET_FEATURE', this.features)
    },
    async geocode (addr) {
      const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json'
      // address=1600+Amphitheatre+Parkway,+Mountain+View,+CA
      const params = {
        address: addr,
        key: 'AIzaSyAivHmJX7TylMJJTMmd0nvnT059SVEepu4'
      }

      try {
        const response = await axios.get(baseUrl, { params })

        return [response.data.results[0].geometry.location.lng, response.data.results[0].geometry.location.lat]
      } catch (e) {
        console.log(e)
      }
    },
    async handleSearch () {
      this.providers = []
      const zip = this.input || '10001'
      const coords = await this.geocode(zip)
      console.log(coords)

      const baseUrl = 'https://api.us.castlighthealth.com/vaccine-finder/v1/provider-locations/search?'
      const params = {
        medicationGuids: this.getVaccines(),
        lat: coords[0],
        long: coords[1],
        radius: 25
      }

      try {
        this.updateMap(coords)

        axios
          .get(baseUrl, { params })
          .then(response => this.setProviders(response.data.providers))
      } catch (e) {
        console.log(e)
      }
    },
    setProviders (providers) {
      this.providers = providers.map(loc => ({
        type: 'Feature',
        id: loc.guid,
        geometry: {
          type: 'Point',
          coordinates: [loc.lat, loc.long]
        },
        properties: {
          name: loc.name,
          country: 'United States',
          city: loc.city,
          street: loc.address1,
          inStock: loc.in_stock
        }
      }))
      console.log(providers)
    },
    getVaccines () {
      const vaccines = []
      if (this.vac1) { vaccines.push('779bfe52-0dd8-4023-a183-457eb100fccc') }
      if (this.vac2) { vaccines.push('a84fb9ed-deb4-461c-b785-e17c782ef88b') }
      if (this.vac3) { vaccines.push('784db609-dc1f-45a5-bad6-8db02e79d44f') }
      console.log(vaccines.join())
      return vaccines.join()
    },
    updateMap (coords) {
      this.center = coords
      this.zoom = 13
    },
    inStock (feature, res) {
      return feature.values_.inStock
    },
    drawEnd () {
      this.sendFeature(this.features)
    },
    updateExtent () {
      // /** @var {ol/View} olView */
      const olView = this.$refs.view.$view
      if (olView == null) { return }

      this.extent = transformExtent(olView.calculateExtent(), 'EPSG:3857', 'EPSG:4326')
      this.sendMessage()
    },
    getCoords (box) {
      box.forEach((e) => {
        if (e > 180) { e = 180 }
        if (e < -180) { e = -180 }
      })
      return [
        [box[0], box[1]],
        [box[2], box[1]],
        [box[2], box[3]],
        [box[0], box[3]]
      ]
    },
    setFeatures (data) {
      this.features = []
      data.forEach((client) => {
        if (client.features) {
          client.features.forEach((feature) => {
            this.features.push(feature)
          })
        }
      })
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

.sidebar {
  width: 500px;
}

.map {
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
}
</style>
