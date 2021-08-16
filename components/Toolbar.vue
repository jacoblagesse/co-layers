<template>
  <v-toolbar
    flat
    color="transparent"
    class="toolbar"
  >
    <div class="draw">
      <v-btn icon class="button" @click="toggleDraw" :class="{ selected: drawMode }">
        <v-icon color="black">mdi-pencil</v-icon>
      </v-btn>
      <div class="toolbar-group" :class="{ active: drawMode }">
        <v-btn icon class="button" @click="setDrawType('Point')" :class="{ selected: drawType === 'Point' }">
          <v-icon color="green">mdi-circle-small</v-icon>
        </v-btn>
        <v-btn icon class="button" @click="setDrawType('LineString')" :class="{ selected: drawType === 'LineString' }">
          <v-icon color="yellow">mdi-chart-timeline-variant</v-icon>
        </v-btn>
        <v-btn icon class="button" @click="setDrawType('Polygon')" :class="{ selected: drawType === 'Polygon' }">
          <v-icon color="red">mdi-pentagon-outline</v-icon>
        </v-btn>
        <v-btn icon class="button" @click="setDrawType('Circle')" :class="{ selected: drawType === 'Circle' }">
          <v-icon color="blue">mdi-circle-outline</v-icon>
        </v-btn>
      </div>
    </div>
    <v-btn icon class="button">
      <v-icon color="black">mdi-content-save</v-icon>
    </v-btn>
    <v-btn icon class="button">
      <v-icon color="black">mdi-account-group</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: 'Toolbar',
  computed: {
    drawMode () {
      return this.$store.state.drawMode
    },
    drawType () {
      return this.$store.state.drawType
    }
  },
  methods: {
    toggleDraw () {
      this.$store.commit('toggleDrawMode')
    },
    setDrawType (type) {
      this.$store.commit('setDrawType', type)
    }
  }
}
</script>

<style scoped>
  .toolbar {
    position: absolute;
    top: 10px;
    right: 11%;
    z-index: 2;
  }

  .button {
    background-color: white;
    width: 50px;
    height: 50px;
    border-radius: 10px;
    margin: 10px;
  }

  .toolbar-group {
    position: absolute;
    top: 60px;
    visibility: hidden;
  }

  .toolbar-group > * {
    display: block;
  }

  .active {
    visibility: visible;
  }

  .selected {
    background-color: #dcdcdc
  }
</style>
