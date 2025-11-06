<template>
  <div>
    <!-- Header and User Button Section -->
    <div class="flex">
      <Header />
      <UserBtn />
    </div>

    <!-- Title Section -->
    <div class="flex flex-col mt-18 justify-center font-bold text-center">
      <h1 class="text-4xl">Inventory</h1>
    </div>

    <!-- Chart Section -->
    <div class="flex w-full shadow-xl mt-2">
      <!-- Left Content Section: Area Status Clearance -->
      <div class="flex flex-col bg-white text-gray-700 w-6/12 pl-8 ">
        <!-- Bar Chart Section -->
        <div class="pt-6">
          <MonthBarChart :monthlyTotals="monthlyTotals" />
        </div>
      </div>

      <!-- Right Content Section: Pie Chart -->
      <div class="flex flex-col bg-white text-gray-700 w-6/12 pl-4">
        <div class="py-6 grid place-items-center">
          <PieChart :provinceData="provinceData" />
        </div>
      </div>
    </div>

    <!-- Total Sum Section -->
    <div class="flex bg-white justify-between pl-4">
      <h2 class="flex text-xl font-semibold">
        There are {{ totalSum }} total sum of released Inventory Reports.
      </h2>
    </div>

    <!-- Search and Add Section -->
    <div class="flex justify-between mt-8">
      <!-- Search Input Container -->
      <div class="flex w-2/5 ml-2">
        <!-- Search Icon -->
        <div class="flex items-center bg-blue-100 rounded-l-lg px-3 pointer-events-none">
          <svg class="w-8 h-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <!-- Search Input Field -->
        <input v-model="searchQuery" @input="debouncedSearch" type="search" id="default-search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search month and location ..." required />
      </div>
      <!-- Add Button -->
      <AddBtn @click="showModal = true" />
    </div>

    <!-- Table Section -->
    <div class="mt-8">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('month')">
              Month
              <span v-if="sortKey === 'month'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3">No.</th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('location')">
              Location
              <span v-if="sortKey === 'location'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3">
              Travel Date
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('report_date')">
              Report Date
              <span v-if="sortKey === 'report_date'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('transmittal_date')">
              Transmittal Date
              <span v-if="sortKey === 'transmittal_date'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('released_date')">
              Released Date
              <span v-if="sortKey === 'released_date'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3">MMD Personnel</th>
            <th scope="col" class="px-6 py-3 text-center">Proof of MOV Uploaded</th>
            <th scope="col" class="px-6 py-3 flex justify-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in filteredEntries" :key="entry.id" class="bg-white border-b">
            <td class="px-6 py-4">{{ entry.month }}</td>
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4">{{ entry.location }}</td>
            <td class="px-6 py-4">{{ entry.travel_date_from }} to {{ entry.travel_date_to }}</td>
            <td class="px-6 py-4">{{ entry.report_date }}</td>
            <td class="px-6 py-4">{{ entry.transmittal_date }}</td>
            <td class="px-6 py-4">{{ entry.released_date }}</td>
            <td class="px-6 py-4">{{ entry.mmd_personnel }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="openPDF(entry.MOVpdf)" class="bg-red-500 text-white px-2 py-1 rounded">View</button>
            </td>
            <td class="px-6 py-4 flex justify-center">
              <button @click="openUpdateModal(entry.id)" class="bg-grey-100 text-white px-2 py-1 rounded"><img src="../../assets/icons/edit.png" style="width: 25px;"></button>
              <button @click="deleteEntry(entry.id)" class="bg-grey-100 text-white px-2 py-1 rounded "><img src="../../assets/icons/remove.png" style="width: 20px;"></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredEntries.length === 0" class="text-center mt-4 text-gray-600">
        No results found.
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <!-- Modal content -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Month:</p>
                    <select v-model="newEntry.month" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>JANUARY</option>
                      <option>FEBRUARY</option>
                      <option>MARCH</option>
                      <option>APRIL</option>
                      <option>MAY</option>
                      <option>JUNE</option>
                      <option>JULY</option>
                      <option>AUGUST</option>
                      <option>SEPTEMBER</option>
                      <option>OCTOBER</option>
                      <option>NOVEMBER</option>
                      <option>DECEMBER</option>
                    </select>
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Location:</p>
                    <select v-model="newEntry.location" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>BUKIDNON</option>
                      <option>CAMUIGUIN</option>
                      <option>LANAO DEL NORTE</option>
                      <option>MISAMIS OCCIDENTAL</option>
                      <option>MISAMIS ORIENTAL</option>
                      <option>CAGAYAN DE ORO CITY</option>
                      <option>ILIGAN CITY</option>
                    </select>
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Travel Date:</p>
                    <input v-model="newEntry.travel_date_from" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <p class="">to</p>
                    <input v-model="newEntry.travel_date_to" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Report Date:</p>
                    <input v-model="newEntry.report_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Transmittal Date:</p>
                    <input v-model="newEntry.transmittal_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Released Date:</p>
                    <input v-model="newEntry.released_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">MMD Personnel:</p>
                    <input v-model="newEntry.mmd_personnel" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Proof of MOV:</p>
                    <input ref="MOVpdf" type="file" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal footer -->
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="showModal = false" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
              <!-- Add request button -->
              <button @click="addNewEntry" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- End Modal -->

      <!-- This is the modal for update method -->
      <div v-if="isUpdateModalOpen" class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <!-- Modal content -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <form @submit.prevent="handleUpdate" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Month:</p>
                    <select v-model="updateEntry.month" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>JANUARY</option>
                      <option>FEBRUARY</option>
                      <option>MARCH</option>
                      <option>APRIL</option>
                      <option>MAY</option>
                      <option>JUNE</option>
                      <option>JULY</option>
                      <option>AUGUST</option>
                      <option>SEPTEMBER</option>
                      <option>OCTOBER</option>
                      <option>NOVEMBER</option>
                      <option>DECEMBER</option>
                    </select>
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Location:</p>
                    <select v-model="updateEntry.location" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>BUKIDNON</option>
                      <option>CAMUIGUIN</option>
                      <option>LANAO DEL NORTE</option>
                      <option>MISAMIS OCCIDENTAL</option>
                      <option>MISAMIS ORIENTAL</option>
                      <option>CAGAYAN DE ORO CITY</option>
                      <option>ILIGAN CITY</option>
                    </select>
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Travel Date:</p>
                    <input v-model="updateEntry.travel_date_from" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <p class="">to</p>
                    <input v-model="updateEntry.travel_date_to" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Report Date:</p>
                    <input v-model="updateEntry.report_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Transmittal Date:</p>
                    <input v-model="updateEntry.transmittal_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Released Date:</p>
                    <input v-model="updateEntry.released_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">MMD Personnel:</p>
                    <input v-model="updateEntry.mmd_personnel" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Proof of MOV:</p>
                    <input ref="MOVpdf" type="file" accept="application/pdf" @change="handleFileUpload" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="closeModal" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
              <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- End Modal -->
    </div>
</template>

<script>
import Header from '../../components/header.vue'; 
import AddBtn from '../../components/MTSS/add-btn.vue'; 
import UserBtn from '../../components/user-dbbtn.vue'; 
import MonthBarChart from '../../components/bymonth-barchart.vue';
import PieChart from '../../components/byprovince-piechart.vue';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { API_BASE_URL } from '../../config'

export default {
  components: {
    Header,
    AddBtn,
    UserBtn,
    MonthBarChart,
    PieChart
  },
  data() {
    return {
      inventory: [],
      searchQuery: '',
      sortKey: '',
      sortOrder: 'asc',
      showModal: false,
      newEntry: this.getEmptyEntry(),
      isUpdateModalOpen: false, // State to track if the update modal is open
      updateEntry: this.getEmptyEntry(), // Object to store the entry being updated
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      file: null
    };
  },
  computed: {
    filteredEntries() {
      return this.getFilteredAndSortedData();
    },
    totalSum() {
    const latestYear = Math.max(...this.inventory.map(item => new Date(item.released_date).getFullYear()));
    return this.inventory
      .filter(inventory => new Date(inventory.released_date).getFullYear() === latestYear)
      .length;
    },
    monthlyTotals() {
      const latestYear = Math.max(...(this.inventory || []).map(item => new Date(item.released_date).getFullYear()));
      const monthlyData = Array(12).fill(0); // Initialize an array for 12 months

      (this.inventory || []).forEach(entry => {
        const releaseDate = new Date(entry.released_date);
        if (releaseDate.getFullYear() === latestYear) {
          const month = releaseDate.getMonth(); // 0 = January, 11 = December
          monthlyData[month]++;
        }
      });

      return monthlyData;
    },
    provinceData() {
      const latestYear = Math.max(...this.inventory.map(item => new Date(item.released_date).getFullYear()));
      const provinceTotals = {};

      this.inventory.forEach(inventory => {
        const Year = new Date(inventory.released_date);
        if (Year.getFullYear() === latestYear) {
          if (!provinceTotals[inventory.location]) {
            provinceTotals[inventory.location] = 0;
          }
          provinceTotals[inventory.location]++;
        }
      });

      return provinceTotals;
    },
    year() {
      return new Date().getFullYear();
    }
  },
  methods: {
    getEmptyEntry() {
      return {
        id: '',
        month: '',
        location: '',
        travel_date_from: '',
        travel_date_to: '',
        report_date: '',
        transmittal_date: '',
        released_date: '',
        mmd_personnel: '',
        MOVpdf: null,
      };
    },
    fetchInventory() {
      axios.get(`${API_BASE_URL}/api/MonitoringInventory`)
        .then(response => {
          this.inventory = response.data;
        })
        .catch(error => {
          console.error('Error fetching inventory:', error);
        });
    },
    addNewEntry() {
      const fileInput = this.$refs.MOVpdf.files[0] || null; // Use null if no file is selected

      if (fileInput && fileInput.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size exceeds 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('month', this.newEntry.month);
      formData.append('location', this.newEntry.location);
      formData.append('travel_date_from', this.newEntry.travel_date_from);
      formData.append('travel_date_to', this.newEntry.travel_date_to);
      formData.append('report_date', this.newEntry.report_date);
      formData.append('transmittal_date', this.newEntry.transmittal_date);
      formData.append('released_date', this.newEntry.released_date);
      formData.append('mmd_personnel', this.newEntry.mmd_personnel);
      if (fileInput) {
        formData.append('MOVpdf', fileInput);
      }

      axios.post(`${API_BASE_URL}/api/MonitoringInventory`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        this.inventory.push(response.data);
        this.clearNewEntry();
      })
      .catch(error => {
        console.error('Error adding entry:', error.response ? error.response.data : error.message);
      });
    },
    clearNewEntry() {
      this.newEntry = this.getEmptyEntry();
      this.showModal = false;
    },
    debouncedSearch: debounce(function() {
      this.searchData();
    }, 300),
    searchData() {
      // Trigger re-computation of filteredEntries
      this.filteredEntries;
    },
    sortByDate(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    getFilteredAndSortedData() {
      const query = this.searchQuery.toLowerCase();
      const filtered = this.inventory.filter(entry =>
        Object.values(entry).some(val => 
          String(val).toLowerCase().includes(query)
        )
      );

    if (this.sortKey) {
    filtered.sort((a, b) => {
      let aValue = a[this.sortKey];
      let bValue = b[this.sortKey];

      if (this.sortKey === 'released' || this.sortKey === 'received') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

      return filtered;
    },
    openPDF(pdfPath) {
      const index = pdfPath.indexOf('/');
      const pdfFinalPath = pdfPath.slice(index + 1);
      const url = `${API_BASE_URL}/storage/${pdfFinalPath}`;
      if (pdfPath) {
        window.open(url, '_blank');
      } else {
        console.error('PDF URL not found');
      }
    },

    deleteEntry(id) {
      if (!confirm('Are you sure you want to delete this entry?')) {
        return;
      }

      axios.delete(`${API_BASE_URL}/api/MonitoringInventory/${id}`)
        .then(response => {
          // Filter out the deleted entry from the inventory array
          this.inventory = this.inventory.filter(entry => entry.id !== id);
          alert('Entry deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete the entry. Please try again.');
        });
    },

    openUpdateModal(thisID) {
      const entry = this.inventory.find(entry => entry.id === thisID); // Find the entry to be updated by its number
      if (entry) {
        this.updateEntry = { ...entry }; // Copy the entry data to `updateEntry`
        this.isUpdateModalOpen = true; // Open the update modal
      }
    },

    closeModal() {
      this.isUpdateModalOpen = false; 
      this.updateEntry = this.getEmptyEntry();
    },
    //
    //
    //
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    // Method to handle the update process
    async handleUpdate() {
      console.log(this.file)

      if (this.file && this.file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB.');
        return;
      }

      if (this.file) {
    // Validate file type
    if (this.file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }}

      // const formData = this.updateEntry;
      const formData = new FormData();
      formData.append('month', this.updateEntry.month);
      formData.append('location', this.updateEntry.location);
      formData.append('travel_date_from', this.updateEntry.travel_date_from);
      formData.append('travel_date_to', this.updateEntry.travel_date_to);
      formData.append('report_date', this.updateEntry.report_date);
      formData.append('transmittal_date', this.updateEntry.transmittal_date);
      formData.append('released_date', this.updateEntry.released_date);
      formData.append('mmd_personnel', this.updateEntry.mmd_personnel);

    // Append file if it exists
    if (this.file) {
      formData.append('MOVpdf', this.file);
    }

    axios.post(`${API_BASE_URL}/api/MonitoringInventory/${this.updateEntry.id}`, formData)
    .then(response => {
      const index = this.inventory.findIndex(entry => entry.id === this.updateEntry.id);
      if (index !== -1) {
        this.inventory[index] = response.data; // Directly assign the updated data to the entry in the array
      }
      this.closeModal(); // Close the modal after successful update
      alert('Entry updated successfully!');
    })
    .catch(error => {
      console.error('Error updating entry:', error);
      alert('Failed to update the entry.');
    });
    },
  },
  mounted() {
    this.fetchInventory();
  },
};
</script>
