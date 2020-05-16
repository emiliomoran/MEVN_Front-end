<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="incomes"
        :search="search"
        class="elevation-1"
        v-if="showNew===0"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Incomes</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
              v-if="showNew===0"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" v-if="showNew===0" @click="showNewHandle()">New</v-btn>

            <!--Change state category modal-->
            <v-dialog v-model="modal" max-width="500px">
              <v-card>
                <v-card-title>
                  <span v-if="stateItem.action === 1" class="headline">Activate income</span>
                  <span v-if="stateItem.action === 2" class="headline">Deactivate income</span>
                </v-card-title>
                <v-card-text>
                  Are you sure
                  <span v-if="stateItem.action === 1">activate</span>
                  <span v-if="stateItem.action === 2">deactivate</span>
                  the income {{ stateItem.name }}
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
            <span class="blue--text">Accepted</span>
          </div>
          <div v-else>
            <span class="red--text">Canceled</span>
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <template v-if="item.state">
            <v-icon small @click="activateDeactivate(2, item)">block</v-icon>
          </template>
          <template v-else>
            <v-icon small @click="activateDeactivate(1, item)">check</v-icon>
          </template>
          <template>
            <v-icon small @click="showIncome(item)">tab</v-icon>
          </template>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
      <v-container v-if="showNew">
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-select
                v-model="editedItem.proof_type"
                :items="proof_types"
                :rules="[v => !!v || 'Proof type is required']"
                label="Proof Type"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="editedItem.proof_serie"
                :counter="7"
                :rules="proofSerieRules"
                label="Proof Serie"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="editedItem.proof_num"
                :counter="10"
                :rules="proofNumberRules"
                label="Proof Number"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete
                v-model="editedItem.person"
                :items="persons"
                :rules="[v => !!v || 'Provider is required']"
                label="Provider"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                type="number"
                v-model="editedItem.tax"
                :rules="taxRules"
                label="Tax"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-text-field v-model="code" label="Code" @keyup.enter="searchCode()"></v-text-field>
              <v-flex class="red--text" v-if="errorItem">{{ errorItem }}</v-flex>
            </v-col>
          </v-row>
          <v-row>
            <!--Dialog items-->
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on }">
                <v-btn small fab dark color="teal" v-on="on">
                  <v-icon dark>list</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Select a item</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-text-field
                      v-model="text"
                      class="text-xs-center"
                      append-icon="search"
                      label="Search"
                      @keyup.enter="getItems()"
                    ></v-text-field>
                    <template>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-data-table :headers="headersItems" :items="items" class="elevation-1">
                            <template v-slot:top></template>
                            <template v-slot:item.state="{ item }">
                              <div v-if="item.state">
                                <span class="blue--text">Active</span>
                              </div>
                              <div v-else>
                                <span class="red--text">Inactive</span>
                              </div>
                            </template>
                            <template v-slot:item.actions="{ item }">
                              <v-icon small @click="addToDetails(item)">add</v-icon>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </template>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeModalItem()">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
          <v-row>
            <template>
              <v-col cols="12" sm="12" md="12">
                <v-data-table
                  :headers="headersDetails"
                  :items="editedItem.details"
                  class="elevation-1"
                  hide-default-footer
                >
                  <template v-slot:top></template>
                  <template v-slot:item.amount="{ item }">
                    <v-text-field v-model="item.amount" type="number"></v-text-field>
                  </template>
                  <template v-slot:item.price="{ item }">
                    <v-text-field v-model="item.price" type="number"></v-text-field>
                  </template>
                  <template v-slot:item.subTotal="{ item }">$ {{ item.amount * item.price }}</template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon small @click="removeFromDetails(editedItem.details, item)">delete</v-icon>
                  </template>
                </v-data-table>
                <v-spacer></v-spacer>
                <v-flex class="text-xs-right">
                  <strong>Partial Total:</strong>
                  $ {{ partialTotal = (total - taxTotal).toFixed(2) }}
                </v-flex>
                <v-flex class="text-xs-right">
                  <strong>Tax Total:</strong>
                  $ {{ taxTotal = ((total * editedItem.tax)/(1 + editedItem.tax)).toFixed(2) }}
                </v-flex>
                <v-flex class="text-xs-right">
                  <strong>Total:</strong>
                  $ {{ total = calculateTotal }}
                </v-flex>
              </v-col>
            </template>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn v-if="!edited" color="blue darken-1" text @click="save">Save</v-btn>
          </v-row>
        </v-form>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    search: "",
    incomes: [],
    persons: [],
    items: [],
    proof_types: ["BOLLET", "BILL", "TICKET", "GUIDE"],
    headers: [
      { text: "User", value: "user.name", sortable: true },
      { text: "Provider", value: "person.name", sortable: true },
      { text: "Proof Type", value: "proof_type", sortable: true },
      { text: "Proof Serie", value: "proof_serie", sortable: false },
      { text: "Proof Number", value: "proof_num", sortable: false },
      { text: "Date", value: "createdAt", sortable: false },
      { text: "Tax", value: "tax", sortable: false },
      { text: "Total", value: "total", sortable: false },
      { text: "State", value: "state", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    headersDetails: [
      { text: "Item", value: "item", sortable: false },
      { text: "Amount", value: "amount", sortable: false },
      { text: "Price", value: "price", sortable: false },
      { text: "Sub Total", value: "subTotal", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    headersItems: [
      { text: "Code", value: "code", sortable: false },
      { text: "Name", value: "name", sortable: true },
      { text: "Category", value: "category.name", sortable: true },
      { text: "Stock", value: "stock", sortable: false },
      { text: "Price", value: "price", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "State", value: "state", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    edited: false,
    code: "",
    text: "",
    errorItem: "",
    showNew: 0,
    editedItem: {
      person: "",
      proof_type: "",
      proof_serie: "",
      proof_num: "",
      tax: 0.12,
      details: []
    },
    defaultItem: {
      person: "",
      proof_type: "",
      proof_serie: "",
      proof_num: "",
      tax: 0.12,
      details: []
    },
    valid: true,
    proofSerieRules: [
      v => !!v || "Proof serie is required",
      v => (v && v.length <= 7) || "Proof serie must be less than 7 characters"
    ],
    proofNumberRules: [
      v => !!v || "Proof number is required",
      v =>
        (v && v.length <= 10) || "Proof number must be less than 10 characters"
    ],
    taxRules: [v => v > 0 || "Tax must be greater than 0"],
    modal: false,
    partialTotal: 0,
    taxTotal: 0,
    total: 0,
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
    calculateTotal: function() {
      let result = 0.0;
      for (var i = 0; i < this.editedItem.details.length; i++) {
        result =
          result +
          this.editedItem.details[i].amount * this.editedItem.details[i].price;
      }
      console.log(result);
      return result;
    }
  },

  watch: {
    dialog(val) {
      val || this.closeModalItem();
    }
  },

  created() {
    this.getPersons();
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
        .get("/income/list", configuration)
        .then(response => {
          //console.log(response);
          this.incomes = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    getPersons() {
      let persons = [];
      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };
      axios
        .get("/person/list-providers", configuration)
        .then(response => {
          //console.log(response);
          //this.items = response.data;
          persons = response.data;
          persons.map(category => {
            this.persons.push({
              text: category.name,
              value: category._id
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    getItems() {
      this.items = [];
      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };
      axios
        .get("/item/list?value=" + this.text, configuration)
        .then(response => {
          console.log(response);
          this.items = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    getDetails(id) {
      this.items = [];
      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };
      axios
        .get("/income/query?_id=" + id, configuration)
        .then(response => {
          console.log(response.data.details);
          this.editedItem.details = response.data.details;
        })
        .catch(error => {
          console.log(error);
        });
    },

    showIncome(item) {
      console.log(item);
      //this.close();

      this.editedItem.person = item.person._id;
      this.editedItem.proof_type = item.proof_type;
      this.editedItem.proof_serie = item.proof_serie;
      this.editedItem.proof_num = item.proof_num;
      this.editedItem.tax = item.tax;
      this.edited = true;
      console.log(this.edited);
      this.getDetails(item._id);
      this.showNewHandle();
    },

    searchCode() {
      this.errorItem = "";
      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };
      axios
        .get("/item/query-code?code=" + this.code, configuration)
        .then(response => {
          console.log(response.data);
          this.addToDetails(response.data);
        })
        .catch(error => {
          this.errorItem = "Item not found";
        });
    },

    addToDetails(data) {
      this.errorItem = "";
      //console.log(data);
      if (this.findItem(data._id)) {
        this.errorItem = "Item has already been added";
      } else {
        this.editedItem.details.push({
          _id: data._id,
          item: data.name,
          amount: 1,
          price: data.price
        });
        this.code = "";
      }
    },

    removeFromDetails(arr, item) {
      let i = arr.indexOf(item);
      if (i !== -1) {
        arr.splice(i, 1);
      }
    },

    findItem(id) {
      let sw = false;
      for (var i = 0; i < this.editedItem.details.length; i++) {
        if (this.editedItem.details[i]._id === id) {
          sw = true;
        }
      }
      return sw;
    },

    showNewHandle() {
      this.showNew = 1;
    },

    showModalItem() {
      console.log("Entra a show modal item");
      this.dialog = true;
    },

    closeModalItem() {
      this.text = "";
      this.items = [];
      this.dialog = false;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.total = 0;
        this.taxTotal = 0;
        this.partialTotal = 0;
        this.edited = false;
        this.showNew = 0;
        //this.$refs.form.resetValidation();
        //this.showNewHandle();
      }, 300);
    },

    save() {
      this.errorItem = "";
      if (!this.$refs.form.validate()) {
        return;
      }

      if (this.editedItem.details.length === 0) {
        this.errorItem = "No item has been added";
        return;
      }

      let headers = {
        Token: this.$store.state.token
      };
      let configuration = {
        headers: headers
      };

      //New category
      console.log(this.editedItem);
      axios
        .post(
          "/income/add",
          {
            person: this.editedItem.person,
            user: this.$store.state.user._id,
            proof_type: this.editedItem.proof_type,
            proof_serie: this.editedItem.proof_serie,
            proof_num: this.editedItem.proof_num,
            tax: this.editedItem.tax,
            total: this.total,
            details: this.editedItem.details
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

      this.close();
    },
    activateDeactivate(action, item) {
      this.modal = true;
      this.stateItem._id = item._id;
      this.stateItem.name = item.proof_num;
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
          "/income/activate",
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
          "/income/deactivate",
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
