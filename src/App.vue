<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app v-if="logged">
      <v-list dense>
        <!--Home-->
        <template v-if="isAdmin || isGrocer || isSeller">
          <v-list-item :to="{ name: 'Home' }">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
        </template>
        <!--Warehouse-->
        <template v-if="isAdmin || isGrocer">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>Warehouse</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--Categories-->
            <v-list-item :to="{ name: 'Category' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Categories</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--Items-->
            <v-list-item :to="{ name: 'Item' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Items</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <!--Purchases-->
        <template v-if="isAdmin || isGrocer">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>Purchases</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--Incomes-->
            <v-list-item :to="{ name: 'Income' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Incomes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--Providers-->
            <v-list-item :to="{ name: 'Provider' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Providers</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <!--Sells-->
        <template v-if="isAdmin || isSeller">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>Sales</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--Sells-->
            <v-list-item :to="{ name: 'Sale' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Sales</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--Customers-->
            <v-list-item :to="{ name: 'Customer' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Customers</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <!--Access-->
        <template v-if="isAdmin">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>Access</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!--User-->
            <v-list-item :to="{ name: 'User' }">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Users</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="logged"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">System</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout()" icon v-if="logged">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <v-footer padless class="font-weight-medium" color="primary">
      <v-col class="text-center white--text" cols="12">{{ new Date().getFullYear() }} — Odemo IT</v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: true
  }),
  computed: {
    logged() {
      return this.$store.state.user;
    },
    isAdmin() {
      return this.$store.state.user && this.$store.state.user.rol === "Admin";
    },
    isGrocer() {
      return this.$store.state.user && this.$store.state.user.rol === "Grocer";
    },
    isSeller() {
      return this.$store.state.user && this.$store.state.user.rol === "Seller";
    }
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>
