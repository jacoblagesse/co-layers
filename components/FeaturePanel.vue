<template>
  <div class="featurepanel">
    <p class="sub">Your saved features | <a @click="removeAll">Delete all</a></p>
    <v-list>
      <v-list-item v-for="feature in savedFeatures" :key="feature.properties.savedId" style="margin-bottom: 5px;">
        <v-btn
          elevation="0"
          color="black"
          small
          fab
          style="font-size: 20px;"
          @click="loadFeature(feature)"
        >
          <v-icon>{{ getIcon(feature) }}</v-icon>
        </v-btn>
        <div class="content">
          <div class="username"><a @click="remove(feature.properties.savedId)">x </a>{{ feature.geometry.type }}</div>
          <div class="id">{{ feature.properties.createdAt }}</div>
        </div>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'FeaturePanel',
  computed: {
    savedFeatures () {
      return this.$store.getters['map/savedFeatures']
    }
  },
  mounted () {
    this.$root.$on('loggedIn', () => {
      this.getFeatures()
    })

    this.$root.$on('updateSavedFeatures', () => {
      this.getFeatures()
    })
  },
  methods: {
    getFeatures () {
      this.$store.dispatch('map/getFeatures')
    },
    loadFeature (feature) {
      this.$root.$emit('loadFeature', feature)
    },
    getIcon (feature) {
      switch (feature.geometry.type) {
        case 'Point':
          return 'mdi-circle-small'
        case 'LineString':
          return 'mdi-chart-timeline-variant'
        case 'Polygon':
          return 'mdi-pentagon-outline'
        case 'Circle':
          return 'mdi-circle-outline'
        default:
          return 'mdi-circle-small'
      }
    },
    removeAll () {
      this.$store.dispatch('map/delAllFeatures')
    },
    remove (id) {
      this.$store.dispatch('map/delFeature', id)
    }
  }
}
</script>

<style scoped>

.featurepanel {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  height: 100%;
  width: 15%;
  background-color: #202020;
}

.content {
  display: block;
  margin-left: 10px;
}

.username {
  font-size: 18px;
}

.id {
  font-size: 10px;
  color: grey;
}

.sub {
  color: grey;
  font-size: 12px;
  text-align: center;
  margin: 10px;
}

</style>
