<template>
  <vl-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    dataProjection="EPSG:4326"
    class="map"
    ref="map"
  >
    <vl-view ref="view" :min-zoom="3" :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

    <vl-layer-tile id="osm">
      <vl-source-osm></vl-source-osm>
    </vl-layer-tile>

    <vl-layer-vector>
      <vl-source-vector :features.sync="mapFeatures" ident="source" projection="EPSG:4326"></vl-source-vector>
      <vl-style-func :factory="styleFactory" />
    </vl-layer-vector>

    <vl-layer-vector>
      <vl-source-vector :features.sync="mapViews"></vl-source-vector>
      <vl-style-func :factory="styleFactory" />
    </vl-layer-vector>

    <vl-interaction-select
      source="source"
      @select="selectFeature"
    />

    <vl-interaction-draw v-if="drawMode" @drawend="drawEnd" @drawstart="drawStart" :type="drawType" source="source">
      <vl-style-func :factory="styleFactory" />
    </vl-interaction-draw>

    <vl-interaction-modify
      v-if="!drawMode"
      source="source"
      @modifyend="modifyEnd"
    />

    <vl-interaction-snap
      v-if="drawMode"
      source="source"
      :priority="10"/>
  </vl-map>
</template>

<script>
import { transformExtent } from 'ol/proj'
import { createStyle } from 'vuelayers/lib/ol-ext'

export default {
  name: 'Map',
  props: {
    views: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      zoom: 3,
      center: [0, 0],
      rotation: 0,
      extent: [],
      features: [],
      mapViews: this.views
    }
  },
  computed: {
    mapFeatures: {
      get () {
        return this.$store.getters['map/mapFeatures']
      },
      set (features) {
        this.$store.commit('map/setMapFeatures', features)
      }
    },
    drawMode () {
      return this.$store.state.drawMode
    },
    drawType () {
      return this.$store.state.drawType
    }
  },
  watch: {
    views (newViews) {
      this.mapViews = newViews
    },
    center () {
      (this.zoom >= 3.5) ? this.updateExtent() : this.delExtent()
    },
    zoom () {
      (this.zoom >= 3.5) ? this.updateExtent() : this.delExtent()
    }
  },
  mounted () {
    this.$root.$on('snapView', (data) => {
      this.snapView(data)
    })

    this.$root.$on('loadFeature', (feature) => {
      this.loadFeature(feature)
    })
  },
  methods: {
    snapView (data) {
      this.center = data.center
      this.zoom = data.zoom
    },
    styleFactory () {
      return (feature) => {
        return createStyle({
          fillColor: 'rgba(255,255,255,0.5)',
          strokeColor: feature.get('color')
        })
      }
    },
    drawStart (e) {
      e.feature.set('color', this.$store.getters.drawColor)
      e.feature.set('userId', this.$store.getters.userId)
    },
    drawEnd (e) {
      this.saveFeature(e.feature.id_)
      this.$emit('featureLayerChange', this.$store.getters['map/mapFeatures'])
    },
    modifyEnd (e) {
      this.$emit('featureLayerChange', this.$store.getters['map/mapFeatures'])
      const features = e.features.getArray()
      features.forEach((feature) => {
        const mapFeature = this.$store.getters['map/mapFeatures'].find(f => f.id === feature.id_)
        const rev = feature.getRevision()
        // was getting a wierd double put req with one undefined id
        if (mapFeature && rev > mapFeature.properties.revision) {
          console.log(mapFeature)
          this.$store.commit('map/updateFeatureRev', { featureId: mapFeature.id, rev })
          this.updateFeature(mapFeature)
        }
      })
    },
    selectFeature (e) {
      this.$emit('featureSeleced', e.id_)
    },
    updateExtent () {
      const olView = this.$refs.view.$view
      if (olView == null) { return }

      this.extent = transformExtent(olView.calculateExtent(), 'EPSG:3857', 'EPSG:4326')

      this.$emit('moveEnd', {
        extent: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [this.getCoords(this.extent)]
          },
          properties: {
            color: this.color
          }
        },
        center: this.center,
        zoom: this.zoom
      })
    },
    delExtent () {
      this.$emit('moveEnd', null)
    },
    getCoords (box) {
      return [
        [box[0], box[1]],
        [box[2], box[1]],
        [box[2], box[3]],
        [box[0], box[3]],
        [box[0], box[1]]
      ]
    },
    saveFeature (id) {
      this.$store.dispatch('map/saveFeature', id)
      this.$root.$emit('featureLayerChange', this.$store.getters['map/mapFeatures'])
    },
    loadFeature (feature) {
      this.$store.dispatch('map/loadFeature', feature)
      this.$root.$emit('featureLayerChange', this.$store.getters['map/mapFeatures'])
    },
    updateFeature (feature) {
      this.$store.dispatch('map/updateFeature', feature)
      this.$root.$emit('featureLayerChange', this.$store.getters['map/mapFeatures'])
    }
  }
}
</script>

<style scoped>
.map {
  height: 100%;
  width: 90%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
</style>
