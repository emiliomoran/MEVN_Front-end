<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 x14>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="email"
            autofocus
            color="accent"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            color="accent"
            label="Password"
            required
          ></v-text-field>
          <v-flex class="red--text" v-if="errorMessage">
            {{ errorMessage }}
          </v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn @click="login" color="primary">Login</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      axios
        .post("user/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          //console.log(response);
          return response.data;
        })
        .then((data) => {
          this.$store.dispatch("saveToken", data.tokenReturn);
          this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.errorMessage = "User not found or invalid credentials!";
          } else {
            this.errorMessage = "Error in the server!";
          }
        });
    },
  },
};
</script>
