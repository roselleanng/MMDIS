<!-- ISAG.vue -->

<template>
  <div>
    <!-- Header and User Button Section -->
    <div class="flex">
      <Header />
      <UserBtn />
    </div>

    <!-- Title Section -->
    <div class="flex flex-col mt-18 justify-center font-bold text-center">
      <h1 class="text-4xl">Area Status Clearance</h1>
      <h2 class="text-2xl">Industrial Sand and Gravel</h2>
    </div>

    <!-- Chart Section -->
    <div class="flex w-full shadow-xl">
      <!-- Left Content Section: Area Status Clearance -->
      <div class="flex flex-col bg-white text-gray-700 w-6/12 p-4 ">
        <!-- Bar Chart Section -->
        <div class="pt-6">
          <MonthBarChart :monthlyTotals="monthlyTotals" />
        </div>
      </div>

      <!-- Right Content Section: Pie Chart -->
      <div class="flex flex-col bg-white text-gray-700 w-6/12 p-4">
        <div class="py-6 grid place-items-center">
          <PieChart :provinceData="provinceData" />
        </div>
      </div>
    </div>
    <!-- get the total sum of released from the latest year -->
    <div class="flex bg-white justify-between pl-4">
      <h2 class="flex text-xl font-semibold">
        <template v-if="selectedReleasedYear">
          There are {{ totalSum }} total released Industrial Sand and Gravel for {{ selectedReleasedYear }}.
        </template>

        <template v-else>
          There are {{ totalSum }} total released Industrial Sand and Gravel (All Years).
        </template>
      </h2>
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
            <input
              v-model="searchQuery"
              type="search"
              id="default-search"
              class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search name, province, city, barangay..."
              required
            />
          </div>
        </div>

        <div class="flex items-center ml-4">
          <label class="mr-2 text-sm font-medium text-gray-700">Released Year:</label>
          <select
            v-model="selectedReleasedYear"
            class="p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            <option
              v-for="year in availableReleasedYears"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex content-center">
        <button @click="downloadSummary" class="mr-4 bg-blue-400 hover:bg-blue-100 p-2 text-white rounded-lg">Download Summary</button>
        <button v-if="!isMMD" @click="showModal = true" class="mr-4 bg-amber-400 hover:bg-amber-100 p-2 text-black rounded-lg">Add New Data</button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="mt-8">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">No.</th>
            <th scope="col" class="px-6 py-3">Names</th>
            <th scope="col" class="px-6 py-3">Area</th>
            <th scope="col" class="px-6 py-3">Province</th>
            <th scope="col" class="px-6 py-3">City/Municipality</th>
            <th scope="col" class="px-6 py-3">Barangay</th>
            <th scope="col" class="px-6 py-3">Sitio</th>
            <th scope="col" class="px-6 py-3">River</th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('received')">
              Date Received
              <span v-if="sortBy === 'received'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('released')">
              Date Released
              <span v-if="sortBy === 'released'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Remarks</th>
            <th scope="col" class="px-6 py-3 w-32 truncate">Supported Documents</th>
            <th v-if="!isMMD" scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(isag, index) in filteredISAG" :key="index" class="bg-white border-b">
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4">{{ isag.name }}</td>
            <td class="px-6 py-4">{{ isag.area }}</td>
            <td class="px-6 py-4">{{ isag.province }}</td>
            <td class="px-6 py-4">{{ isag.city_municipality }}</td>
            <td class="px-6 py-4">{{ isag.barangay }}</td>
            <td class="px-6 py-4">{{ isag.sitio }}</td>
            <td class="px-6 py-4">{{ isag.river }}</td>
            <td class="px-6 py-4">{{ formatDate(isag.received) }}</td>
            <td class="px-6 py-4">{{ formatDate(isag.released) }}</td>
            <td class="px-6 py-4">{{ isag.status }}</td>
            <td class="px-6 py-4">{{ isag.remarks }}</td>
            <td class="px-2 py-2 w-32 text-center">
              <button @click="openPDF(isag.attachment)" class="bg-green-500 text-black px-2 py-1 rounded">ASC</button>
              <button @click="openPDF(isag.documents)" class="bg-white-500 text-white px-2 py-1 rounded">📄</button>
              <button @click="openPDF(isag.vsheet)" class="bg-yellow-500 text-black px-2 py-1 rounded">VSHEET</button>
            </td>
            <td class="px-6 py-4 flex">
              <button v-if="!isMMD"  @click="openUpdateModal(isag.id)" class="bg-grey-100 text-white px-2 py-1 rounded"><img src="../../assets/icons/edit.png" style="width: 25px;"></button>
              <button v-if="!isMMD"  @click="deleteEntry(isag.id)" class="bg-grey-100 text-white px-2 py-1 rounded "><img src="../../assets/icons/remove.png" style="width: 20px;"></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredISAG.length === 0" class="text-center mt-4 text-gray-600">
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
                      Name:<span class="text-red-500">*</span>
                  </label>
                  <input v-model="newEntry.name" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex items-center">
                  <label class="w-48">
                      Area:<span class="text-red-500">*</span>
                  </label>
                  <input v-model="newEntry.area" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex items-center">
                  <label class="w-48">
                      Province:<span class="text-red-500">*</span>
                  </label>
                    <select v-model="newEntry.province" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>BUKIDNON</option>
                      <option>CAMUIGUIN</option>
                      <option>LANAO DEL NORTE</option>
                      <option>MISAMIS OCCIDENTAL</option>
                      <option>MISAMIS ORIENTAL</option>
                    </select>
                 </div>
                <div class="mt-2 flex items-center">
                  <label class="w-48">
                    City/Municipality:<span class="text-red-500">*</span>
                  </label>
                  <input v-model="newEntry.city_municipality" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex items-center">
                  <label class="w-48">
                    Barangay:<span class="text-red-500">*</span>
                  </label>
                  <input v-model="newEntry.barangay" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Sitio</p>
                  <input v-model="newEntry.sitio" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">River<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.river" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date Received<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.received" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Released Date:<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.released" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Status</p>
                  <input v-model="newEntry.status" type="text" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Remarks</p>
                  <input v-model="newEntry.remarks" type="text" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Area Status Clearance</p>
                  <input ref="attachment" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Submitted Documents</p>
                  <input ref="documents" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Verification Sheet</p>
                  <input ref="vsheet" type="file" accept="application/pdf,image/*" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
                      <p class="mr-5">Name:<span class="text-red-500">*</span></p>
                      <input v-model="updateEntry.name" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                      <p class="mr-5">Area:<span class="text-red-500">*</span></p>
                      <input v-model="updateEntry.area" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                    <p class="mr-5">Province<span class="text-red-500">*</span></p>
                    <select v-model="updateEntry.province" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>BUKIDNON</option>
                      <option>CAMUIGUIN</option>
                      <option>LANAO DEL NORTE</option>
                      <option>MISAMIS OCCIDENTAL</option>
                      <option>MISAMIS ORIENTAL</option>
                    </select>
                  </div>
                  <div class="mt-2 flex justify-between">
                      <p class="mr-5">City/Municipality<span class="text-red-500">*</span></p>
                      <input v-model="updateEntry.city_municipality" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                      <p class="mr-5">Barangay<span class="text-red-500">*</span></p>
                      <input v-model="updateEntry.barangay" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                      <p class="mr-5">Sitio</p>
                      <input v-model="updateEntry.sitio" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="mt-2 flex justify-between">
                      <p class="mr-5">River<span class="text-red-500">*</span></p>
                      <input v-model="updateEntry.river" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date Received<span class="text-red-500">*</span></p>
                  <input v-model="updateEntry.received" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date Released<span class="text-red-500">*</span></p>
                  <input v-model="updateEntry.released" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Status</p>
                  <input v-model="updateEntry.status" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Remarks</p>
                  <input v-model="updateEntry.remarks" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Area Status Clearance</p>
                  <div class="flex items-center">
                    <input ref="updateAttachment" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5"></p>
                  <div class="flex items-center">
                    <input v-model="attachmentCleared" type="checkbox" class="mr-2">
                    <label>Delete existing attachment</label>
                  </div>
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Submitted Documents</p>
                  <div class="flex items-center">
                    <input ref="updateAttachment2" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5"></p>
                  <div class="flex items-center">
                    <input v-model="attachmentCleared2" type="checkbox" class="mr-2">
                    <label>Delete existing attachment</label>
                  </div>
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Verification Sheet</p>
                  <div class="flex items-center">
                    <input ref="updateAttachment3" type="file" accept="application/pdf,image/*" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5"></p>
                  <div class="flex items-center">
                    <input v-model="attachmentCleared3" type="checkbox" class="mr-2">
                    <label>Delete existing attachment</label>
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
import UserBtn from '../../components/user-dbbtn.vue'; 
import MonthBarChart from '../../components/bymonth-barchart.vue';
import PieChart from '../../components/byprovince-piechart.vue';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { API_BASE_URL } from '../../config'

export default {
  components: { Header, UserBtn, MonthBarChart, PieChart },
  data() {
    return {
    isag: [],
    searchQuery: '',
    sortBy: '',
    sortOrder: 'asc',
    showModal: false,
    newEntry: this.getEmptyEntry(),
    isUpdateModalOpen: false,
    updateEntry: this.getEmptyEntry(),
    debouncedSearch: debounce(this.search, 300),
    file: null,
    userRole: localStorage.getItem('userRole') || '', // Store user role for reactivity
    attachmentCleared: false,
    attachmentCleared2: false,
    attachmentCleared3: false,
    selectedReleasedYear: '',

  };
  },

  computed: {
    
    filteredISAG() {
      return this.getFilteredAndSortedData();
    },
    availableReleasedYears() {
      const years = this.isag
        .map(item => item.released ? new Date(item.released).getFullYear() : null)
        .filter(year => year && !isNaN(year));

      return [...new Set(years)].sort((a, b) => b - a);
    },
    activeReleasedYear() {
      if (this.selectedReleasedYear) {
        return Number(this.selectedReleasedYear);
      }

      const years = this.isag
        .map(item => item.released ? new Date(item.released).getFullYear() : null)
        .filter(year => year && !isNaN(year));

      return years.length ? Math.max(...years) : null;
    },
    totalSum() {
      return this.isag.filter(item => {
        if (!item.released) return false;

        const year = new Date(item.released).getFullYear();

        return !this.selectedReleasedYear || 
              year === Number(this.selectedReleasedYear);
      }).length;
    },

    isMMD() {
          return this.userRole === 'mmd';
        },

        monthlyTotals() {
      const monthlyData = Array(12).fill(0);

      if (!this.activeReleasedYear) return monthlyData;

      this.isag.forEach(item => {
        if (!item.released) return;

        const releaseDate = new Date(item.released);
        if (releaseDate.getFullYear() === this.activeReleasedYear) {
          const month = releaseDate.getMonth();
          monthlyData[month]++;
        }
      });

      return monthlyData;
    },

    provinceData() {
      const provinceTotals = {};

      if (!this.activeReleasedYear) return provinceTotals;

      this.isag.forEach(item => {
        if (!item.released) return;

        const releaseDate = new Date(item.released);
        if (releaseDate.getFullYear() === this.activeReleasedYear) {
          if (!provinceTotals[item.province]) {
            provinceTotals[item.province] = 0;
          }
          provinceTotals[item.province]++;
        }
      });

      return provinceTotals;
    },
  year() {
    return new Date().getFullYear();
  },

  },

  methods: {

    formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
    },

    downloadSummary() {
      // Convert filteredISAG data to CSV and trigger download
      const rows = this.filteredISAG;
      if (!rows.length) {
        alert('No data available to download.');
        return;
      }
      // Extract CSV headers from keys of first object
      const headers = Object.keys(rows[0]);
      // Helper function to escape CSV special characters
      const escapeCSV = (value) => {
        if (value == null) return '';
        const stringValue = String(value);
        if (stringValue.search(/("|,|\\n)/g) >= 0) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };
      // Create CSV content as string
      const csvContent = [
        headers.join(','), // header row
        ...rows.map(row => headers.map(fieldName => escapeCSV(row[fieldName])).join(','))
      ].join('\n');
      // Create blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const downloadLink = document.createElement('a');
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.setAttribute('download', `isag_summary_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    },


    getEmptyEntry() {
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
        attachment: '',
        documents: '',
        vsheet: '',
      };
    },

    fetchISAG() {
      axios.get(`${API_BASE_URL}/api/isag`)
        .then(response => {
          this.isag = response.data;
        })
        .catch(error => {
          console.error('Error fetching ISAG:', error);
        });
    },

    openPDF(pdfPath) {
      if (!pdfPath) {
        alert('No attachment available.');
        return;
      }

      const url = `${API_BASE_URL}/storage/${pdfPath}`;
      window.open(url, '_blank');
    },

    addNewEntry() {
      const fileInput = this.$refs.attachment.files[0] || null;
      const fileInput2 = this.$refs.documents.files[0] || null;
      const fileInput3 = this.$refs.vsheet.files[0] || null;

      if (fileInput && fileInput.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size exceeds 5MB.');
        return;
      }

      // Client-side validation for required fields
      const requiredFields = ['name', 'area', 'province', 'city_municipality', 'barangay', 'river', 'received','released'];
      for (const field of requiredFields) {
        if (!this.newEntry[field]) {
          alert(`The field "${field.replace(/_/g, ' ')}" is required.`);
          return;
        }
      }

      const formData = new FormData();
      formData.append('name', this.newEntry.name);
      formData.append('area', this.newEntry.area);
      formData.append('province', this.newEntry.province);
      formData.append('city_municipality', this.newEntry.city_municipality);
      formData.append('barangay', this.newEntry.barangay);
      formData.append('sitio', this.newEntry.sitio);
      formData.append('river', this.newEntry.river);
      formData.append('received', this.newEntry.received);
      formData.append('released', this.newEntry.released);
      formData.append('status', this.newEntry.status);
      formData.append('remarks', this.newEntry.remarks);

      if (fileInput) {
        formData.append('attachment', fileInput);
      } else if (this.attachmentCleared) {
        formData.append('attachment', '');
      }

      if (fileInput2) {
        formData.append('documents', fileInput2);
      } else if (this.attachmentCleared2) {
        formData.append('documents', '');
      }

      if (fileInput3) {
        formData.append('vsheet', fileInput3);
      } else if (this.attachmentCleared3) {
        formData.append('vsheet', '');
      }


      axios.post(`${API_BASE_URL}/api/isag`, formData)
        .then(response => {
          this.isag.push(response.data);
          this.showModal = false;
          this.newEntry = this.getEmptyEntry();
          alert('Entry added successfully!');
        })
        .catch(error => {
          console.error('Error adding entry:', error.response ? error.response.data : error.message);
        });
    },

    search() {
    axios.get(`${API_BASE_URL}/api/isag/search?query=${this.searchQuery}`)
      .then(response => {
        this.isag = response.data;
      })
      .catch(error => {
        console.error('Error searching for ISAG:', error);
      });
    },

    getFilteredAndSortedData() {
      const query = this.searchQuery.toLowerCase().trim();

      const filtered = this.isag.filter(isag => {
        const matchesSearch =
          !query ||
          [
            isag.name,
            isag.province,
            isag.city_municipality,
            isag.barangay,
            isag.sitio,
            isag.river,
            isag.status,
            isag.remarks,
          ].some(val => String(val || '').toLowerCase().includes(query));

        const releasedYear = isag.released
          ? new Date(isag.released).getFullYear().toString()
          : '';

        const matchesReleasedYear =
          !this.selectedReleasedYear ||
          releasedYear === this.selectedReleasedYear.toString();

        return matchesSearch && matchesReleasedYear;
      });

      if (this.sortBy) {
        filtered.sort((a, b) => {
          let aValue = a[this.sortBy];
          let bValue = b[this.sortBy];

          if (this.sortBy === 'released' || this.sortBy === 'received') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          } else {
            aValue = String(aValue || '').toLowerCase();
            bValue = String(bValue || '').toLowerCase();
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

    debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
    },

    deleteEntry(id) {
      if (confirm('Are you sure you want to delete this entry?')) {
        axios.delete(`${API_BASE_URL}/api/isag/${id}`)
          .then(() => {
            this.isag = this.isag.filter(item => item.id !== id);
          })
          .catch(error => {
            console.error('Error deleting entry:', error.response ? error.response.data : error.message);
          });
      }
    },

    openUpdateModal(thisid) {
    console.log('openUpdateModal called with ID:', thisid);
    const entry = this.isag.find(entry => entry.id === thisid);
    if (entry) {
      this.updateEntry = { ...entry };
      this.isUpdateModalOpen = true;
      console.log('Update modal open with entry:', this.updateEntry);
    } else {
      console.error('Entry not found with ID:', thisid);
    }
    },

    closeModal() {
      this.isUpdateModalOpen = false; 
      this.updateEntry = this.getEmptyEntry();
      this.attachmentCleared = false;
      this.attachmentCleared2 = false;
      this.attachmentCleared3 = false;
    },

    sortByDate(key) {
        if (this.sortBy === key) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortBy = key;
          this.sortOrder = 'asc';
        }
    },

    async handleUpdate() {

      // Client-side validation for required fields
      const requiredFields = ['name', 'area', 'province', 'city_municipality', 'barangay', 'river', 'received','released'];
      for (const field of requiredFields) {
        if (!this.updateEntry[field]) {
          alert(`The field "${field.replace(/_/g, ' ')}" is required.`);
          return;
        }
      }

      const fileInput = this.$refs.updateAttachment.files[0] || null;
      const fileInput2 = this.$refs.updateAttachment2.files[0] || null;
      const fileInput3 = this.$refs.updateAttachment3.files[0] || null;

      if (fileInput && fileInput.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size exceeds 5MB.');
        return;
      }
      if (fileInput2 && fileInput2.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size exceeds 5MB.');
        return;
      }
      if (fileInput3 && fileInput3.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size exceeds 5MB.');
        return;
      }

      // Prepare form data for the update
      const formData = new FormData();
      formData.append('name', this.updateEntry.name);
      formData.append('area', this.updateEntry.area);
      formData.append('province', this.updateEntry.province);
      formData.append('city_municipality', this.updateEntry.city_municipality);
      formData.append('barangay', this.updateEntry.barangay);
      formData.append('sitio', this.updateEntry.sitio);
      formData.append('river', this.updateEntry.river);
      formData.append('received', this.updateEntry.received);
      formData.append('released', this.updateEntry.released);
      formData.append('status', this.updateEntry.status);
      formData.append('remarks', this.updateEntry.remarks);

      if (fileInput) {
        formData.append('attachment', fileInput);
      } else if (this.attachmentCleared) {
        formData.append('attachment', '');
      }

      if (fileInput2) {
        formData.append('documents', fileInput2);
      } else if (this.attachmentCleared2) {
        formData.append('documents', '');
      }

      if (fileInput3) {
        formData.append('vsheet', fileInput3);
      } else if (this.attachmentCleared3) {
        formData.append('vsheet', '');
      }

      // Use POST request for updating the entry
      axios.post(`${API_BASE_URL}/api/isag/${this.updateEntry.id}`, formData)
        .then(response => {
          // Find the index of the entry to be updated
          const index = this.isag.findIndex(entry => entry.id === this.updateEntry.id);

          if (index !== -1) {
            this.isag[index] = response.data;
          }

          // Close the modal after successful update
          this.closeModal();
          alert('Entry updated successfully!');
        })
        .catch(error => {
          console.error('Error adding entry:', error.response ? error.response.data : error.message);
        });
    },
  },
  mounted() {
    this.fetchISAG();
    console.log('userRole:', this.userRole);
    console.log('isMMD:', this.isMMD);
  },
};
</script>
