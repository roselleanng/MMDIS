<template>
  <div>
    <!-- Header and User Button Section -->
    <div class="flex">
      <Header />
      <UserBtn />
    </div>

    <!-- Title Section -->
    <div class="flex flex-col mt-18 justify-center font-bold text-center">
      <h1 class="text-4xl">Mineral Ore Export Permits</h1>
      <h2 class="text-2xl">Validation Report</h2>
    </div>

    <!-- Search and Add New Data Section -->
    <div class="flex mt-8 justify-between">
      <div class="flex w-2/5">
        <div class="rounded-l-lg content-center bg-blue-100 items-center pe-3 ml-5 ps-3 pointer-events-none">
            <svg class="w-8 h-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
        </div>
        <div class="w-full">
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div class="">
            <input v-model="searchQuery" @input="debouncedSearch" type="search" id="default-search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search applicant, MOEP no., and permit no...." required />
          </div>
        </div>
      </div>
      <div class="content-center">
        <button v-if="!isMMD" @click="showModal = true" class="mr-4 bg-green-900 p-2 text-white font-bold rounded-lg">Add New Data</button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="mt-8">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">No.</th>
            <th scope="col" class="px-6 py-3">Applicant</th>
            <th scope="col" class="px-6 py-3">MOEP No.</th>
            <th scope="col" class="px-6 py-3">Permit No.</th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('issued')">
              Date of Issuance
              <span v-if="sortBy === 'issued'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('validated')">
              Date of Validation
              <span v-if="sortBy === 'validated'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3">Report</th>
            <th v-if="!isMMD" scope="col" class="px-12 py-5 text-center">Action</th>
          </tr>
          
        </thead>
        <tbody>
          <tr v-for="(moep, index) in filteredMOEP" :key="moep.id" class="bg-white border-b">
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4">{{ moep.applicant }}</td>
            <td class="px-6 py-4">{{ moep.moep_no }}</td>
            <td class="px-6 py-4">{{ moep.permit_no }}</td>
            <td class="px-6 py-4">{{ moep.issued }}</td>
            <td class="px-6 py-4">{{ moep.validated }}</td>
            <td class="px-6 py-4">
              <button @click="openPDF(moep.reportPDF)" class="bg-red-500 text-white px-2 py-1 rounded">View</button>
            </td>
            <td class="px-6 py-4 flex justify-center">
              <button v-if="!isMMD" @click="openUpdateModal(moep.id)" class="bg-grey-100 text-white px-2 py-1 rounded"><img src="../../assets/icons/edit.png" style="width: 25px;"></button>
              <button v-if="!isMMD" @click="deleteEntry(moep.id)" class="bg-grey-100 text-white px-2 py-1 rounded "><img src="../../assets/icons/remove.png" style="width: 20px;"></button>
            </td>
          </tr>
        </tbody>
       
      </table>
      <div v-if="filteredMOEP.length === 0" class="text-center mt-4 text-gray-600">
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
              <div class="mmt-2 space-y-3">

                <div class="mt-2 flex items-center">
                  <label class="w-48">
                      Applicant:<span class="text-red-500">*</span>
                  </label>
                  <input v-model="newEntry.applicant" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex items-center">
                  <label class="w-48">
                      MOEP No.:<span class="text-red-500">*</span>
                  </label>
                  <input v-model="newEntry.moep_no" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex items-center">
                  <label class="w-48">
                      Permit No.:<span class="text-red-500">*</span>
                  </label>
                  <input v-model="newEntry.permit_no" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date of Issuance<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.issued" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date of Validation<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.validated" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">MOV:</p>
                  <input ref="reportPDF" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleUpdate" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div class="mt-2 flex flex-col">
                  <label for="text_field" class="text-gray-700">Applicant:</label>
                  <textarea v-model="updateEntry.applicant" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                <div class="mt-2 flex flex-col">
                  <label for="text_field" class="text-gray-700">MOEP No.</label>
                  <textarea v-model="updateEntry.moep_no" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                <div class="mt-2 flex flex-col">
                  <label for="text_field" class="text-gray-700">Permit No.</label>
                  <textarea v-model="updateEntry.permit_no" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date of Issuance:</p>
                  <input v-model="updateEntry.issued" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date of Validation:</p>
                  <input v-model="updateEntry.validated" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">MOV:</p>
                  <input ref="reportPDF" type="file" accept="application/pdf" @change="handleFileUpload" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                  <!-- Delete checkbox -->
              <div v-if="updateEntry.reportPDF" class="mt-2 flex items-center">
                <input type="checkbox" v-model="deleteReport" class="mr-2">
                <label>Delete existing attachment</label>
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
</div>
</template>

<script>
import Header from '../../components/header.vue';
import UserBtn from '../../components/user-dbbtn.vue';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { API_BASE_URL } from '../../config'

export default {
  components: {
    Header,
    UserBtn
  },
  data() {
    return {
      moep: [],
      searchQuery: '',
      sortBy: '',
      sortOrder: 'asc',
      showModal: false,
      newEntry: this.getEmptyEntry(),
      isUpdateModalOpen: false,
      updateEntry: this.getEmptyEntry(),
      file: null,
      userRole: localStorage.getItem('userRole') || '', // Store user role for reactivity
      deleteReport: false,
    };
  },
  computed: {
    filteredMOEP() {
      return this.getFilteredAndSortedData();
    },

    isMMD() {
            return this.userRole === 'mmd';
    },
  },
  methods: {
    getEmptyEntry() {
      return {
        applicant: '',
        moep_no: '',
        permit_no: '',
        issued: '',
        validated: '',
        reportPDF: null,
      };
    },
    formatInput(value) {
      return value ? value.toUpperCase() : '';
    },
    updateEntry(field, value) {
      this.newEntry[field] = value.toUpperCase();
    },

    fetchMOEP() {
      axios.get(`${API_BASE_URL}/api/MOEP`)
        .then(response => {
          this.moep = response.data;
        })
        .catch(error => {
          console.error('Error fetching MOEP:', error);
        });
    },

    addNewEntry() {
      // Client-side validation for required fields
      const requiredFields = ['applicant', 'moep_no', 'permit_no', 'issued','validated'];
      for (const field of requiredFields) {
        if (!this.newEntry[field]) {
          alert(`The field "${field.replace(/_/g, ' ')}" is required.`);
          return;
        }
      }

      const fileInput = this.$refs.reportPDF.files[0];
      if (fileInput && fileInput.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size exceeds 10MB.');
        return;
      }

      const formData = new FormData();
      formData.append('applicant', this.newEntry.applicant);
      formData.append('moep_no', this.newEntry.moep_no);
      formData.append('permit_no', this.newEntry.permit_no);
      formData.append('issued', this.newEntry.issued);
      formData.append('validated', this.newEntry.validated);

      if (fileInput) {
        formData.append('reportPDF', fileInput);
      }

      axios.post(`${API_BASE_URL}/api/MOEP`, formData, { 
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        this.moep.push(response.data);
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
      // Trigger re-computation of filteredMOEP
      this.filteredMOEP;
    },
    sortByDate(key) {
      if (this.sortBy === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = key;
        this.sortOrder = 'asc';
      }
    },
    getFilteredAndSortedData() {
      const query = this.searchQuery.toLowerCase();
      const filtered = this.moep.filter(moep =>
        Object.values(moep).some(val => 
          String(val).toLowerCase().includes(query)
        )
      );

      if (this.sortBy) {
        filtered.sort((a, b) => {
          const dateA = new Date(a[this.sortBy]);
          const dateB = new Date(b[this.sortBy]);
          return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
      }

      return filtered;
    },
    openPDF(pdfPath) {
      if (!pdfPath) {
        alert('No attachment available.');
        return;
      }

      const url = `${API_BASE_URL}/storage/${pdfPath}`;
      window.open(url, '_blank');
    },
    openUpdateModal(entryId) {
      const entry = this.moep.find(e => e.id === entryId);
      if (entry) {
        this.updateEntry = { ...entry };
        this.deleteReport = false;
        this.isUpdateModalOpen = true;
      } else {
        console.error(`Entry with id ${entryId} not found.`);
        alert('Entry not found.');
      }
    },
    closeModal() {
      this.isUpdateModalOpen = false;
      this.updateEntry = this.getEmptyEntry();
      this.file = null;
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    handleUpdate() {

      // Client-side validation for required fields
      const requiredFields = ['applicant', 'moep_no', 'permit_no', 'issued','validated'];
      for (const field of requiredFields) {
        if (!this.updateEntry[field]) {
          alert(`The field "${field.replace(/_/g, ' ')}" is required.`);
          return;
        }
      }

      if (this.file && this.file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB.');
        return;
      }

      if (this.file) {
        if (this.file.type !== 'application/pdf') {
          alert('Only PDF files are allowed.');
          return;
        }
      }

      const formData = new FormData();
      formData.append('applicant', this.updateEntry.applicant);
      formData.append('moep_no', this.updateEntry.moep_no);
      formData.append('permit_no', this.updateEntry.permit_no);
      formData.append('issued', this.updateEntry.issued);
      formData.append('validated', this.updateEntry.validated);

        // ✅ If new file uploaded
        if (this.file) {
          formData.append('reportPDF', this.file);
        }

        // ✅ If delete checkbox checked
        if (this.deleteReport) {
          formData.append('deleteReport', '1');
        }

      axios.post(`${API_BASE_URL}/api/MOEP/${this.updateEntry.id}`, formData)
        .then(response => {
          const index = this.moep.findIndex(entry => entry.id === this.updateEntry.id);
          if (index !== -1) {
            this.moep[index] = response.data;
          }
          this.closeModal();
          alert('Entry updated successfully!');
        })
        .catch(error => {
          console.error('Error adding entry:', error.response ? error.response.data : error.message);
        });
    },
    deleteEntry(id) {
      if (!confirm('Are you sure you want to delete this entry?')) {
        return;
      }
      axios.delete(`${API_BASE_URL}/api/MOEP/${id}`)
        .then(response => {
          this.moep = this.moep.filter(entry => entry.id !== id);
          alert('Entry deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete the entry.');
        });
    }
  },
  mounted() {
    this.fetchMOEP();
    console.log('userRole:', this.userRole);
    console.log('isMMD:', this.isMMD);
  },
};
</script>
