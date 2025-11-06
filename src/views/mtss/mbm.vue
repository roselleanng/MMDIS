<template>
    <div>
      <!-- Header and User Button Section -->
      <div class="flex">
        <Header />
        <UserBtn />
      </div>
  
      <!-- Title Section -->
      <div class="flex flex-col mt-18 justify-center font-bold text-center">
        <h1 class="text-4xl">Minahang Bayan Monitoring</h1>
      </div>
  
      <!-- Chart Section -->
      <div class="flex w-full shadow-xl justify-center mt-2">
        <div class="flex flex-col bg-white text-gray-700 w-6/12 p-4 ">
          <!-- Bar Chart Section -->
          <div class="pt-6">
            <MonthBarChart :monthlyTotals="monthlyTotals" />
          </div>
        </div>
      </div>

    <!-- Total Sum Section -->
    <div class="flex bg-white justify-between pl-4 pt-4">
      <h2 class="flex text-xl font-semibold">
        There are {{ totalSum }} total sum of released Minahang Bayan Monitoring Reports.
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
          <input v-model="searchQuery" @input="debouncedSearch" type="search" id="default-search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search month, petitioner, and location of declared Minahang Bayan ..." required />
        </div>
        <!-- Add Button -->
        <AddBtn @click="showModal = true" />
      </div>
  
      <!-- Table Section -->
      <div class="mt-8">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3" @click="sortByDate('month')">
                Month
                <span v-if="sortKey === 'month'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
              </th>
              <th scope="col" class="px-6 py-3">
                No
              </th>
              <th scope="col" class="px-6 py-3"  style="width: 330px;">Petitioner</th>
              <th scope="col" class="px-6 py-3" style="width: 310px;" @click="sortByDate('location')">
                Location of Declared Minahang Bayan
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
              <th scope="col" class="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in filteredEntries" :key="entry.ID" class="bg-white border-b">
              <td class="px-6 py-4">{{ entry.month }}</td>
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4" style="word-wrap:break-word;">{{ entry.petitioner }}</td>
              <td class="px-6 py-4" style="word-wrap:break-word;">{{ entry.location }}</td>
              <td class="px-6 py-4">{{ entry.travel_date_from }} to {{ entry.travel_date_to }}</td>
              <td class="px-6 py-4">{{ entry.report_date }}</td>
              <td class="px-6 py-4">{{ entry.transmittal_date }}</td>
              <td class="px-6 py-4">{{ entry.released_date }}</td>
              <td class="px-6 py-4">{{ entry.mmd_personnel }}</td>
              <td class="px-6 py-4 text-center">
                <button @click="openPDF(entry.MOVpdf)" class="bg-red-500 text-white px-2 py-1 rounded">View</button>
              </td>
              <td class="px-6 py-4 flex" style="margin-top: 10px;">
                <button @click="openJPEG(entry.map)" class=" pr-2 rounded"><img src="../../assets/icons/map.png" style="width: 30px;"></button>
                <button @click="openUpdateModal(entry.ID)" class="rounded"><img src="../../assets/icons/edit.png" style="width: 25px;"></button> 
                <button @click="deleteEntry(entry.ID)" class="bg-grey-100 text-white px-2 py-1 rounded "><img src="../../assets/icons/remove.png" style="width: 20px;"></button>
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
                    <p class="mr-5">Petitioner:</p>
                    <input v-model="newEntry.petitioner" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Location of Declared Minahang Bayan:</p>
                    <input v-model="newEntry.location" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
                    <p class="mr-5">MOV (.pdf):</p>
                    <input type="file" ref="MOVpdf" accept=".pdf" class="bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Map (.jpg):</p>
                    <input type="file" ref="map" accept=".jpg" class="bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="showModal = false" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
              <!-- Add request button -->
              <button @click="submitEntry" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                Add
              </button>
            </div>
          
          </div>
        </div>
      </div>

      <!-- Update Modal -->
      <div v-if="isUpdateModalOpen" class="fixed inset-0 overflow-y-auto" aria-modal="true" role="dialog">
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
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div class="mt-2 flex justify-between items-center">
                    <label for="month" class="mr-5">Month:</label>
                    <select v-model="updateEntry.month" id="month" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
                  <div class="mt-2 flex justify-between items-center">
                    <label for="petitioner" class="mr-5">Petitioner:</label>
                    <input v-model="updateEntry.petitioner" id="petitioner" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <label for="location" class="mr-5">Location of Declared Minahang Bayan:</label>
                    <input v-model="updateEntry.location" id="location" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <label class="mr-5">Travel Date:</label>
                    <input v-model="updateEntry.travel_date_from" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <span class="mx-2">to</span>
                    <input v-model="updateEntry.travel_date_to" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <label for="report_date" class="mr-5">Report Date:</label>
                    <input v-model="updateEntry.report_date" id="report_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <label for="transmittal_date" class="mr-5">Transmittal Date:</label>
                    <input v-model="updateEntry.transmittal_date" id="transmittal_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <label for="released_date" class="mr-5">Released Date:</label>
                    <input v-model="updateEntry.released_date" id="released_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <label for="mmd_personnel" class="mr-5">MMD Personnel:</label>
                    <input v-model="updateEntry.mmd_personnel" id="mmd_personnel" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <label for="MOVpdf" class="mr-5">MOV (.pdf):</label>
                    <input type="file" ref="MOVpdf" id="MOVpdf" accept="application/pdf" @change="handleFileUpload" class="bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between items-center">
                    <label for="map" class="mr-5">Map (.jpg):</label>
                    <input type="file" ref="map" id="map" accept="image/jpeg" @change="handleFileUpload" class="bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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

    </div>
  </template>

<script>
import Header from '../../components/header.vue'; 
import AddBtn from '../../components/MTSS/add-btn.vue'; 
import UserBtn from '../../components/user-dbbtn.vue'; 
import MonthBarChart from '../../components/bymonth-barchart.vue';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { API_BASE_URL } from '../../config'

export default {
  components: { Header, UserBtn, AddBtn, MonthBarChart },
  data() {
    return {
      searchQuery: '',
      entries: [], // Assuming entries will be fetched from the API
      showModal: false,
      newEntry: this.getEmptyEntry(),
      sortKey: '',
      sortOrder: 'asc',
      isUpdateModalOpen: false, // State to track if the update modal is open
      updateEntry: this.getEmptyEntry(), // Object to store the entry being updated
      file: null
    };
  },
  computed: {
    filteredEntries() {
      let entries = this.entries;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        entries = entries.filter(entry =>
          entry.month.toLowerCase().includes(query) ||
          entry.petitioner.toLowerCase().includes(query) ||
          entry.location.toLowerCase().includes(query) ||
          Object.values(entry).some(val => String(val).toLowerCase().includes(query))
        );
      }

      if (this.sortKey) {
        entries = entries.slice().sort((a, b) => {
          let aValue = a[this.sortKey];
          let bValue = b[this.sortKey];

          if (this.sortKey === 'released_date' || this.sortKey === 'report_date' || this.sortKey === 'transmittal_date') {
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

      return entries;
    },
    // Method to get the total count of entries for the latest year
    totalSum() {
      if (!this.entries.length) return 0; // Check if entries is empty
      
      // Find the latest year from the dataset
      const latestYear = Math.max(...this.entries.map(item => {
        const year = new Date(item.released_date).getFullYear();
        return isNaN(year) ? 0 : year; // Handle invalid dates
      }));
      
      // Filter dataset for the latest year and count the entries
      const count = this.entries.filter(entries => new Date(entries.released_date).getFullYear() === latestYear).length;
      console.log('Total Count for Latest Year:', count); // Log the total count
      
      return count;
    },

    monthlyTotals() {
      // Extract the latest year from the dataset
      const latestYear = Math.max(...(this.entries || []).map(item => {
        const date = new Date(item.released_date);
        return isNaN(date.getTime()) ? 0 : date.getFullYear(); // Handle invalid dates
      }));

      // Initialize an array for 12 months
      const monthlyData = Array(12).fill(0);

      // Populate the monthlyData array
      (this.entries || []).forEach(entry => {
        const releaseDate = new Date(entry.released_date);
        if (releaseDate.getFullYear() === latestYear && !isNaN(releaseDate.getTime())) {
          const month = releaseDate.getMonth(); // 0 = January, 11 = December
          monthlyData[month]++;
        }
      });

      return monthlyData;
    },

    year() {
      return new Date().getFullYear();
    }
  },
  methods: {

    getEmptyEntry() {
      return {
        ID: '',
        month: '',
        petitioner: '',
        location: '',
        travel_date_from: '',
        travel_date_to: '',
        report_date: '',
        transmittal_date: '',
        released_date: '',
        mmd_personnel: '',
        MOVpdf: '',
        map: ''
      };
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
    openJPEG(jpgPath) {
      const index = jpgPath.indexOf('/');
      const jpgFinalPath = jpgPath.slice(index + 1);
      const url = `${API_BASE_URL}/storage/${jpgFinalPath}`;
      if (jpgPath) {
        window.open(url, '_blank');
      } else {
        console.error('JPG URL not found');
      }
    },
    sortByDate(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    fetchMB() {
      axios.get(`${API_BASE_URL}/api/MonitoringMB`).then(response => {
        this.entries = response.data;
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    },
    submitEntry() {
      const formData = new FormData();
      formData.append('month', this.newEntry.month);
      formData.append('petitioner', this.newEntry.petitioner);
      formData.append('location', this.newEntry.location);
      formData.append('travel_date_from', this.newEntry.travel_date_from);
      formData.append('travel_date_to', this.newEntry.travel_date_to);
      formData.append('report_date', this.newEntry.report_date);
      formData.append('transmittal_date', this.newEntry.transmittal_date);
      formData.append('released_date', this.newEntry.released_date);
      
      const fileInput = this.$refs.MOVpdf.files[0] || null; // Use null if no file is selected
      if (fileInput) {
        if (fileInput.size > 5 * 1024 * 1024) { // 5MB limit
          alert('File size exceeds 5MB.');
          return;
        }
        formData.append('MOVpdf', fileInput);
      }
      
      const jpg = this.$refs.map.files[0] || null; // Use null if no file is selected
      if (jpg) {
        if (jpg.size > 5 * 1024 * 1024) { // 5MB limit
          alert('File size exceeds 5MB.');
          return;
        }
        formData.append('map', jpg);
      }

      axios.post(`${API_BASE_URL}/api/MonitoringMB`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(() => {
        this.showModal = false;
        this.fetchMB();
      }).catch(error => {
        console.error('Error submitting entry:', error);
      });
    },
    deleteEntry(entryID) {
      // Confirm deletion
      if (confirm('Are you sure you want to delete this entry?')) {
        axios.delete(`${API_BASE_URL}/api/MonitoringMB/${entryID}`)
          .then(response => {
            // Remove the entry from the local array
            this.entries = this.entries.filter(entry => entry.ID !== entryID);
            alert('Entry deleted successfully!');
          })
          .catch(error => {
            console.error('Error deleting entry:', error);
            alert('Failed to delete the entry.');
          });
      }
    },
    openUpdateModal(thisID) {
      const entry = this.entries.find(entry => entry.ID === thisID); // Find the entry to be updated by its number
      if (entry) {
        this.updateEntry = { ...entry }; // Copy the entry data to `updateEntry`
        this.isUpdateModalOpen = true; // Open the update modal
      }
    },

    closeModal() {
      this.isUpdateModalOpen = false; 
      this.updateEntry = this.getEmptyEntry();
    },

// Method to handle file upload (assuming separate inputs for PDF and map)
handleFileUpload(event, fileType) {
  if (fileType === 'MOVpdf') {
    this.MOVpdf = event.target.files[0];
  } else if (fileType === 'map') {
    this.map = event.target.files[0];
  }
},

// Method to handle the update process
async handleUpdate() {
  console.log(this.MOVpdf, this.map);

  // Check if the PDF file exists and validate it
  if (this.MOVpdf) {
    if (this.MOVpdf.size > 5 * 1024 * 1024) {
      alert('MOVpdf file size exceeds 5MB.');
      return;
    }
    if (this.MOVpdf.type !== 'application/pdf') {
      alert('Only PDF files are allowed for MOVpdf.');
      return;
    }
  }

  // Check if the map file exists and validate it
  if (this.map) {
    if (this.map.size > 5 * 1024 * 1024) {
      alert('Map file size exceeds 5MB.');
      return;
    }
    if (this.map.type !== 'image/jpeg') {
      alert('Only JPG files are allowed for the map.');
      return;
    }
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('month', this.updateEntry.month);
  formData.append('petitioner', this.updateEntry.petitioner);
  formData.append('location', this.updateEntry.location);
  formData.append('travel_date_from', this.updateEntry.travel_date_from);
  formData.append('travel_date_to', this.updateEntry.travel_date_to);
  formData.append('report_date', this.updateEntry.report_date);
  formData.append('transmittal_date', this.updateEntry.transmittal_date);
  formData.append('released_date', this.updateEntry.released_date);

  // Append files if they exist
  if (this.MOVpdfFile) {
    formData.append('MOVpdf', this.MOVpdfFile);
  }
  if (this.mapFile) {
    formData.append('map', this.mapFile);
  }

  // Axios POST request
  axios.post(`${API_BASE_URL}/api/MonitoringMB/${this.updateEntry.ID}`, formData)
    .then(response => {
      const index = this.entries.findIndex(entry => entry.ID === this.updateEntry.ID);
      if (index !== -1) {
        this.entries[index] = response.data; // Update the entry with new data
      }
      this.closeModal(); // Close the modal after successful update
      alert('Entry updated successfully!');
    })
    .catch(error => {
      console.error('Error updating entry:', error);
      alert('Failed to update the entry.');
    });
},

    debouncedSearch: debounce(function () {
      this.fetchMB();
    }, 300)
  },
  mounted() {
    this.fetchMB();
  }
};
</script>
