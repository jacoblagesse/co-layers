<template>
<v-dialog
  v-model="errorMsg"
  persistent
  width="650"
>
  <v-card>
    <v-card-title class="text-h5 lighten-2 error">
      {{ errorMsg }}
    </v-card-title>

    <v-card-actions>
      <v-btn
        color="primary"
        text
        @click="resetDbError"
        style="margin: auto; text-align: center;"
      >
        Ok
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'ErrorPoup',
  data () {
    return {
    }
  },
  computed: {
    errorMsg: {
      get () {
        return this.$store.getters['map/dbError']
      },
      set () {}
    }
  },
  methods: {
    resetDbError () {
      this.$store.commit('map/setDbError', '')
    }
  }
}
</script>

<style scoped>
  .error {
    text-align: center;
  }
</style>
