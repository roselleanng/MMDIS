<template>
  <div class="container1">
    <div class="bartable">
      <div class="box">
        <h1>Bukidnon</h1>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData1" v-if="chartDataReady" />
      </div>

      <div class="box">
        <h1>Misamis Oriental</h1>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData2" v-if="chartDataReady" />
      </div>

      <div class="box">
        <h1>Misamis Occidental</h1>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData3" v-if="chartDataReady" />
      </div>


      <div class="box">
        <h1>Lanao del Norte</h1>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData4" v-if="chartDataReady" />
      </div>
    </div>
    <div class="bartable1">
      <div class="box">
        <h1>Camiguin</h1>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData5" v-if="chartDataReady" />
      </div>

      <div class="box">
        <h1>Cagayan de Oro City</h1>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData6" v-if="chartDataReady" />
      </div>


      <div class="box">
        <h1>Iligan City</h1>
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData7" v-if="chartDataReady" />
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import axios from 'axios';
import { API_BASE_URL } from '../../../config'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'bar',
  components: { Bar },
  props: {
    application: String,
    mode: {
      type: String,
      default: 'new' // safety default
    }
  },
  data() {
    return {
      chartData1: {
        labels: ['District 1', 'District 2', 'District 3', 'District 4'],
        datasets: [
          {
            label: 'Districts',
            backgroundColor: ['#9FE2BF', '#32CD32', '#008000', '#355E3B'],
            data: [0, 0, 0, 0]
          },
        ]
      },
      chartData2: {
        labels: ['District 1', 'District 2'],
        datasets: [
          {
            label: 'Districts',
            backgroundColor: ['#9FE2BF', '#008000'],
            data: [0, 0]
          },
        ]
      },
      chartData3: {
        labels: ['District 1'],
        datasets: [
          {
            label: 'Districts',
            backgroundColor: ['#008000'],
            data: [0]
          },
        ]
      },
      chartData4: {
        labels: ['District 1'],
        datasets: [
          {
            label: 'Districts',
            backgroundColor: ['#9FE2BF'],
            data: [0]
          },
        ]
      },
      chartData5: {
        labels: ['District 1'],
        datasets: [
          {
            label: 'Districts',
            backgroundColor: ['#008000'],
            data: [0]
          },
        ]
      },
      chartData6: {
        labels: ['District 1'],
        datasets: [
          {
            label: 'Districts',
            backgroundColor: ['#9FE2BF'],
            data: [0]
          },
        ]
      },
      chartData7: {
        labels: ['District 1'],
        datasets: [
          {
            label: 'Districts',
            backgroundColor: ['#008000'],
            data: [0]
          },
        ]
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 1,
            ticks: {
              stepSize: 1 // Adjust this step size to control the interval between ticks
            }
          }
        }
      },
      chartDataReady: false,
    }
  },
  created() {
    this.fetchProvinceData();
  },
  watch: {
    application: function() {
      this.fetchProvinceData();
    },
    mode: function() {
      this.fetchProvinceData();
    }
  },
  methods: {
    fetchProvinceData() {
  axios.get(`${API_BASE_URL}/get_details/`)
    .then(response => {
      const District1 = { 'baungon': 0, 'libona': 0, 'malitbog': 0, 'manolo fortich': 0, 'sumilao': 0, 'talakag': 0 };
      const District2 = { 'cabanglasan': 0, 'impasugong': 0, 'lantapan': 0, 'city of malaybalay (capital)': 0, 'san fernando': 0 };
      const District3 = { 'damulog': 0, 'dangcagan': 0, 'don carlos': 0, 'kadingilan': 0, 'kibawe': 0, 'kitaotao': 0, 'maramag': 0, 'quezon': 0 };
      const District4 = { 'kalilangan': 0, 'pangantucan': 0, 'city of valencia': 0 };
      const misorDistrict1 = { 'gingoog': 0, 'balingasag': 0, 'balingoan': 0, 'binuangan': 0, 'kinoguitan': 0, 'lagonglong': 0, 'magsaysay (linugos)': 0, 'medina': 0, 'salay': 0, 'sugbongcogon': 0, 'talisayan': 0 };
      const misorDistrict2 = { 'el salvador': 0, 'alubijid': 0, 'claveria': 0, 'gitagum': 0, 'initao': 0, 'jasaan': 0, 'laguindingan': 0, 'libertad': 0, 'lugait': 0, 'manticao': 0, 'naawan': 0, 'opol': 0, 'tagoloan': 0, 'billanueva': 0 };
      const misoccDistrict1 = { 'misamis occidental': 0 };
      const lanaoDistrict1 = { 'lanao del norte': 0 };
      const camsDistrict1 = { 'camiguin': 0 };
      const cgyDistrict1 = { 'cagayan de oro city (capital)': 0 };
      const iligDistrict1 = { 'iligan city': 0 };

      let filteredData = response.data;

            if (this.mode === 'new') {
        // NEW APPLICATION VIEW
        filteredData = filteredData.filter(bar =>
          bar.application?.toLowerCase() === this.application?.toLowerCase() &&
          bar.status !== 'Issued'
        );

      } else if (this.mode === 'permit') {
        // PERMIT VIEW
        filteredData = filteredData.filter(bar =>
          bar.application?.toLowerCase() === this.application?.toLowerCase() &&
          bar.status === 'Issued'
        );
      }
      

      filteredData.forEach(item => {
        // Array of all city fields
        const cities = [item.city, item.city1, item.city2, item.city3].map(c => c?.toLowerCase()).filter(Boolean);
        // Array of all province fields
        const provinces = [item.province, item.province1, item.province2, item.province3].map(p => p?.toLowerCase()).filter(Boolean);

        // Increment counts for each city
        cities.forEach(city => {
          if (city in District1) District1[city]++;
          if (city in District2) District2[city]++;
          if (city in District3) District3[city]++;
          if (city in District4) District4[city]++;
          if (city in misorDistrict1) misorDistrict1[city]++;
          if (city in misorDistrict2) misorDistrict2[city]++;
          if (city in cgyDistrict1) cgyDistrict1[city]++;
          if (city in iligDistrict1) iligDistrict1[city]++;
        });

        // Increment counts for each province
        provinces.forEach(province => {
          if (province in misoccDistrict1) misoccDistrict1[province]++;
          if (province in lanaoDistrict1) lanaoDistrict1[province]++;
          if (province in camsDistrict1) camsDistrict1[province]++;
        });
      });

      // Update charts
      this.updateChartData(District1, 0);
      this.updateChartData(District2, 1);
      this.updateChartData(District3, 2);
      this.updateChartData(District4, 3);
      this.updateChart2Data(misorDistrict1, 0);
      this.updateChart2Data(misorDistrict2, 1);
      this.updateChart3Data(misoccDistrict1, 0);
      this.updateChart4Data(lanaoDistrict1, 0);
      this.updateChart5Data(camsDistrict1, 0);
      this.updateChart6Data(cgyDistrict1, 0);
      this.updateChart7Data(iligDistrict1, 0);
    })
    .catch(error => {
      console.error('Error fetching province data:', error);
    });
}
,
    updateChartData(District1, indd) {
      const data = this.chartData1.datasets[0].data;

      const totalDistrict1Count = Object.values(District1).reduce((total, count) => total + count, 0);

      data[indd] = totalDistrict1Count;

      this.$forceUpdate(); // Force Vue to re-render the chart
      this.chartDataReady = true;
    },
    updateChart2Data(misorDistrict1, indd) {
      const data2 = this.chartData2.datasets[0].data;

      const totalDistrict1Count = Object.values(misorDistrict1).reduce((total, count) => total + count, 0);

      data2[indd] = totalDistrict1Count;

      this.$forceUpdate(); // Force Vue to re-render the chart
      this.chartDataReady = true;
    },
    updateChart3Data(misoccDistrict1, indd) {
      const data2 = this.chartData3.datasets[0].data;

      const totalDistrict1Count = Object.values(misoccDistrict1).reduce((total, count) => total + count, 0);

      data2[indd] = totalDistrict1Count;

      this.$forceUpdate(); // Force Vue to re-render the chart
      this.chartDataReady = true;
    },
    updateChart4Data(lanaoDistrict1, indd) {
      const data2 = this.chartData4.datasets[0].data;

      const totalDistrict1Count = Object.values(lanaoDistrict1).reduce((total, count) => total + count, 0);

      data2[indd] = totalDistrict1Count;

      this.$forceUpdate(); // Force Vue to re-render the chart
      this.chartDataReady = true;
    },
    updateChart5Data(camsDistrict1, indd) {
      const data2 = this.chartData5.datasets[0].data;

      const totalDistrict1Count = Object.values(camsDistrict1).reduce((total, count) => total + count, 0);

      data2[indd] = totalDistrict1Count;


      this.$forceUpdate(); // Force Vue to re-render the chart
      this.chartDataReady = true;
    },
    updateChart6Data(cgyDistrict1, indd) {
      const data2 = this.chartData6.datasets[0].data;

      const totalDistrict1Count = Object.values(cgyDistrict1).reduce((total, count) => total + count, 0);

      data2[indd] = totalDistrict1Count;

      this.$forceUpdate(); // Force Vue to re-render the chart
      this.chartDataReady = true;
    },
    updateChart7Data(iligDistrict1, indd) {
      const data2 = this.chartData7.datasets[0].data;

      const totalDistrict1Count = Object.values(iligDistrict1).reduce((total, count) => total + count, 0);

      data2[indd] = totalDistrict1Count;

      this.$forceUpdate(); // Force Vue to re-render the chart
      this.chartDataReady = true;
    },
    resetChartData() {
      this.chartData1.datasets[0].data = [0, 0, 0, 0];
      this.chartData2.datasets[0].data = [0, 0];
      this.chartData3.datasets[0].data = [0];
      this.chartData4.datasets[0].data = [0];
      this.chartData5.datasets[0].data = [0];
      this.chartData6.datasets[0].data = [0];
      this.chartData7.datasets[0].data = [0];
      this.chartDataReady = false;
    }
  }
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: row;
}

.bartable {
  display: flex;
  flex-direction: column repeat(auto-fit, minmax(200px, 2fr));

}

.bartable1 {
  display: flex;
  flex-direction: column repeat(auto-fit, minmax(200px, 2fr));
}

.box {
  height: 200px;
  margin-right: 50px;
}
</style>