<template>
  <div>
    <!-- Header and User Button Section -->
    <div class="flex">
      <Header />
      <UserBtn />
    </div>

    <!-- Chart Section -->
    <div class="flex w-full shadow-xl" style="margin-top: 20px ;">
      <!-- Left Content Section: Area Status Clearance -->
      <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
        <!-- Bar Chart Section -->
        <div class="pt-6">
          <MonthBarChart :monthlyTotals="combinedMonthlyTotals" />
        </div>
      </div>

      <!-- Right Content Section: Pie Chart -->
      <div class="flex flex-col bg-white text-gray-700 w-6/12 p-2">
        <div class="py-6 grid place-items-center w-full">
          <PieChart :provinceData="combinedProvinceData" />
        </div>
      </div>
    </div>
    <!-- Display the overall total sum -->
    <div class="flex bg-white justify-between items-start px-4 py-3">
      <div>
        <h2 class="text-xl font-semibold">
          There are {{ overallTotalSum }} total released Area Status Clearance for {{ activeReleasedYear || 'N/A' }}.
        </h2>

        <div class="flex flex-wrap gap-3 mt-3 text-sm font-medium">
          <span class="bg-green-100 text-green-800 px-3 py-1 rounded-lg">
            CSAG: {{ csagTotalSum }}
          </span>
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
            ISAG: {{ isagTotalSum }}
          </span>
          <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg">
            QUARRY: {{ quarryTotalSum }}
          </span>
        </div>
      </div>

      <pdf />
    </div>

    <div class="mt-8">
      <!-- Interactive Buttons and Dropdowns Section -->
      <div class="flex flex-col relative bg-white items-center p-8 mt-4 w-full">
        <div class="grid grid-cols-2 gap-8">
          <!-- Area Status Clearance Dropdown -->
          <div>
            <button
              @click="toggleDropdown('isDropdownASC')"
              class="flex items-center justify-center w-64 gap-4 text-lg mb-4 p-3 rounded-xl bg-amber-400 hover:bg-amber-100"
              :aria-expanded="isDropdownASC.toString()"
              aria-controls="area-status-dropdown"
            >
              Area Status Clearance
              <img class="w-4" src="../../assets/icons/drop-down.png" alt="dropdown-icon">
            </button>
            <div v-if="isDropdownASC" id="area-status-dropdown" class="mt-2 w-64 rounded-lg z-10 bg-amber-400 shadow-lg">
              <a
                v-for="(item, index) in areaStatusItems"
                :key="index"
                @click="openPDF(item.pdfUrl)"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100"
              >
                {{ item.label }}
              </a>
            </div>
          </div>

          <!-- Database Dropdown -->
          <div>
            <button
              @click="toggleDropdown('isDropdownDatabase')"
              class="flex justify-center items-center w-64 gap-4 text-lg mb-4 p-3 rounded-xl bg-amber-400 hover:bg-amber-100"
              :aria-expanded="isDropdownDatabase.toString()"
              aria-controls="database-dropdown"
            >
              Database
              <img class="w-4" src="../../assets/icons/drop-down.png" alt="dropdown-icon">
            </button>
            <div v-if="isDropdownDatabase" id="database-dropdown" class="mt-2 w-64 bg-amber-400 rounded-lg shadow-lg text-left">
              <a @click="MOEPValidation" class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100">MOEP Validation</a>
              <a @click="MiningTenementMaps" class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100">Mining Tenement Maps</a>

              <!-- New Dropdown under Area Status Clearance -->
              <div>
                <button
                  @click="toggleDropdown('isDropdownASCNew')"
                  class="flex justify-between items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  :aria-expanded="isDropdownASCNew.toString()"
                  aria-controls="area-status-new-dropdown"
                >
                  Area Status Clearance
                  <img class="w-4" src="../../assets/icons/drop-down.png" alt="dropdown-icon">
                </button>
                <div v-if="isDropdownASCNew" id="area-status-new-dropdown" class="mt-2 w-64 rounded-lg z-10 bg-amber-400 shadow-lg">
                  <a
                    @click="navigateTo('/mlss/CSAG')"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100"
                  >
                    CSAG
                  </a>
                  <a
                    @click="navigateTo('/mlss/ISAG')"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100"
                  >
                    ISAG
                  </a>
                  <a
                    @click="navigateTo('/mlss/MQUARRY')"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100"
                  >
                    MQUARRY
                  </a>
                </div>
              </div>
              <!-- End of New Dropdown -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header.vue';
import UserBtn from '../../components/user-dbbtn.vue';
import MonthBarChart from '../../components/bymonth-barchart.vue';
import PieChart from '../../components/byprovince-piechart.vue';
import pdf from '../../components/MLSS/pdf-generator-btn.vue';
import axios from 'axios';
import router from '../../router';
import { API_BASE_URL } from '../../config'

export default {
  components: {
    Header,
    UserBtn,
    MonthBarChart,
    PieChart,
    pdf
  },
  data() {
    return {
      isDropdownASC: false,
      isDropdownDatabase: false,
      isDropdownASCNew: false,
      areaStatusItems: [
        { label: 'C1: New No Conflict', pdfUrl: 'ASCpdf/CASE 1 - final copy.pdf' },
        { label: 'C2: Amendment', pdfUrl: 'ASCpdf/CASE 2 - final copy.pdf' },
        { label: 'C3.1: CSAG Expansion', pdfUrl: 'ASCpdf/CASE 3.1 - CSAG copy.pdf' },
        { label: 'C3.1: QUARRY Expansion', pdfUrl: 'ASCpdf/CASE 3.1 - QUARRY copy.pdf' },
        { label: 'C3.2: Reduction', pdfUrl: 'ASCpdf/CASE 3.2 - final copy.pdf' },
        { label: 'C4: Downgrade/Upgrade', pdfUrl: 'ASCpdf/CASE 4 - final copy.pdf' },
        { label: 'C5: Change Name', pdfUrl: 'ASCpdf/CASE 5 - final copy.pdf' },
        { label: 'C6: Change Barangay Location', pdfUrl: 'ASCpdf/CASE 6 - final copy.pdf' },
        { label: 'C7: Within No-Go-Zone SAFDZ ARC', pdfUrl: 'ASCpdf/CASE 7 - final copy.pdf' },
        { label: 'C8: Conflict Denied', pdfUrl: 'ASCpdf/CASE 8 - final copy.pdf' },
        { label: 'C9: Not Conforming along River', pdfUrl: 'ASCpdf/CASE 9 - final copy.pdf' },
        { label: 'C10: Inconsistent Tie Line', pdfUrl: 'ASCpdf/CASE 10 - final copy.pdf' },
        { label: 'C11: Inconsistent Tie Line', pdfUrl: 'ASCpdf/CASE 11 - final copy.pdf' },
      ],
      areaStatusNewItems: [
        { label: 'CSAG', route: '/mlss/CSAG' },
        { label: 'ISAG', route: '/mlss/ISAG' },
        { label: 'MQUARRY', route: '/mlss/MQUARRY' },
      ],
      csag: [],
      isag: [],
      quarry: [],
    };
  },
  computed: {
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

    year() {
      return new Date().getFullYear();
    },

    overallTotalSum() {
      return this.csagTotalSum + this.isagTotalSum + this.quarryTotalSum;
    },
    activeReleasedYear() {
      const allYears = [...this.csag, ...this.isag, ...this.quarry]
        .filter(item => item.released && !isNaN(new Date(item.released).getTime()))
        .map(item => new Date(item.released).getFullYear());

      return allYears.length ? Math.max(...allYears) : null;
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
    },
  },
  methods: {
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
    toggleDropdown(dropdown) {
      this[dropdown] = !this[dropdown];
    },
    openPDF(pdfUrl) {
      window.open(window.location.origin + "/" + pdfUrl, '_blank');
    },
    navigateTo(route) {
      router.push(route);
    },
    MOEPValidation() {
      router.push('/mlss/MOEPV');
    },
    MiningTenementMaps() {
      router.push('/mlss/MTM');
    },
    fetchData(endpoint, variable) {
      axios.get(`${API_BASE_URL}/api/${endpoint}`)
        .then(response => {
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
    }
  },
  mounted() {
    this.fetchCSAG();
    this.fetchISAG();
    this.fetchQUARRY();
  },
};
</script>
