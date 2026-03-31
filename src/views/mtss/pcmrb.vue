 <template>
  <div>
    <!-- Header and User Button Section -->
    <div class="flex">
      <Header />
      <UserBtn />
    </div>

    <!-- Title Section -->
    <div class="flex flex-col mt-18 justify-center font-bold text-center">
      <h1 class="text-4xl">PCMRB Meetings</h1>
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
      There are {{ totalSum }} total sum of PCMRB Meetings.
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

      <div class="flex content-center gap-3">
        <button 
            v-if="!isMMD" 
            @click="showModal = true" 
            class="bg-amber-400 hover:bg-amber-100 h-12 px-4 text-black rounded-lg">
            Add New Data
        </button>

        <!--<button
            v-if="!isMMD"
            @click="showDeleteAllModal = true"
            class="bg-red-600 hover:bg-red-700 text-white h-12 px-4 rounded-lg font-medium shadow">
            Delete All
        </button>-->
      </div>

  </div>

    <!-- Table Section -->
    <div class="mt-8">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">No.</th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('month')">
              Month
              <span v-if="sortKey === 'month'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            
            <th scope="col" class="px-6 py-3">PCMRB Meetings Conducted/Participated</th>
            <th scope="col" class="px-6 py-3">Province/HUC</th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('meeting_date')">
              Meeting Date
              <span v-if="sortKey === 'meeting_date'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 text-center">Proof of MOV Uploaded</th>
            <th v-if="!isMMD" scope="col" class="px-6 py-3 flex justify-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in filteredEntries" :key="entry.ID" class="bg-white border-b">
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4">{{ entry.month }}</td>
            <td class="px-6 py-4" style="width: 300px;">{{ entry.meetings_conducted }}</td>
            <td class="px-6 py-4">{{ entry.province_huc }}</td>
            <td class="px-6 py-4">{{ entry.meeting_date }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="openPDF(entry.MOVpdf)" class="bg-red-500 text-white px-2 py-1 rounded">View</button>
            </td>
            <td class="px-6 py-4 flex justify-center">
            <!-- edit entry -->
            <button v-if="!isMMD" @click="openUpdateModal(entry.ID)" class="bg-grey-100 text-white px-2 py-1 rounded"><img src="../../assets/icons/edit.png" style="width: 25px;"></button> 
            <button v-if="!isMMD" @click="deleteEntry(entry.ID)" class="bg-grey-100 text-white px-2 py-1 rounded "><img src="../../assets/icons/remove.png" style="width: 20px;"></button>
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
                  <p class="mr-5">Select Month:<span class="text-red-500">*</span></p>
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
                  <label for="text_field" class="text-gray-700">PCMRB Meetings Conducted/Participated:<span class="text-red-500">*</span></label>
                  <textarea v-model="newEntry.meetings_conducted" id="meetings_conducted" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Province/HUC:<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.province_huc" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Meeting Date:<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.meeting_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Proof of MOV:<span class="text-red-500">*</span></p>
                  <input ref="MOVpdf" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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

    <!-- Delete All Confirmation Modal -->
    <div v-if="showDeleteAllModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div class="bg-white px-6 pt-6 pb-4">
            <!-- Icon + Title -->
            <div class="flex items-center gap-3 mb-3">
              <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Delete All Records</h3>
            </div>
            <!-- Message -->
            <p class="text-sm text-gray-600 mb-1">
              Are you sure you want to <span class="font-semibold text-red-600">delete ALL</span> Ore Sample Transport Certificate entries?
            </p>
            <p class="text-sm text-gray-500">
              This action <span class="font-semibold">cannot be undone</span>. All records and associated PDF files will be permanently removed.
            </p>
          </div>
          <!-- Buttons -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              @click="showDeleteAllModal = false"
              type="button"
              class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none">
              Cancel
            </button>
            <button
              @click="confirmDeleteAll"
              type="button"
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none">
              Yes, Delete All
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
                  <p class="mr-5">Select Month:<span class="text-red-500">*</span></p>
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
                  <label for="meetings_conducted" class="text-gray-700">PCMRB Meetings Conducted/Participated<span class="text-red-500">*</span></label>
                  <textarea v-model="updateEntry.meetings_conducted" id="meetings_conducted" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Province/HUC:<span class="text-red-500">*</span></p>
                  <input v-model="updateEntry.province_huc" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Meeting Date:<span class="text-red-500">*</span></p>
                  <input v-model="updateEntry.meeting_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
          
                <div class="mt-2 flex">
                    <!-- Label -->
                    <p class="mr-5 w-40">Proof of MOV:<span class="text-red-500">*</span></p>

                    <!-- File section -->
                    <div class="flex flex-col">
                      <input
                        type="file"
                        accept="application/pdf"
                        @change="handleFileUpload($event, 'MOVpdf')"
                        class="bg-orange-100 rounded-md border-gray-300 shadow-sm"
                      >
                      <div v-if="updateEntry.MOVpdf" class="flex items-center mt-1">
                        <input type="checkbox" v-model="deleteMOV" class="mr-2">
                        <label>Delete existing</label>
                      </div>
                  </div>
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
    pcmrb: [],
    searchQuery: '',
    sortKey: '',
    sortOrder: 'asc',
    showModal: false,
    newEntry: this.getEmptyEntry(),
    isUpdateModalOpen: false,
    updateEntry: this.getEmptyEntry(),
    debouncedSearch: debounce(this.search, 300),
    userRole: localStorage.getItem('userRole') || '',
    showDeleteAllModal: false, // State for delete all confirmation modal
    //
    //
    file: null,
    deleteMOV: false, 
  };
},

computed: {
  filteredEntries() {
    return this.getFilteredAndSortedData();
  },

  totalSum() {
    if (!this.pcmrb.length) return 0; 
    
    const latestYear = Math.max(...this.pcmrb.map(item => {
      const year = new Date(item.meeting_date).getFullYear();
      return isNaN(year) ? 0 : year; 
    }));
    
    const count = this.pcmrb.filter(pcmrb => new Date(pcmrb.meeting_date).getFullYear() === latestYear).length;
    console.log('Total Count for Latest Year:', count); // Log the total count
    
    return count;
  },

  monthlyTotals() {
    const latestYear = Math.max(...(this.pcmrb || []).map(item => {
      const date = new Date(item.meeting_date);
      return isNaN(date.getTime()) ? 0 : date.getFullYear(); // Handle invalid dates
    }));

    const monthlyData = Array(12).fill(0);

    (this.pcmrb || []).forEach(entry => {
      const releaseDate = new Date(entry.meeting_date);
      if (releaseDate.getFullYear() === latestYear && !isNaN(releaseDate.getTime())) {
        const month = releaseDate.getMonth(); // 0 = January, 11 = December
        monthlyData[month]++;
      }
    });

    return monthlyData;
  },

  year() {
    return new Date().getFullYear();
  },
  isMMD() {
      return this.userRole === 'mmd';
    }
},
methods: {

  getEmptyEntry() {
    return {
      month: '',
      meetings_conducted: '',
      province_huc: '',
      meeting_date: '',
      MOVpdf: '',
    };
  },

  confirmDeleteAll() {
      this.showDeleteAllModal = false;
      axios.delete(`${API_BASE_URL}/api/MonitoringPCMRB/deleteAllRecords`)
        .then(() => {
          this.pcmrb = [];
          alert("All entries deleted successfully.");
        })
        .catch(error => {
          console.error(error);
          alert("Failed to delete all entries.");
        });
    },

  fetchPCMRB() {
    axios.get(`${API_BASE_URL}/api/MonitoringPCMRB`)
      .then(response => {
        this.pcmrb = response.data;
      })
      .catch(error => {
        console.error('Error fetching PCMRB:', error);
        alert('Failed to load data. Please check if the backend server is running.');
      });
  },

  addNewEntry() {
    const fileInput = this.$refs.MOVpdf.files[0] || null; // Use null if no file is selected

    // Client-side validation for required fields
    if (!this.newEntry.month || !this.newEntry.meetings_conducted || !this.newEntry.province_huc || !this.newEntry.meeting_date || !fileInput) {
      alert('All fields are required, including the Proof of MOV file.');
      return;
    }

    if (fileInput && fileInput.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size exceeds 5MB.');
      return;
    }

    if (fileInput && fileInput.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('month', this.newEntry.month);
    formData.append('meetings_conducted', this.newEntry.meetings_conducted);
    formData.append('province_huc', this.newEntry.province_huc);
    formData.append('meeting_date', this.newEntry.meeting_date);

    if (fileInput) {
      formData.append('MOVpdf', fileInput);
    }

    axios.post(`${API_BASE_URL}/api/MonitoringPCMRB`, formData)
      .then(response => {
        this.pcmrb.push(response.data);
        this.showModal = false;
        this.newEntry = this.getEmptyEntry();
        this.$refs.MOVpdf.value = ''; // Reset file input
        alert('Entry added successfully!');
      })
      .catch(error => {
        console.error('Error adding entry:', error.response ? error.response.data : error.message);
      });
  },

  openPDF(filePath) {
      if (!filePath) {
        alert('No PDF uploaded.');
        return;
      }
      const cleanedPath = filePath.replace('public/', '');
      const url = `${API_BASE_URL}/storage/${cleanedPath}`;
      window.open(url, '_blank');
    },

  search() {
    axios.get(`${API_BASE_URL}/api/MonitoringPCMRB/search?query=${this.searchQuery}`)
      .then(response => {
        this.pcmrb = response.data;
      })
      .catch(error => {
        console.error('Error searching for monitoringWPM:', error);
      });
  },

  getFilteredAndSortedData() {
    const query = this.searchQuery.toLowerCase();
    let filteredData = this.pcmrb.filter(entry =>
      entry.month.toLowerCase().includes(query) ||
      entry.meetings_conducted.toLowerCase().includes(query) ||
      entry.province_huc.toLowerCase().includes(query)
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

    axios.delete(`${API_BASE_URL}/api/MonitoringPCMRB/${ID}`)
      .then(response => {
        this.pcmrb = this.pcmrb.filter(entry => entry.ID !== ID);
        alert('Entry deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting entry:', error);
        alert('Failed to delete the entry. Please try again.');
      });
  },

  openUpdateModal(thisID) {
    const entry = this.pcmrb.find(entry => entry.ID === thisID);
    if (entry) {
      this.updateEntry = { ...entry };
      this.isUpdateModalOpen = true;
      this.file = null;        // ✅ reset
      this.deleteMOV = false;
    }
  },

  closeModal() {
    this.isUpdateModalOpen = false; 
    this.updateEntry = this.getEmptyEntry();
    this.file = null;        // ✅ reset
    this.deleteMOV = false;
  },
  //
  //
  //
  handleFileUpload(event) {
    this.file = event.target.files[0];
  },

  async handleUpdate() {

        // Client-side validation for required fields
        if (!this.newEntry.month || !this.newEntry.meetings_conducted || !this.newEntry.province_huc || !this.newEntry.meeting_date || !fileInput) {
      alert('All fields are required, including the Proof of MOV file.');
      return;
    }
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
      formData.append('meetings_conducted', this.updateEntry.meetings_conducted);
      formData.append('province_huc', this.updateEntry.province_huc);
      formData.append('meeting_date', this.updateEntry.meeting_date);

      // Append the file if selected
        // ✅ If new file uploaded
        if (this.file) {
          formData.append('MOVpdf', this.file);
        }

        // ✅ If delete checkbox checked
        if (this.deleteMOV) {
          formData.append('clear_MOVpdf', '1');
        }

      axios.post(`${API_BASE_URL}/api/MonitoringPCMRB/${this.updateEntry.ID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(res => {
        const idx = this.pcmrb.findIndex(e => e.ID === this.updateEntry.ID);
        if (idx !== -1) this.pcmrb[idx] = res.data;

        // Close the modal after successful update
        this.file = null;        // ✅ reset file
        this.deleteMOV = false;  // reset checkbox
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
  this.fetchPCMRB();
  console.log('userRole:', this.userRole);
  console.log('isMMD:', this.isMMD);
}
};
</script>
