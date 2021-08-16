<template>
  <div>
    <v-text-field />
    <v-list>
      <v-list-item>
        {{ currrentFeature.id }}
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'MetadataPane',
  props: {
    feature: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      currentFeature: null
    }
  },
  watch: {
    feature (newFeature) {
      this.currentFeature = newFeature
    }
  }
}
</script>

<style scoped>

</style>
