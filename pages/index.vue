<template>
  <v-container
    fluid
    class="pa-0 ma-0 container"
  >
    <Workspace />
    <Popup />
  </v-container>
</template>

<script>
import Workspace from '~/components/Workspace'
import Popup from '~/components/Popup'

export default {
  name: 'Main',
  components: {
    Workspace,
    Popup
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
