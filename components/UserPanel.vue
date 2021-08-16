<template>
  <div class="userpanel">
    <p class="sub">Click on a user's icon to jump to their view</p>
    <v-list>
      <v-list-item v-for="user in compUsers" :key="user.id" style="margin-bottom: 5px;">
        <v-btn
          elevation="0"
          :color="user.color"
          small
          fab
          style="font-size: 20px;"
          @click="snapView(user)"
        >
          {{ user.username.charAt(0) || '?'}}
        </v-btn>
        <div class="content">
          <div class="username">{{ user.username }}</div>
          <div class="id">{{ user.socket_id }}</div>
        </div>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'UserPanel',
  props: {
    users: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      compUsers: this.users
    }
  },
  computed: {
  },
  watch: {
    users (newUsers) {
      this.compUsers = newUsers
    }
  },
  methods: {
    snapView (user) {
      this.$root.$emit('snapView', { center: user.center, zoom: user.zoom })
    }
  }
}
</script>

<style scoped>

.userpanel {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 3;
  height: 100%;
  width: 10%;
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
