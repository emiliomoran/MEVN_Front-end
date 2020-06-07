<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm6 md4 lg3>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" :lazy-validation="lazy">
            <v-text-field
              v-model="email"
              autofocus
              color="accent"
              label="Email"
              required
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              color="accent"
              label="Password"
              required
              :rules="passwordRules"
            ></v-text-field>
          </v-form>
          <v-flex class="red--text" v-if="errorMessage">{{ errorMessage }}</v-flex>
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
      valid: true,
      emailRules: [v => !!v || "Email is required"],
      passwordRules: [v => !!v || "Password is required"],
      lazy: false
    };
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        axios
          .post("user/login", {
            email: this.email,
            password: this.password
          })
          .then(response => {
            //console.log(response);
            return response.data;
          })
          .then(data => {
            this.$store.dispatch("saveToken", data.tokenReturn);
            this.$router.push({ name: "Home" });
          })
          .catch(error => {
            if (error.response.status === 404) {
              this.errorMessage = "User not found or invalid credentials!";
            } else {
              this.errorMessage = "Error in the server!";
            }
          });
      }
    }
  }
};
</script>
