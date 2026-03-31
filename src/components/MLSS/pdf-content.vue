<template>
  <div ref="screen" class="flex justify-center">
    <!-- pdf-content -->
    <div style=" width: 95%;" class="p-8 mt-10" >
      <h1 class="text-4xl font-bold text-center">
        Area Status Clearance {{ activeReleasedYear || 'N/A' }}
      </h1>
      <div class="text-center mt-4">
        <p class="text-sm">
          CSAG: {{ csagTotalSum }} | 
          ISAG: {{ isagTotalSum }} | 
          QUARRY: {{ quarryTotalSum }}
        </p>
      </div>
        <div class="ml-20">
            <h2 class="text-2xl font-bold mt-10">Commercial Sand and Gravel</h2>
            <!-- Chart Section -->
            <div class="flex w-full mt-4" style="width: 90%">
            <!-- Left Content Section: Area Status Clearance -->
            <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
                <!-- Bar Chart Section -->
                <div class="pt-6">
                <MonthBarChart :monthlyTotals="csagMonthlyTotals" />
                </div>
            </div>

            <!-- Right Content Section: Pie Chart -->
            <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
                <div class="py-6 grid place-items-center">
                <PieChart :provinceData="csagProvinceData" />
                </div>
            </div>
            </div>
            
            <!-- <table ref="csagTable" class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">No.</th>
                        <th scope="col" class="px-6 py-3">Names</th>
                        <th scope="col" class="px-6 py-3">Area</th>
                        <th scope="col" class="px-6 py-3">Province</th>
                        <th scope="col" class="px-6 py-3">City/Municipality</th>
                        <th scope="col" class="px-6 py-3">Barangay</th>
                        <th scope="col" class="px-6 py-3">Sitio</th>
                        <th scope="col" class="px-6 py-3">River</th>
                        <th scope="col" class="px-6 py-3" >Date Received</th>
                        <th scope="col" class="px-6 py-3">Date Released</th>
                        <th scope="col" class="px-6 py-3">Status</th>
                        <th scope="col" class="px-6 py-3">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(csag, index) in filteredCSAG" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td class="px-6 py-4">{{ index + 1 }}</td>
                        <td class="px-6 py-4">{{ csag.name }}</td>
                        <td class="px-6 py-4">{{ csag.area }}</td>
                        <td class="px-6 py-4">{{ csag.province }}</td>
                        <td class="px-6 py-4">{{ csag.city_municipality }}</td>
                        <td class="px-6 py-4">{{ csag.barangay }}</td>
                        <td class="px-6 py-4">{{ csag.sitio }}</td>
                        <td class="px-6 py-4">{{ csag.river }}</td>
                        <td class="px-6 py-4">{{ csag.received }}</td>
                        <td class="px-6 py-4">{{ formatDate(csag.released) }}</td>
                        <td class="px-6 py-4">{{ csag.status }}</td>
                        <td class="px-6 py-4">{{ csag.remarks }}</td>
                    </tr>
                </tbody>
            </table> -->
            <!-- Display the total sum -->
            <div class="flex bg-white justify-between pl-4">
            <h2 class="flex text-xl font-semibold">
                <!-- csag total -->
                Total: {{ csagTotalSum }} ({{ activeReleasedYear }})
            </h2>
            </div>
        </div>

        <div class="ml-20">
            <h2 class="text-2xl font-bold mt-10">Industrial Sand and Gravel</h2>
            <!-- Chart Section -->
            <div class="flex w-full mt-4" style="width: 90%;">
            <!-- Left Content Section: Area Status Clearance -->
            <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
                <!-- Bar Chart Section -->
                <div class="pt-6">
                <MonthBarChart :monthlyTotals="isagMonthlyTotals" />
                </div>
            </div>

            <!-- Right Content Section: Pie Chart -->
            <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
                <div class="py-6 grid place-items-center">
                <PieChart :provinceData="isagProvinceData" />
                </div>
            </div>
            </div>
            
            <!-- <table ref="isagTable" class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">No.</th>
                        <th scope="col" class="px-6 py-3">Names</th>
                        <th scope="col" class="px-6 py-3">Area</th>
                        <th scope="col" class="px-6 py-3">Province</th>
                        <th scope="col" class="px-6 py-3">City/Municipality</th>
                        <th scope="col" class="px-6 py-3">Barangay</th>
                        <th scope="col" class="px-6 py-3">Sitio</th>
                        <th scope="col" class="px-6 py-3">River</th>
                        <th scope="col" class="px-6 py-3">Date Received</th>
                        <th scope="col" class="px-6 py-3">Date Released</th>
                        <th scope="col" class="px-6 py-3">Status</th>
                        <th scope="col" class="px-6 py-3">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(isag, index) in filteredISAG" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td class="px-6 py-4">{{ index + 1 }}</td>
                        <td class="px-6 py-4">{{ isag.name }}</td>
                        <td class="px-6 py-4">{{ isag.area }}</td>
                        <td class="px-6 py-4">{{ isag.province }}</td>
                        <td class="px-6 py-4">{{ isag.city_municipality }}</td>
                        <td class="px-6 py-4">{{ isag.barangay }}</td>
                        <td class="px-6 py-4">{{ isag.sitio }}</td>
                        <td class="px-6 py-4">{{ isag.river }}</td>
                        <td class="px-6 py-4">{{ isag.received }}</td>
                        <td class="px-6 py-4">{{ formatDate(isag.released) }}</td>
                        <td class="px-6 py-4">{{ isag.status }}</td>
                        <td class="px-6 py-4">{{ isag.remarks }}</td>
                    </tr>
                </tbody>
            </table> -->
            <!-- Display the total sum -->
            <div class="flex bg-white justify-between pl-4">
            <h2 class="flex text-xl font-semibold">
                <!-- isag total -->
                Total: {{ isagTotalSum }} ({{ activeReleasedYear }})
            </h2>
            </div>
        </div>

        <div class="ml-20">
            <h2 class="text-2xl font-bold mt-10">Mountain Quarry</h2>
            <!-- Chart Section -->
            <div class="flex w-full mt-4" style="width: 90%;">
              <!-- Left Content Section: Area Status Clearance -->
              <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
                  <!-- Bar Chart Section -->
                  <div class="pt-6">
                  <MonthBarChart :monthlyTotals="quarryMonthlyTotals" />
                  </div>
              </div>

              <!-- Right Content Section: Pie Chart -->
              <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
                  <div class="py-6 grid place-items-center">
                  <PieChart :provinceData="quarryProvinceData" />
                  </div>
              </div>
            </div>
            
            <!-- <table ref="quarryTable" class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">No.</th>
                        <th scope="col" class="px-6 py-3">Names</th>
                        <th scope="col" class="px-6 py-3">Area</th>
                        <th scope="col" class="px-6 py-3">Province</th>
                        <th scope="col" class="px-6 py-3">City/Municipality</th>
                        <th scope="col" class="px-6 py-3">Barangay</th>
                        <th scope="col" class="px-6 py-3">Sitio</th>
                        <th scope="col" class="px-6 py-3">Lot No.</th>
                        <th scope="col" class="px-6 py-3">Survey No.</th>
                        <th scope="col" class="px-6 py-3">Date Received</th>
                        <th scope="col" class="px-6 py-3">Date Released</th>
                        <th scope="col" class="px-6 py-3">Status</th>
                        <th scope="col" class="px-6 py-3">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(quarry, index) in filteredQUARRY" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td class="px-6 py-4">{{ index + 1 }}</td>
                        <td class="px-6 py-4">{{ quarry.name }}</td>
                        <td class="px-6 py-4">{{ quarry.area }}</td>
                        <td class="px-6 py-4">{{ quarry.province }}</td>
                        <td class="px-6 py-4">{{ quarry.city_municipality }}</td>
                        <td class="px-6 py-4">{{ quarry.barangay }}</td>
                        <td class="px-6 py-4">{{ quarry.sitio }}</td>
                        <td class="px-6 py-4">{{ quarry.lot_no }}</td>
                        <td class="px-6 py-4">{{ quarry.survey_no }}</td>
                        <td class="px-6 py-4">{{ quarry.received }}</td>
                        <td class="px-6 py-4">{{ formatDate(quarry.released) }}</td>
                        <td class="px-6 py-4">{{ quarry.status }}</td>
                        <td class="px-6 py-4">{{ quarry.remarks }}</td>
                    </tr>
                </tbody>
            </table> -->
            <!-- Display the total sum -->
            <div class="flex bg-white justify-between pl-4">
            <h2 class="flex text-xl font-semibold">
                <!-- quarry total -->
               
                Total: {{ quarryTotalSum }} ({{ activeReleasedYear }})
            </h2>
            </div>
        </div>

        <div class="ml-20">
            <h2 class="text-2xl font-bold mt-10">SUMMARY</h2>
            <!-- Chart Section -->
            <div class="flex w-full mt-4" style="width: 90%;">
            <!-- Left Content Section: Area Status Clearance -->
            <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
                <!-- Bar Chart Section -->
                <div class="pt-6">
                <MonthBarChart :monthlyTotals="combinedMonthlyTotals" />
                </div>
            </div>

            <!-- Right Content Section: Pie Chart -->
            <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
                <div class="py-6 grid place-items-center">
                <PieChart :provinceData="combinedProvinceData" />
                </div>
            </div>
            </div>
            <!-- Display the overall total sum -->
            <div class="flex bg-white justify-between pl-4">
            <h2 class="flex text-xl font-semibold">
                <!-- CSAG+ISAG+QUARRY total -->
                Overall Total: {{ overallTotalSum }} 
            </h2>
            </div>
        </div>
    </div>
  </div>
  <div class="flex justify-center">
                <button @click="generatePDF" class="mr-4 bg-green-600 p-2 text-white font-bold rounded-lg w-24">Print</button>
  </div>
</template>

<script>
import MonthBarChart from '../../components/bymonth-barchart.vue';
import PieChart from '../../components/byprovince-piechart.vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { API_BASE_URL } from '../../config'

export default {
  components: {
    MonthBarChart,
    PieChart
  },
  data() {
  return {
    csag: [
      {
        name: '',
        area: '',
        province: '',
        city_municipality: '',
        barangay: '',
        sitio: '',
        river: '',
        received: '',
        released: '',
        status: '',
        remarks: '',
      },
    ],
    isag: [
    {
        name: '',
        area: '',
        province: '',
        city_municipality: '',
        barangay: '',
        sitio: '',
        river: '',
        received: '',
        released: '',
        status: '',
        remarks: '',
      }
    ],
    quarry: [
    {
        name: '',
        area: '',
        province: '',
        city_municipality: '',
        barangay: '',
        sitio: '',
        lot_no: '',
        survey_no: '',
        received: '',
        released: '',
        status: '',
        remarks: '',
      },
    ]
  };
},
  computed: {
    activeReleasedYear() {
      const allYears = [...this.csag, ...this.isag, ...this.quarry]
        .filter(item => item.released && !isNaN(new Date(item.released).getTime()))
        .map(item => new Date(item.released).getFullYear());

      return allYears.length ? Math.max(...allYears) : null;
    },
    filteredCSAG() {
    // return this.getFilteredAndSortedData();
    },
    filteredISAG() {
      // return this.getFilteredAndSortedData();
    },
    filteredQUARRY() {
      // return this.getFilteredAndSortedData();
    },
    year() {
      return new Date().getFullYear();
    },
    csagTotals() {
      return this.calculateTotals(this.csag);
    },
    csagTotalSum() {
      return this.csagTotals.totalSum;
    },
    csagMonthlyTotals() {
      return this.csagTotals.monthlyData;
    },
    csagProvinceData() {
      return this.csagTotals.provinceTotals;
    },
    isagTotals() {
      return this.calculateTotals(this.isag);
    },
    isagTotalSum() {
      return this.isagTotals.totalSum;
    },
    isagMonthlyTotals() {
      return this.isagTotals.monthlyData;
    },
    isagProvinceData() {
      return this.isagTotals.provinceTotals;
    },
    quarryTotals() {
      return this.calculateTotals(this.quarry);
    },
    quarryTotalSum() {
      return this.quarryTotals.totalSum;
    },
    quarryMonthlyTotals() {
      return this.quarryTotals.monthlyData;
    },
    quarryProvinceData() {
      return this.quarryTotals.provinceTotals;
    },
    overallTotalSum() {
      return this.csagTotalSum + this.isagTotalSum + this.quarryTotalSum;
    },
    combinedMonthlyTotals() {
      const combinedTotals = Array(12).fill(0);
      [this.csagMonthlyTotals, this.isagMonthlyTotals, this.quarryMonthlyTotals].forEach(monthlyTotals => {
        monthlyTotals.forEach((total, index) => {
          combinedTotals[index] += total;
        });
      });
      return combinedTotals;
    },
    combinedProvinceData() {
      const combinedData = {};
      [this.csagProvinceData, this.isagProvinceData, this.quarryProvinceData].forEach(provinceData => {
        Object.keys(provinceData).forEach(province => {
          if (!combinedData[province]) {
            combinedData[province] = 0;
          }
          combinedData[province] += provinceData[province];
        });
      });
      return combinedData;
    }
  },
  methods: {
    CSAGgetEmptyEntry() {
      return {
        name: '',
        area: '',
        province: '',
        city_municipality: '',
        barangay: '',
        sitio: '',
        river: '',
        received: '',
        released: '',
        status: '',
        remarks: '',
      };
    },
    ISAGgetEmptyEntry() {
      return {
        name: '',
        area: '',
        province: '',
        city_municipality: '',
        barangay: '',
        sitio: '',
        river: '',
        received: '',
        released: '',
        status: '',
        remarks: '',
      };
    },
    QUARRYgetEmptyEntry() {
      return {
        name: '',
        area: '',
        province: '',
        city_municipality: '',
        barangay: '',
        sitio: '',
        lot_no: '',
        survey_no: '',
        received: '',
        released: '',
        status: '',
        remarks: '',
      };
    },
    calculateTotals(dataset) {
      if (!Array.isArray(dataset) || dataset.length === 0 || !this.activeReleasedYear) {
        return { totalSum: 0, monthlyData: Array(12).fill(0), provinceTotals: {} };
      }

      const monthlyData = Array(12).fill(0);
      const provinceTotals = {};
      let totalSum = 0;

      dataset
        .filter(item => item.released && !isNaN(new Date(item.released).getTime()))
        .forEach(item => {
          const releaseDate = new Date(item.released);

          if (releaseDate.getFullYear() === this.activeReleasedYear) {
            totalSum++;
            monthlyData[releaseDate.getMonth()]++;

            if (!provinceTotals[item.province]) {
              provinceTotals[item.province] = 0;
            }
            provinceTotals[item.province]++;
          }
        });

      return { totalSum, monthlyData, provinceTotals };
    },
    fetchData(endpoint, variable) {
    axios.get(`${API_BASE_URL}/api/${endpoint}`)
      .then(response => {
        console.log(`${endpoint.toUpperCase()} data:`, response.data); // Log data
        this[variable] = response.data;
      })
      .catch(error => {
        console.error(`Error fetching ${endpoint.toUpperCase()}:`, error);
      });
    },
    fetchCSAG() {
      this.fetchData('csag', 'csag');
    },
    fetchISAG() {
      this.fetchData('isag', 'isag');
    },
    fetchQUARRY() {
      this.fetchData('quarry', 'quarry');
    },
    formatDate(date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },
    async generatePDF() {
    // Add a delay to ensure the table is fully rendered


    const tableElement = this.$refs.screen;

    const canvas = await html2canvas(tableElement);
    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imageProps = pdf.getImageProperties(imageData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width;
    pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('area-status-clearance.pdf');
  }
  },
  mounted() {
    this.fetchCSAG();
    this.fetchISAG();
    this.fetchQUARRY();
  }
};
</script>