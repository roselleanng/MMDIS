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
      <h2 class="text-2xl">Commercial Sand and Gravel</h2>
    </div>

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
      <h2 class="flex text-xl font-semibold">There are {{ totalSum }} total sum of released Commercial Sand and Gravel.</h2> 
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
            <input v-model="searchQuery" @input="debouncedSearch" type="search" id="default-search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search name, province, city, barangay, river, status or remarks..." required />
          </div>
        </div>
      </div>
      <div class="flex content-center">
        <button @click="showModal = true" class="mr-4 bg-amber-400 hover:bg-amber-100 p-2 text-black rounded-lg">Add New Data</button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="mt-8">
      <table ref="csagTable" class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">No.</th>
            <th scope="col" class="px-6 py-3">Names</th>
            <th scope="col" class="px-6 py-3">Area</th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('province')">
              Province
              <span v-if="sortBy === 'province'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
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
            <th scope="col" class="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(csag, index) in filteredCSAG" :key="index" class="bg-white border-b">
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
            <td class="px-6 py-4 flex">
              <button @click="editEntry(csag)" class="bg-grey-100 text-white px-3 py-2 rounded mr-2"><img src="../../assets/icons/edit.png" style="width: 30px;"></button>
              <button @click="deleteEntry(csag.id)" class="bg-grey-100 text-white px-3 py-2 rounded"><img src="../../assets/icons/remove.png" style="width: 25px;"></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredCSAG.length === 0" class="text-center mt-4 text-gray-600">
        No results found.
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div class="bg-white w-1/2 p-6 rounded-lg shadow-lg">
        <form @submit.prevent="addNewEntry">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" 
                   :value="formatInput(newEntry.name)" 
                   @input="updateEntry('name', $event.target.value)" 
                   class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                   required>
          </div>

          <div class="mb-4">
            <label for="area" class="block text-sm font-medium text-gray-700">Area</label>
            <input type="text" id="area" 
                   :value="formatInput(newEntry.area)" 
                   @input="updateEntry('area', $event.target.value)" 
                   class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                   required>
          </div>

          <div class="mb-4">
            <label for="province" class="block text-sm font-medium text-gray-700">Province</label>
            <select id="province" v-model="newEntry.province" class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
              <option>BUKIDNON</option>
              <option>CAMIGUIN</option>
              <option>LANAO DEL NORTE</option>
              <option>MISAMIS OCCIDENTAL</option>
              <option>MISAMIS ORIENTAL</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="city_municipality" class="block text-sm font-medium text-gray-700">City/Municipality</label>
            <input type="text" id="city_municipality" 
                   :value="formatInput(newEntry.city_municipality)" 
                   @input="updateEntry('city_municipality', $event.target.value)" 
                   class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                   required>
          </div>

          <div class="mb-4">
            <label for="barangay" class="block text-sm font-medium text-gray-700">Barangay</label>
            <input type="text" id="barangay" 
                   :value="formatInput(newEntry.barangay)" 
                   @input="updateEntry('barangay', $event.target.value)" 
                   class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                   required>
          </div>

          <div class="mb-4">
            <label for="sitio" class="block text-sm font-medium text-gray-700">Sitio</label>
            <input type="text" id="sitio" 
                   :value="formatInput(newEntry.sitio)" 
                   @input="updateEntry('sitio', $event.target.value)" 
                   class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>

          <div class="mb-4">
            <label for="river" class="block text-sm font-medium text-gray-700">River</label>
            <input type="text" id="river" 
                   :value="formatInput(newEntry.river)" 
                   @input="updateEntry('river', $event.target.value)" 
                   class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                   required>
          </div>

          <div class="mb-4">
            <label for="received" class="block text-sm font-medium text-gray-700">Date Received</label>
            <input type="date" id="received" v-model="newEntry.received" class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
          </div>

          <div class="mb-4">
            <label for="released" class="block text-sm font-medium text-gray-700">Date Released</label>
            <input type="date" id="released" v-model="newEntry.released" class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
          </div>

          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <input type="text" id="status" 
                   :value="formatInput(newEntry.status)" 
                   @input="updateEntry('status', $event.target.value)" 
                   class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                   required>
          </div>

          <div class="mb-4">
            <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea id="remarks" v-model="newEntry.remarks" class="p-1 mt-1 block w-full bg-green-300 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
          </div>

          <div class="flex justify-end">
            <button type="button" @click="showModal = false" class="bg-red-500 text-white hover:bg-red-300 hover:text-black px-4 py-2 rounded mr-2">Cancel</button>
            <button type="submit" class="bg-amber-400 hover:bg-amber-100 text-black px-4 py-2 rounded">{{ isEditMode ? 'Update Entry' : 'Add Entry' }}</button>
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
import debounce from 'lodash/debounce';
import axios from 'axios';
import { API_BASE_URL } from '../../config'

export default {
  components: { Header, UserBtn, MonthBarChart, PieChart },
  data() {
    return {
      csag: [],
      showModal: false,
      isEditMode: false,
      editingId: null,
      searchQuery: '',
      sortBy: '',
      sortOrder: 'asc',
      newEntry: this.getEmptyEntry(),
    };
  },
  computed: {
    filteredCSAG() {
    return this.getFilteredAndSortedData();
  },
  totalSum() {
    const latestYear = Math.max(...this.csag.map(item => new Date(item.released).getFullYear()));
    return this.csag
      .filter(csag => new Date(csag.released).getFullYear() === latestYear)
      .length;
  },
  monthlyTotals() {
      const latestYear = Math.max(...this.csag.map(item => new Date(item.released).getFullYear()));
      const monthlyData = Array(12).fill(0); // Initialize an array for 12 months

      this.csag.forEach(csag => {
        const releaseDate = new Date(csag.released);
        if (releaseDate.getFullYear() === latestYear) {
          const month = releaseDate.getMonth(); // 0 = January, 11 = December
          monthlyData[month]++;
        }
      });

    return monthlyData;
  },
  provinceData() {
      const latestYear = Math.max(...this.csag.map(item => new Date(item.released).getFullYear()));
      const provinceTotals = {};

      this.csag.forEach(csag => {
        const Year = new Date(csag.released);
        if (Year.getFullYear() === latestYear) {
          if (!provinceTotals[csag.province]) {
            provinceTotals[csag.province] = 0;
          }
          provinceTotals[csag.province]++;
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
    formatInput(value) {
      return value ? value.toUpperCase() : '';
    },
    updateEntry(field, value) {
      this.newEntry[field] = value.toUpperCase();
    },
    editEntry(csag) {
      this.newEntry = { ...csag };
      this.isEditMode = true;
      this.editingId = csag.id;
      this.showModal = true;
    },
    deleteEntry(id) {
      if (confirm('Are you sure you want to delete this entry?')) {
        axios.delete(`${API_BASE_URL}/api/csag/${id}`)
          .then(() => {
            this.csag = this.csag.filter(item => item.id !== id);
          })
          .catch(error => {
            console.error('Error deleting entry:', error.response ? error.response.data : error.message);
          });
      }
    },
    fetchCSAG() {
      axios.get(`${API_BASE_URL}/api/csag`)
        .then(response => {
          this.csag = response.data;
        })
        .catch(error => {
          console.error('Error fetching CSAG:', error);
        });
    },
    addNewEntry() {
      if (this.isEditMode) {
        axios.put(`${API_BASE_URL}/api/csag/${this.editingId}`, this.newEntry)
          .then(response => {
            const index = this.csag.findIndex(item => item.id === this.editingId);
            if (index !== -1) {
              this.csag.splice(index, 1, response.data);
            }
            this.clearNewEntry();
          })
          .catch(error => {
            console.error('Error updating entry:', error.response ? error.response.data : error.message);
          });
      } else {
        axios.post(`${API_BASE_URL}/api/csag`, this.newEntry)
          .then(response => {
            this.csag.push(response.data);
            this.clearNewEntry();
          })
          .catch(error => {
            console.error('Error adding entry:', error.response ? error.response.data : error.message);
          });
      }
    },
    clearNewEntry() {
      this.newEntry = this.getEmptyEntry();
      this.showModal = false;
      this.isEditMode = false;
      this.editingId = null;
    },
    debouncedSearch: debounce(function() {
      this.searchData();
    }, 300),
    searchData() {
      // Trigger re-computation of filteredCSAG
      this.filteredCSAG;
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
  const filtered = this.csag.filter(csag =>
    Object.values(csag).some(val => 
      String(val).toLowerCase().includes(query)
    )
  );

  if (this.sortBy) {
    filtered.sort((a, b) => {
      let aValue = a[this.sortBy];
      let bValue = b[this.sortBy];

      if (this.sortBy === 'released' || this.sortBy === 'received') {
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
    updateCharts() {
    this.$nextTick(() => {
      this.initCharts();
    });
  },
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  },
  debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
  },
  mounted() {
    this.fetchCSAG();
  }
};
</script>