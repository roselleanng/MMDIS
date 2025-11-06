<template>
    <div>
      <!-- Header and User Button Section -->
      <div class="flex">
        <Header />
        <UserBtn />
      </div>
  
      <!-- Title Section -->
      <div class="flex flex-col mt-18 justify-center font-bold text-center">
        <h1 class="text-4xl">Work Program Monitoring</h1>
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
        There are {{ totalSum }} total sum of released Work Program Monitoring Reports.
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
        <input v-model="searchQuery" @input="debouncedSearch" type="search" id="default-search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search month, client, or mmd personnel ..." required />
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
              <th scope="col" class="px-6 py-3">Work Program | Term and Conditions | Requirements of: (Field Monitoring)</th>
              <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('travel_date')">
                Travel Date
                <span v-if="sortKey === 'travel_date'" aria-label="Sorted ascending">
                  <template v-if="sortOrder === 'asc'">▲</template>
                  <template v-else>▼</template>
                </span>
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
            <tr v-for="(entry, index) in filteredEntries" :key="entry.ID" class="bg-white border-b">
              <td class="px-6 py-4">{{ entry.month }}</td>
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4" style="width: 300px;">{{ entry.text_field }}</td>
              <td class="px-6 py-4">{{ entry.travel_date_from }} to {{ entry.travel_date_to }}</td>
              <td class="px-6 py-4">{{ entry.report_date }}</td>
              <td class="px-6 py-4">{{ entry.transmittal_date }}</td>
              <td class="px-6 py-4">{{ entry.released_date }}</td>
              <td class="px-6 py-4">{{ entry.mmd_personnel }}</td>
              <td class="px-6 py-4 text-center">
                <button @click="openPDF(entry.MOVpdf)" class="bg-red-500 text-white px-2 py-1 rounded">View</button>
              </td>
              <td class="px-6 py-4 flex justify-center">
              <!-- edit entry -->
              <button @click="openUpdateModal(entry.ID)" class="bg-grey-100 text-white px-2 py-1 rounded"><img src="../../assets/icons/edit.png" style="width: 25px;"></button> 
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
                    <p class="mr-5">Select Month:</p>
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
                  <div class="mt-2 flex flex-col">
                    <label for="text_field" class="text-gray-700">Work Program | Term and Conditions | Requirements of: (Field Monitoring)</label>
                    <textarea v-model="newEntry.text_field" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
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

      <!-- Update Modal -->
      <div v-if="isUpdateModalOpen" class="fixed inset-0 overflow-y-auto" aria-modal="true" role="dialog">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <!-- Modal content -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <form @submit.prevent="handleUpdate" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Select Month:</p>
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
                  <div class="mt-2 flex flex-col">
                    <label for="text_field" class="text-gray-700">Work Program | Term and Conditions | Requirements of: (Field Monitoring)</label>
                    <textarea v-model="updateEntry.text_field" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Travel Date:</p>
                    <input v-model="updateEntry.travel_date_from" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <p>to</p>
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
      wpm: [],
      searchQuery: '',
      sortKey: '',
      sortOrder: 'asc',
      showModal: false,
      newEntry: this.getEmptyEntry(),
      isUpdateModalOpen: false,
      updateEntry: this.getEmptyEntry(),
      debouncedSearch: debounce(this.search, 300),
      //
      //
      file: null 
    };
  },

  computed: {
    filteredEntries() {
      return this.getFilteredAndSortedData();
    },

    totalSum() {
      if (!this.wpm.length) return 0; 
      
      const latestYear = Math.max(...this.wpm.map(item => {
        const year = new Date(item.released_date).getFullYear();
        return isNaN(year) ? 0 : year; 
      }));
      
      const count = this.wpm.filter(wpm => new Date(wpm.released_date).getFullYear() === latestYear).length;
      console.log('Total Count for Latest Year:', count); // Log the total count
      
      return count;
    },

    monthlyTotals() {
      const latestYear = Math.max(...(this.wpm || []).map(item => {
        const date = new Date(item.released_date);
        return isNaN(date.getTime()) ? 0 : date.getFullYear(); // Handle invalid dates
      }));

      const monthlyData = Array(12).fill(0);

      (this.wpm || []).forEach(entry => {
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
        month: '',
        text_field: '',
        travel_date_from: '',
        travel_date_to: '',
        report_date: '',
        transmittal_date: '',
        released_date: '',
        mmd_personnel: '',
        MOVpdf: '',
      };
    },

    fetchWPM() {
      axios.get(`${API_BASE_URL}/api/MonitoringWPM`)
        .then(response => {
          this.wpm = response.data;
        })
        .catch(error => {
          console.error('Error fetching WPM:', error);
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
      formData.append('text_field', this.newEntry.text_field);
      formData.append('travel_date_from', this.newEntry.travel_date_from);
      formData.append('travel_date_to', this.newEntry.travel_date_to);
      formData.append('report_date', this.newEntry.report_date);
      formData.append('transmittal_date', this.newEntry.transmittal_date);
      formData.append('released_date', this.newEntry.released_date);
      formData.append('mmd_personnel', this.newEntry.mmd_personnel);
      if (fileInput) {
        formData.append('MOVpdf', fileInput);
      }

      axios.post(`${API_BASE_URL}/api/MonitoringWPM`, formData)
        .then(response => {
          this.wpm.push(response.data);
          this.showModal = false;
          this.newEntry = this.getEmptyEntry();
          alert('Entry added successfully!');
        })
        .catch(error => {
          console.error('Error adding new entry:', error);
          alert('Some fields are required!');
        });
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

    search() {
      axios.get(`${API_BASE_URL}/api/MonitoringWPM/search?query=${this.searchQuery}`)
        .then(response => {
          this.wpm = response.data;
        })
        .catch(error => {
          console.error('Error searching for monitoringWPM:', error);
        });
    },

    getFilteredAndSortedData() {
      const query = this.searchQuery.toLowerCase();
      let filteredData = this.wpm.filter(entry =>
        entry.month.toLowerCase().includes(query) ||
        entry.text_field.toLowerCase().includes(query) ||
        entry.mmd_personnel.toLowerCase().includes(query)
      );

      if (this.sortKey) {
        filteredData.sort((a, b) => {
          const valA = a[this.sortKey];
          const valB = b[this.sortKey];
          if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return filteredData;
    },

    debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },
    deleteEntry(ID) {
      if (!confirm('Are you sure you want to delete this entry?')) {
        return;
      }

      axios.delete(`${API_BASE_URL}/api/MonitoringWPM/${ID}`)
        .then(response => {
          this.wpm = this.wpm.filter(entry => entry.ID !== ID);
          alert('Entry deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete the entry. Please try again.');
        });
    },

    openUpdateModal(thisID) {
      const entry = this.wpm.find(entry => entry.ID === thisID);
      if (entry) {
        this.updateEntry = { ...entry };
        this.isUpdateModalOpen = true;
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

    async handleUpdate() {
  console.log(this.file);

  // Validate file size
  if (this.file && this.file.size > 5 * 1024 * 1024) {
    alert('File size exceeds 5MB.');
    return;
  }

  // Validate file type if a file is uploaded
  if (this.file && this.file.type !== 'application/pdf') {
    alert('Only PDF files are allowed.');
    return;
  }

  // Prepare form data for the update
  const formData = new FormData();
  formData.append('month', this.updateEntry.month);
  formData.append('text_field', this.updateEntry.text_field);
  formData.append('travel_date_from', this.updateEntry.travel_date_from);
  formData.append('travel_date_to', this.updateEntry.travel_date_to);
  formData.append('report_date', this.updateEntry.report_date);
  formData.append('transmittal_date', this.updateEntry.transmittal_date);
  formData.append('released_date', this.updateEntry.released_date);
  formData.append('mmd_personnel', this.updateEntry.mmd_personnel);

  // Append the file if selected
  if (this.file) {
    formData.append('MOVpdf', this.file);
  }

  // Use PUT request for updating the entry
  axios.post(`${API_BASE_URL}/api/MonitoringWPM/${this.updateEntry.ID}`, formData)
    .then(response => {
      // Find the index of the entry to be updated
      const index = this.wpm.findIndex(entry => entry.ID === this.updateEntry.ID);

      if (index !== -1) {
        this.wpm[index] = response.data;
      }

      // Close the modal after successful update
      this.closeModal();
      alert('Entry updated successfully!');
    })
    .catch(error => {
      console.error('Error updating entry:', error);
      alert('Failed to update the entry.');
    });
},
  },

  mounted() {
    this.fetchWPM();
  }
};
</script>
