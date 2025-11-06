<template>
  <div>
    <!-- Header and User Button Section -->
    <div class="flex">
      <Header />
      <UserBtn />
    </div>

    <!-- Title Section -->
    <div class="flex flex-col mt-18 justify-center font-bold text-center">
      <h1 class="text-4xl">Declaration of Mine Project Feasibility</h1>
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
        There are {{ totalSum }} total sum of released Declaration of Mine Project Feasibility.
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
        <input v-model="searchQuery" @input="debouncedSearch" type="search" id="default-search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search client and certification no ..." required />
      </div>
      <!-- Add Button -->
      <AddBtn @click="showModal = true" />
    </div>

    <!-- Table Section -->
    <div class="mt-8">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">Month</th>
            <th scope="col" class="px-6 py-3">No.</th>
            <th scope="col" class="px-6 py-3">DMPF Endorsed</th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('filing_date')">
              Filing Date
              <span v-if="sortKey === 'filing_date'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('endorsed')">
              Date Endorsed
              <span v-if="sortKey === 'endorsed'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('transmittal')">
              Transmittal Date
              <span v-if="sortKey === 'transmittal'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('released')">
              Date Released
              <span v-if="sortKey === 'released'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 text-center">Proof of MOV Uploaded</th>
            <th scope="col" class="px-6 py-3 flex justify-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in filteredEntries" :key="entry.no" class="bg-white border-b">
            <td class="px-6 py-4">{{ entry.month }}</td>
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4">{{ entry.dmpf_endorsed }}</td>
            <td class="px-6 py-4">{{ entry.filing_date }}</td>
            <td class="px-6 py-4">{{ entry.endorsed }}</td>
            <td class="px-6 py-4">{{ entry.transmittal }}</td>
            <td class="px-6 py-4">{{ entry.released }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="openPDF(entry.MOVpdf)" class="bg-red-500 text-white px-2 py-1 rounded">View</button>
            </td>
            <td class="px-6 py-4 flex justify-center">
              <button @click="openUpdateModal(entry.no)" class="bg-grey-100 text-white px-2 py-1 rounded">
                <img src="../../assets/icons/edit.png" style="width: 25px;" />
              </button>
              <button @click="deleteEntry(entry.no)" class="bg-grey-100 text-white px-2 py-1 rounded">
                <img src="../../assets/icons/remove.png" style="width: 20px;" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredEntries.length === 0" class="text-center mt-4 text-gray-600">
        No results found.
      </div>

      <!-- Modal for Adding New Entry -->
      <div v-if="showModal" class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <!-- Modal content -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div class="mt-2 flex justify-between">
                    <label for="text_field">Select Month</label>
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
                    <p class="mr-5">DMPF Endorsed:</p>
                    <input v-model="newEntry.dmpf_endorsed" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Filing Date:</p>
                    <input v-model="newEntry.filing_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Date Endorsed:</p>
                    <input v-model="newEntry.endorsed" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Transmittal Date:</p>
                    <input v-model="newEntry.transmittal" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Date Released:</p>
                    <input v-model="newEntry.released" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-4 flex justify-between">
                    <p class="mr-5">Proof of MOV Uploaded:</p>
                    <input ref="MOVpdf" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="showModal = false" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
              <button @click="addNewEntry" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
               Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal for Updating an Entry -->
      <div v-if="isUpdateModalOpen" class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <!-- Modal content -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div class="mt-2 flex justify-between">
                    <label for="text_field">Select Month</label>
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
                    <p class="mr-5">DMPF Endorsed:</p>
                    <input v-model="updateEntry.dmpf_endorsed" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Filing Date:</p>
                    <input v-model="updateEntry.filing_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Date Endorsed:</p>
                    <input v-model="updateEntry.endorsed" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Transmittal Date:</p>
                    <input v-model="updateEntry.transmittal" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Date Released:</p>
                    <input v-model="updateEntry.released" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-4 flex justify-between">
                    <p class="mr-5">Proof of MOV Uploaded:</p>
                    <input ref="MOVpdf" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="handleUpdate" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                Update
              </button>
              <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header.vue'; // Import Header component
import AddBtn from '../../components/MTSS/add-btn.vue'; // Import Add Button component
import UserBtn from '../../components/user-dbbtn.vue'; // Import User Button component
import MonthBarChart from '../../components/bymonth-barchart.vue';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { API_BASE_URL } from '../../config'

export default {
  components: { Header, UserBtn, AddBtn, MonthBarChart },

  data() {
    return {
      dmpf: [], // Array to store fetched entries
      searchQuery: '', // Search query string
      sortKey: '', // Key to sort entries by
      sortOrder: 'asc', // Sorting order (ascending by default)
      showModal: false, // State for add entry modal
      newEntry: this.getEmptyEntry(), // Template for a new entry
      isUpdateModalOpen: false, // State to track if the update modal is open
      updateEntry: this.getEmptyEntry(), // Object to store the entry being updated
      debouncedSearch: this.debounce(this.search, 300), // Debounced search function
    };
  },

  computed: {
    filteredEntries() {
      return this.getFilteredAndSortedData();
    },
    totalSum() {
      const latestYear = Math.max(...this.dmpf.map(item => new Date(item.released).getFullYear()));
      return this.dmpf
        .filter(dmpf => new Date(dmpf.released).getFullYear() === latestYear)
        .length;
    },
    monthlyTotals() {
      const latestYear = Math.max(...(this.dmpf || []).map(item => new Date(item.released).getFullYear()));
      const monthlyData = Array(12).fill(0);

      (this.dmpf || []).forEach(entry => {
        const releaseDate = new Date(entry.released);
        if (releaseDate.getFullYear() === latestYear) {
          const month = releaseDate.getMonth();
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
        no: '',
        dmpf_endorsed: '',
        filing_date: '',
        endorsed: '',
        transmittal: '',
        released: '',
        MOVpdf: '',
      };
    },
    fetchDMPF() {
      axios.get(`${API_BASE_URL}/api/MonitoringDMPF`)
        .then(response => {
          console.log('Fetched data:', response.data);
          this.dmpf = response.data;
        })
        .catch(error => {
          console.error('Error fetching monitoringDMPF:', error);
        });
    },

    addNewEntry() {
      const fileInput = this.$refs.MOVpdf.files[0] || null;

      if (fileInput && fileInput.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('month', this.newEntry.month);
      formData.append('dmpf_endorsed', this.newEntry.dmpf_endorsed);
      formData.append('filing_date', this.newEntry.filing_date);
      formData.append('endorsed', this.newEntry.endorsed);
      formData.append('transmittal', this.newEntry.transmittal);
      formData.append('released', this.newEntry.released);

      if (fileInput) {
        formData.append('MOVpdf', fileInput);
      }

      axios.post(`${API_BASE_URL}/api/MonitoringDMPF`, formData)
        .then(response => {
          console.log('Added new entry:', response.data);
          this.dmpf.push(response.data);
          this.newEntry = this.getEmptyEntry();
          this.showModal = false;
          alert('Entry added successfully!');
        })
        .catch(error => {
          console.error('Error adding new entry:', error);
          alert('Failed to add a new entry.');
        });
    },
    // Method to open the update modal
    openUpdateModal(entryNo) {
      const entry = this.dmpf.find(e => e.no === entryNo); // Find the entry to be updated by its number
      if (entry) {
        this.updateEntry = { ...entry }; // Copy the entry data to `updateEntry`
        this.isUpdateModalOpen = true; // Open the update modal
      }
    },

    // Method to close the modal
    closeModal() {
      this.isUpdateModalOpen = false; // Close the update modal
      this.updateEntry = this.getEmptyEntry(); // Reset the `updateEntry` object
    },

    // Method to handle the update process
    handleUpdate() {
      const updatedEntry = this.updateEntry;

      axios.put(`${API_BASE_URL}/api/MonitoringDMPF/${updatedEntry.no}`, updatedEntry)
        .then(response => {
          const index = this.dmpf.findIndex(entry => entry.no === updatedEntry.no);
          if (index !== -1) {
            this.dmpf[index] = response.data; // Directly assign the updated data to the entry in the array
          }
          this.closeModal(); // Close the modal after successful update
          alert('Entry updated successfully!');
        })
        .catch(error => {
          console.error('Error updating entry:', error);
          alert('Failed to update the entry.');
        });
    },
    deleteEntry(no) {
      if (!confirm('Are you sure you want to delete this entry?')) {
        return;
      }
      axios.delete(`${API_BASE_URL}/api/MonitoringDMPF/${no}`)
        .then(response => {
          this.dmpf = this.dmpf.filter(entry => entry.no !== no);
          alert('Entry deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete the entry.');
        });
    },

    search() {
      // Implement search logic here
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
      let filteredData = this.dmpf;

      if (this.searchQuery) {
        const lowerCaseQuery = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter(entry =>
          Object.values(entry).some(value =>
            String(value).toLowerCase().includes(lowerCaseQuery)
          )
        );
      }

      if (this.sortKey) {
        filteredData.sort((a, b) => {
          const compareA = a[this.sortKey];
          const compareB = b[this.sortKey];
          if (compareA < compareB) return this.sortOrder === 'asc' ? -1 : 1;
          if (compareA > compareB) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return filteredData;
    },

    debounce(func, wait) {
      return debounce(func, wait);
    },
    openPDF(filePath) {
      const index = filePath.indexOf('/');
      const pdfFinalPath = filePath.slice(index + 1);
      const url = `${API_BASE_URL}/storage/${pdfFinalPath}`;
        if (filePath) {
          window.open(url, '_blank');
        } else {
          console.error('PDF URL not found');
        }
    },
  },
  mounted() {
    this.fetchDMPF();
  }
};
</script>
  