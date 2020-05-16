<template>
  <v-container grid-list-m>
    <v-layout wrap>
      <v-flex xs12 sm12 md12>
        <div class="ct-chart">
          <canvas id="myChart"> </canvas>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import Chart from "chart.js";
export default {
  data() {
    return {
      values: [],
      months: [],
      totals: [],
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      console.log("initialize");
      let headers = {
        Token: this.$store.state.token,
      };
      let configuration = {
        headers: headers,
      };
      axios
        .get("/sale/report-12-months", configuration)
        .then((response) => {
          //console.log(response);
          this.values = response.data;
          this.graph();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    graph() {
      this.values.map((value) => {
        let nameMonth = "";
        switch (parseInt(value._id.month)) {
          case 1:
            nameMonth = "January";
            break;
          case 2:
            nameMonth = "Febrary";
            break;
          case 3:
            nameMonth = "March";
            break;
          case 4:
            nameMonth = "April";
            break;
          case 5:
            nameMonth = "May";
            break;
          case 6:
            nameMonth = "June";
            break;
          case 7:
            nameMonth = "July";
            break;
          case 8:
            nameMonth = "August";
            break;
          case 9:
            nameMonth = "September";
            break;
          case 10:
            nameMonth = "October";
            break;
          case 11:
            nameMonth = "November";
            break;
          case 12:
            nameMonth = "December";
            break;
          default:
            nameMonth = "Error";
        }

        this.months.push(nameMonth + " " + value._id.year);
        this.totals.push(value.total);
      });

      //Chart code
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.months,
          datasets: [
            {
              label: "Sales 12 months ago",
              data: this.totals,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    },
  },
};
</script>
