<template>
<v-dialog
  v-model="loggedIn"
  persistent
  width="500"
>
  <v-card>
    <v-card-title v-if="signup" class="text-h5 lighten-2">
      Sign Up
    </v-card-title>
    <v-card-title v-else class="text-h5 lighten-2">
      Sign In
    </v-card-title>

    <v-form>
      <p style="color: red;" v-if="this.$store.state.authError">{{ this.$store.state.authError }}</p>

      <v-text-field
        v-model="username"
        label="Username"
        outlined
        style="margin: 10px auto; width: 60%;"
      ></v-text-field>

      <v-text-field
        v-model="password"
        type="password"
        label="Password"
        outlined
        style="margin: 10px auto; width: 60%;"
      ></v-text-field>

      <v-text-field
        v-if="signup"
        v-model="confirmPassword"
        type="password"
        label="Confirm Password"
        outlined
        style="margin: 10px auto; width: 60%;"
      ></v-text-field>

      <p v-if="signup">Select a draw color</p>

      <v-color-picker
        v-if="signup"
        v-model="color"
        class="colors"
        hide-canvas
        hide-inputs
        hide-sliders
        mode="rgba"
        show-swatches
        swatches-max-height="140"
        style="margin: -10px auto;"
        :swatches="swatches"
      ></v-color-picker>

      <v-card-actions>
        <v-btn
          v-if="signup"
          color="primary"
          text
          @click="handleSignup"
          :disabled="!username || !password"
          style="margin: auto; text-align: center;"
        >
          Get started
        </v-btn>
        <v-btn
          v-else
          color="primary"
          text
          @click="handleLogin"
          :disabled="!username || !password"
          style="margin: auto; text-align: center;"
        >
          Get started
        </v-btn>

        <v-btn
          v-if="signup"
          color="primary"
          text
          @click="toggleSignup"
          style="margin: auto; text-align: center;"
        >
          Sign In Instead
        </v-btn>
        <v-btn
          v-else
          color="primary"
          text
          @click="toggleSignup"
          style="margin: auto; text-align: center;"
        >
          Sign Up Instead
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'Popup',
  data () {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      color: '',
      signup: false,
      swatches: [[
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7'
      ],
      [
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4'
      ],
      [
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39'
      ],
      [
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722'
      ]]
    }
  },
  computed: {
    loggedIn () {
      return !this.$store.state.userId
    }
  },
  methods: {
    handleLogin () {
      const params = {
        username: this.username,
        pass: this.password
      }

      this.$store.dispatch('login', params)
    },
    handleSignup () {
      const params = {
        username: this.username,
        pass: this.password,
        pass2: this.confirmPassword,
        color: this.color
      }

      if (this.pass === this.pass2) {
        this.$store.dispatch('signup', params)
      } else {
        this.$store.commit('setAuthError', 'Passwords don\'t match!')
      }
    },
    toggleSignup () {
      this.signup = !this.signup
    }
  }
}
</script>

<style scoped>
.colors {
  width: 300px;
}

p {
  color: grey;
  font-size: 12px;
  text-align: center;
}
</style>
