<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table :headers="headers" :items="categories" :search="search" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Categories</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">New</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form ref="form" v-model="valid">
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            v-model="editedItem.name"
                            :counter="50"
                            :rules="nameRules"
                            label="Name"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            v-model="editedItem.description"
                            :counter="255"
                            :rules="descriptionRules"
                            label="Description"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!--Change state category modal-->
            <v-dialog v-model="modal" max-width="500px">
              <v-card>
                <v-card-title>
                  <span v-if="stateItem.action === 1" class="headline">Activate category</span>
                  <span v-if="stateItem.action === 2" class="headline">Deactivate category</span>
                </v-card-title>
                <v-card-text>
                  Are you sure
                  <span v-if="stateItem.action === 1">activate</span>
                  <span v-if="stateItem.action === 2">deactivate</span>
                  the category {{ stateItem.name }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-1" text @click="closeModal">Cancel</v-btn>
                  <v-btn
                    v-if="stateItem.action === 1"
                    color="red darken-1"
                    text
                    @click="activate"
                  >Activate</v-btn>
                  <v-btn
                    v-if="stateItem.action === 2"
                    color="red darken-1"
                    text
                    @click="deactivate"
                  >Deactivate</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.state="{ item }">
          <div v-if="item.state">
            <span class="blue--text">Active</span>
          </div>
          <div v-else>
            <span class="red--text">Inactive</span>
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
          <template v-if="item.state">
            <v-icon small @click="activateDeactivate(2, item)">block</v-icon>
          </template>
          <template v-else>
            <v-icon small @click="activateDeactivate(1, item)">check</v-icon>
          </template>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    search: "",
    categories: [],
    headers: [
      { text: "Name", value: "name", sortable: true },
      { text: "Description", value: "description", sortable: false },
      { text: "State", value: "state", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      _id: "",
      name: "",
      description: ""
    },
    defaultItem: {
      _id: "",
      name: "",
      description: ""
    },
    valid: true,
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 50) || "Name must be less than 50 characters"
    ],
    descriptionRules: [
      v => v.length <= 255 || "Description must be less than 255 characters"
    ],
    modal: false,
    stateItem: {
      _id: "",
      name: "",
      action: 0
    },
    stateDefaultItem: {
      _id: "",
      name: "",
      action: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New" : "Edit";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };
      axios
        .get("/category/list", configuration)
        .then(response => {
          //console.log(response);
          this.categories = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem);
      this.dialog = true;
      //this.$refs.form.resetValidation();
    },

    deleteItem(item) {
      const index = this.categories.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.categories.splice(index, 1);
    },

    close() {
      this.dialog = false;
      /* this.editedItem = this.defaultItem;
      this.editedIndex = -1; */
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.$refs.form.resetValidation();
      }, 300);
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };
      if (this.editedIndex > -1) {
        //Edit category
        console.log(this.editedItem);
        axios
          .put(
            "/category/update",
            {
              _id: this.editedItem._id,
              name: this.editedItem.name,
              description: this.editedItem.description
            },
            configuration
          )
          .then(response => {
            this.close();
            this.initialize();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        //New category
        console.log(this.editedItem);
        axios
          .post(
            "/category/add",
            {
              name: this.editedItem.name,
              description: this.editedItem.description
            },
            configuration
          )
          .then(response => {
            this.close();
            this.initialize();
          })
          .catch(error => {
            console.log(error);
          });
        //this.categories.push(this.editedItem);
      }
      this.close();
    },
    activateDeactivate(action, item) {
      this.modal = true;
      this.stateItem._id = item._id;
      this.stateItem.name = item.name;
      this.stateItem.action = action;
    },
    closeModal() {
      this.modal = false;
      setTimeout(() => {
        this.stateItem = Object.assign({}, this.stateDefaultItem);
      }, 300);
    },
    activate() {
      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };
      axios
        .put(
          "/category/activate",
          {
            _id: this.stateItem._id
          },
          configuration
        )
        .then(response => {
          this.closeModal();
          this.initialize();
        })
        .catch(error => {
          console.log(error);
        });
    },
    deactivate() {
      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };
      axios
        .put(
          "/category/deactivate",
          {
            _id: this.stateItem._id
          },
          configuration
        )
        .then(response => {
          this.closeModal();
          this.initialize();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
