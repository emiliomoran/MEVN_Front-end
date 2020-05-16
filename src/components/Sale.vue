<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="sales"
        :search="search"
        class="elevation-1"
        v-if="showNew === 0"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Sales</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
              v-if="showNew === 0"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-if="showNew === 0"
              @click="showNewHandle()"
              >New</v-btn
            >

            <!--Change state category modal-->
            <v-dialog v-model="modal" max-width="500px">
              <v-card>
                <v-card-title>
                  <span v-if="stateItem.action === 1" class="headline"
                    >Activate sale</span
                  >
                  <span v-if="stateItem.action === 2" class="headline"
                    >Deactivate sale</span
                  >
                </v-card-title>
                <v-card-text>
                  Are you sure
                  <span v-if="stateItem.action === 1">activate</span>
                  <span v-if="stateItem.action === 2">deactivate</span>
                  the sale {{ stateItem.name }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-1" text @click="closeModal"
                    >Cancel</v-btn
                  >
                  <v-btn
                    v-if="stateItem.action === 1"
                    color="red darken-1"
                    text
                    @click="activate"
                    >Activate</v-btn
                  >
                  <v-btn
                    v-if="stateItem.action === 2"
                    color="red darken-1"
                    text
                    @click="deactivate"
                    >Deactivate</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!--PDF-->
            <template>
              <v-dialog v-model="proofModal" max-width="1000px">
                <!-- <template v-slot:activator="{ on }">
                  <v-btn small fab dark color="teal" v-on="on">
                    <v-icon dark>list</v-icon>
                  </v-btn>
                </template> -->
                <v-card>
                  <v-card-title>
                    <v-btn color="blue darken-1" text @click="generatePDF">
                      <v-icon>print</v-icon>
                    </v-btn>
                    <span class="headline">Sale report</span>
                  </v-card-title>
                  <v-card-text>
                    <div id="bill">
                      <header>
                        <div id="logo">
                          <img
                            src="data:image/png;base64,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"
                            id="imagen"
                          />
                        </div>
                        <div id="datos">
                          <p id="encabezado">
                            <b>IncanatoIT</b><br />José Gálvez 1368, Chongoyape
                            - Chiclayo, Perú<br />Telefono:(+51)931742904<br />Email:jcarlos.ad7@gmail.com
                          </p>
                        </div>
                        <div id="fact">
                          <p>
                            {{ editedItem.proof_type }}<br />
                            {{ editedItem.proof_serie }}-{{
                              editedItem.proof_num
                            }}<br />
                            {{ editedItem.proofDate }}
                          </p>
                        </div>
                      </header>
                      <br />
                      <section>
                        <div>
                          <table id="facliente">
                            <tbody>
                              <tr>
                                <td id="cliente">
                                  <strong
                                    >Sr(a). {{ editedItem.person.name }}</strong
                                  ><br />
                                  <strong>Documento:</strong>
                                  {{ editedItem.person.doc_num }}<br />
                                  <strong>Dirección:</strong>
                                  {{ editedItem.person.address }} <br />
                                  <strong>Teléfono:</strong
                                  >{{ editedItem.person.phone }}<br />
                                  <strong>Email:</strong>
                                  {{ editedItem.person.email }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </section>
                      <br />
                      <section>
                        <div>
                          <table id="facarticulo">
                            <thead>
                              <tr id="fa">
                                <th>CANT</th>
                                <th>DESCRIPCION</th>
                                <th>PRECIO UNIT</th>
                                <th>DESC.</th>
                                <th>PRECIO TOTAL</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="det in editedItem.details"
                                :key="det._id"
                              >
                                <td style="text-align:center;">
                                  {{ det.amount }}
                                </td>
                                <td>
                                  {{ det.item }}
                                </td>
                                <td style="text-align:right;">
                                  {{ det.price }}
                                </td>
                                <td style="text-align:right;">
                                  {{ det.discount }}
                                </td>
                                <td style="text-align:right;">
                                  {{ det.amount * det.price - det.discount }}
                                </td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right;">SUBTOTAL</th>
                                <th style="text-align:right;">
                                  $
                                  {{
                                    (partialTotal = (total - taxTotal).toFixed(
                                      2
                                    ))
                                  }}
                                </th>
                              </tr>
                              <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right;">
                                  IVA ({{ editedItem.tax }})
                                </th>
                                <th style="text-align:right;">
                                  $
                                  {{
                                    (taxTotal = (
                                      (total * editedItem.tax) /
                                      (1 + editedItem.tax)
                                    ).toFixed(2))
                                  }}
                                </th>
                              </tr>
                              <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th style="text-align:right;">TOTAL</th>
                                <th style="text-align:right;">
                                  $ {{ (total = calculateTotal) }}
                                </th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </section>
                      <br />
                      <br />
                      <footer>
                        <div id="gracias">
                          <p><b>Gracias por su compra!</b></p>
                        </div>
                      </footer>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="hiddeProof"
                      >Cancel</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <!---->
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
          <template>
            <v-icon small class="mr-2" @click="showProof(item)">print</v-icon>
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
                :rules="[(v) => !!v || 'Proof type is required']"
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
                :rules="[(v) => !!v || 'Customer is required']"
                label="Customer"
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
              <v-text-field
                v-model="code"
                label="Code"
                @keyup.enter="searchCode()"
              ></v-text-field>
              <v-flex class="red--text" v-if="errorItem">{{
                errorItem
              }}</v-flex>
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
                          <v-data-table
                            :headers="headersItems"
                            :items="items"
                            class="elevation-1"
                          >
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
                              <v-icon small @click="addToDetails(item)"
                                >add</v-icon
                              >
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </template>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeModalItem()"
                    >Cancel</v-btn
                  >
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
                    <v-text-field
                      v-model="item.amount"
                      type="number"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.price="{ item }">
                    <v-text-field
                      v-model="item.price"
                      type="number"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.discount="{ item }">
                    <v-text-field
                      v-model="item.discount"
                      type="number"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.subTotal="{ item }"
                    >$ {{ item.amount * item.price - item.discount }}</template
                  >
                  <template v-slot:item.actions="{ item }">
                    <v-icon
                      small
                      @click="removeFromDetails(editedItem.details, item)"
                      >delete</v-icon
                    >
                  </template>
                </v-data-table>
                <v-spacer></v-spacer>
                <v-flex class="text-xs-right">
                  <strong>Partial Total:</strong>
                  $ {{ (partialTotal = (total - taxTotal).toFixed(2)) }}
                </v-flex>
                <v-flex class="text-xs-right">
                  <strong>Tax Total:</strong>
                  $
                  {{
                    (taxTotal = (
                      (total * editedItem.tax) /
                      (1 + editedItem.tax)
                    ).toFixed(2))
                  }}
                </v-flex>
                <v-flex class="text-xs-right">
                  <strong>Total:</strong>
                  $ {{ (total = calculateTotal) }}
                </v-flex>
              </v-col>
            </template>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn v-if="!edited" color="blue darken-1" text @click="save"
              >Save</v-btn
            >
          </v-row>
        </v-form>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default {
  data: () => ({
    dialog: false,
    search: "",
    sales: [],
    persons: [],
    items: [],
    proof_types: ["BOLLET", "BILL", "TICKET", "GUIDE"],
    headers: [
      { text: "User", value: "user.name", sortable: true },
      { text: "Customer", value: "person.name", sortable: true },
      { text: "Proof Type", value: "proof_type", sortable: true },
      { text: "Proof Serie", value: "proof_serie", sortable: false },
      { text: "Proof Number", value: "proof_num", sortable: false },
      { text: "Date", value: "createdAt", sortable: false },
      { text: "Tax", value: "tax", sortable: false },
      { text: "Total", value: "total", sortable: false },
      { text: "State", value: "state", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    headersDetails: [
      { text: "Item", value: "item", sortable: false },
      { text: "Amount", value: "amount", sortable: false },
      { text: "Price", value: "price", sortable: false },
      { text: "Discount", value: "discount", sortable: false },
      { text: "Sub Total", value: "subTotal", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    headersItems: [
      { text: "Code", value: "code", sortable: false },
      { text: "Name", value: "name", sortable: true },
      { text: "Category", value: "category.name", sortable: true },
      { text: "Stock", value: "stock", sortable: false },
      { text: "Price", value: "price", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "State", value: "state", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
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
      details: [],
    },
    defaultItem: {
      person: "",
      proof_type: "",
      proof_serie: "",
      proof_num: "",
      tax: 0.12,
      details: [],
    },
    valid: true,
    proofSerieRules: [
      (v) => !!v || "Proof serie is required",
      (v) =>
        (v && v.length <= 7) || "Proof serie must be less than 7 characters",
    ],
    proofNumberRules: [
      (v) => !!v || "Proof number is required",
      (v) =>
        (v && v.length <= 10) || "Proof number must be less than 10 characters",
    ],
    taxRules: [(v) => v > 0 || "Tax must be greater than 0"],
    modal: false,
    partialTotal: 0,
    taxTotal: 0,
    total: 0,
    stateItem: {
      _id: "",
      name: "",
      action: 0,
    },
    stateDefaultItem: {
      _id: "",
      name: "",
      action: 0,
    },
    proofModal: false,
  }),

  computed: {
    calculateTotal: function() {
      let result = 0.0;
      for (var i = 0; i < this.editedItem.details.length; i++) {
        result =
          result +
          this.editedItem.details[i].amount * this.editedItem.details[i].price -
          this.editedItem.details[i].discount;
      }
      console.log(result);
      return result;
    },
  },

  watch: {
    dialog(val) {
      val || this.closeModalItem();
    },
  },

  created() {
    this.getPersons();
    this.initialize();
  },

  methods: {
    initialize() {
      let headers = {
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };
      axios
        .get("/sale/list", configuration)
        .then((response) => {
          //console.log(response);
          this.sales = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getPersons() {
      let persons = [];
      let headers = {
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };
      axios
        .get("/person/list-customers", configuration)
        .then((response) => {
          //console.log(response);
          //this.items = response.data;
          persons = response.data;
          persons.map((category) => {
            this.persons.push({
              text: category.name,
              value: category._id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getItems() {
      this.items = [];
      let headers = {
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };
      axios
        .get("/item/list?value=" + this.text, configuration)
        .then((response) => {
          console.log(response);
          this.items = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getDetails(id) {
      this.items = [];
      let headers = {
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };
      axios
        .get("/sale/query?_id=" + id, configuration)
        .then((response) => {
          console.log(response.data.details);
          this.editedItem.details = response.data.details;
        })
        .catch((error) => {
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
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };
      axios
        .get("/item/query-code?code=" + this.code, configuration)
        .then((response) => {
          console.log(response.data);
          this.addToDetails(response.data);
        })
        .catch((error) => {
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
          price: data.price,
          discount: 0,
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
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };

      //New category
      console.log(this.editedItem);
      axios
        .post(
          "/sale/add",
          {
            person: this.editedItem.person,
            user: this.$store.state.user._id,
            proof_type: this.editedItem.proof_type,
            proof_serie: this.editedItem.proof_serie,
            proof_num: this.editedItem.proof_num,
            tax: this.editedItem.tax,
            total: this.total,
            details: this.editedItem.details,
          },
          configuration
        )
        .then((response) => {
          this.close();
          this.initialize();
        })
        .catch((error) => {
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
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };
      axios
        .put(
          "/sale/activate",
          {
            _id: this.stateItem._id,
          },
          configuration
        )
        .then((response) => {
          this.closeModal();
          this.initialize();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deactivate() {
      let headers = {
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };
      axios
        .put(
          "/sale/deactivate",
          {
            _id: this.stateItem._id,
          },
          configuration
        )
        .then((response) => {
          this.closeModal();
          this.initialize();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showProof(item) {
      this.editedItem.person = item.person;
      this.editedItem.proof_type = item.proof_type;
      this.editedItem.proof_serie = item.proof_serie;
      this.editedItem.proof_num = item.proof_num;
      this.editedItem.tax = item.tax;
      this.editedItem.proofDate = item.createdAt;
      console.log(this.edited);
      this.getDetails(item._id);
      this.proofModal = true;
    },
    hiddeProof() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.proofModal = false;
    },
    generatePDF() {
      const quotes = document.getElementById("bill");
      html2canvas(quotes).then((canvas) => {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 210;
        var pageHeight = 295;

        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        var doc = new jsPDF("p", "mm", "a4");
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save("proofSale.pdf");
      });
    },
  },
};
</script>

<style>
#bill {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

#logo {
  float: left;
  margin-left: 2%;
  margin-right: 2%;
}
#imagen {
  width: 100px;
}

#fact {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

#datos {
  float: left;
  margin-top: 0%;
  margin-left: 2%;
  margin-right: 2%;
  /*text-align: justify;*/
}

#encabezado {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}

section {
  clear: left;
}

#cliente {
  text-align: left;
}

#facliente {
  width: 40%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: #2183e3;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#gracias {
  text-align: center;
}
</style>
