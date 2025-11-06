<template>
  <div class="fttatable">
    <!-- Status Section  -->
    <div class="flex justify-center">
      <p class="m-8 border border-green-800 p-2 rounded-lg">On-going Process: {{ statusCount('On-going Process') }}</p>
      <p class="m-8 border border-green-800 p-2 rounded-lg">Denied: {{ statusCount('Denied') }}</p>
      <p class="m-8 border border-green-800 p-2 rounded-lg">With Order of Finality: {{ statusCount('With Order of Finality') }}</p>
      <p class="m-8 border border-green-800 p-2 rounded-lg">Issued: {{ statusCount('Issued') }}</p>
      <p class="m-8 border border-green-800 p-2 rounded-lg">Endorsed to MGB CO for Clearance: {{ statusCount('Endorsed to MGB CO for Clearance') }}</p>
      <p class="m-8 border border-green-800 p-2 rounded-lg">Endorsed to MGB CO for Approval: {{ statusCount('Endorsed to MGB CO for Approval') }}</p>
    </div>

    <!-- Search and Add Section -->
    <div class="flex justify-between mt-8">
      <div class="h-10 flex w-2/5 ml-6">
        <div class="flex items-center bg-blue-100 rounded-l-lg px-3 pointer-events-none">
          <svg class="w-4 h-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input v-model="searchQuery" @input="debouncedSearch" type="search" id="default-search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search Tenement Name or Location of the application ..." required />
      </div>
    </div>

    <!-- Modal Section -->
    <div v-if="viewComment" class="fixed top-0 left-0 w-full h-full flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5); z-index: 1000;" @click.self="closeComment">
      <div class="bg-white rounded-lg" style="width: 400px; max-width: 90%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); animation: fadeIn 0.3s ease-in-out;">
        <div class="flex justify-between items-center p-4" style="border-bottom: 1px solid #ddd;"> 
          <h2 class="text-lg font-bold">Comments</h2>
        </div>
        <div class="p-4">
          <textarea v-model="selectedDetail.comments" class="w-full p-1" placeholder="Add comment . . ."></textarea>
        </div>
        <div class="p-4 text-right" style="border-top: 1px solid #ddd;">
          <button @click="saveComment(selectedDetail)" class="py-1 px-2 rounded cursor-pointer hover:bg-green-300 bg-green-800 text-white hover:text-black mx-1">Save</button>
          <button @click="closeComment" class="py-1 px-2 rounded cursor-pointer hover:bg-red-700 bg-red-800 text-white">Close</button>
        </div>
      </div>
    </div>

    <div class="ftta_scrollable">
      <table class="w-full text-sm text-left text-black-300 dark:text-gray-400 shadow-xl overflow-y-auto max-h-100px">
        <thead class="sticky top-0 z-50 border-y-50" style="z-index: 1;">
          <tr class="bg-green-800 text-white">
            <th class="border text-center p-2">Stages of Processing</th>
            <th class="border text-center p-2 cursor-pointer" @click="sortmethod('status')">
              Status
              <span v-if="sortKey === 'status'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th class="border text-center p-2">Tenement No.</th>
            <th class="border text-center p-2 cursor-pointer" @click="sortmethod('tenement_name')">
              Tenement Name
              <span v-if="sortKey === 'tenement_name'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th class="border text-center p-2">Area (HA)</th>
            <th class="border text-center p-2 cursor-pointer" @click="sortmethod('date_filed')">
              Date Filed
              <span v-if="sortKey === 'date_filed'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th class="border text-center p-2">Location/s</th>
            <th class="border text-center p-2">Commodity</th>
            <th class="border text-center p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in filteredEntries" :key="index">
            <td class="border text-center p-2">{{ detail.stage_of_processing }}</td>
            <td class="border text-center p-2">{{ detail.status }}</td>
            <td class="border text-center p-2">{{ detail.tenement_number }}</td>
            <td class="border text-center p-2">{{ detail.tenement_name }}</td>
            <td class="border text-center p-2">{{ calculateRowArea(detail) }}</td>
            <td class="border text-center p-2">{{ detail.date_filed }}</td>
            <td class="border text-center p-2"><span v-html="formatLocation(detail)"></span></td>
            <td class="border text-center p-2">{{ detail.commodity }}</td>
            <td class="border p-2 text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <!-- View Button -->
                <button @click="navigateTomodalView(detail.id)" class="rounded">
                  <img src="../../../assets/icons/eye.png" class="w-6">
                </button>
                <button @click="showComment(detail)" class="pr-2 rounded" style="position: relative;">
                  <img src="../../../assets/icons/comment.png" style="width: 20px;">
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { API_BASE_URL } from '../../../config';
import { viewDetail, detail_id } from '../dashboards/v-FTAA-dashboard.vue';

export default {
  name: 'typeofapp',
  data() {
    return {
      details: [],
      selectedDetail: null,
      viewComment: false,
      searchQuery: '',
      viewDetail: false,
      detail_id: null,
      sortKey: '',
      sortOrder: 'asc',
    };
  },
  computed: {
    sortedEntries() {
      // Sort and return the entries based on sortKey and sortOrder
      return [...this.details].sort((a, b) => {
        let result = 0;
        if (a[this.sortKey] > b[this.sortKey]) result = 1;
        else if (a[this.sortKey] < b[this.sortKey]) result = -1;
        return this.sortOrder === 'asc' ? result : -result;
      });
    },
    filteredEntries() {
      // Filter the sorted entries based on the search query
      const query = this.searchQuery.toLowerCase();
      return this.sortedEntries.filter((detail) => {
        return (
          (detail.tenement_name && detail.tenement_name.toLowerCase().includes(query)) ||
          (detail.province && detail.province.toLowerCase().includes(query)) ||
          (detail.city && detail.city.toLowerCase().includes(query)) ||
          (detail.barangay && detail.barangay.toLowerCase().includes(query))
        );
      });
    },
    statusCount() {
      // Return the count of entries with a specific status
      return (status) => this.details.filter((detail) => detail.status === status).length;
    },
  },
  mounted() {
    this.fetchDetails();
  },
  methods: {
    calculateRowArea(detail) {
      return (
        (parseFloat(detail.area_hectares) || 0) +
        (parseFloat(detail.area_hectares1) || 0) +
        (parseFloat(detail.area_hectares2) || 0) +
        (parseFloat(detail.area_hectares3) || 0)
      );
    },
    formatLocation(detail) {
      const locations = [
        `${detail.barangay}, ${detail.city}, ${detail.province}`,
        `${detail.barangay1}, ${detail.city1}, ${detail.province1}`,
        `${detail.barangay2}, ${detail.city2}, ${detail.province2}`,
        `${detail.barangay3}, ${detail.city3}, ${detail.province3}`
      ];

      // Filter out any locations that are `null`, `undefined`, or empty
      const validLocations = locations.filter(loc => !loc.includes('null') && !loc.includes('undefined') && loc.trim() !== ', , ');

      return validLocations.join('<br>'); // Join locations with a line break
    },
    async fetchDetails() {
      try {
        const response = await axios.get(`${API_BASE_URL}/get_details/`);
        this.details = response.data.filter(det => det.application == 'ftta');
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    },
    navigateTomodalView(id) {
      detail_id.value = id;
      viewDetail.value = true; // Define your navigation logic here
    },
    // comment methods
    showComment(detail) {
      if (!detail) {
        console.error('No detail provided to showComment');
        return;
      }
      this.selectedDetail = detail;
      this.viewComment = true;
    },
    closeComment() {
      this.viewComment = false;
      this.selectedDetail = null;
    },
    async saveComment(detail) {
      // Ensure selectedDetail is valid
      if (!detail || !detail.id) {
        alert('Invalid detail selected. Please refresh and try again.');
        return;
      }

      // Ensure the comment is not empty
      console.log(detail.comments); // Add this to see the actual value
      if (!detail.comments || detail.comments.trim() === '') {
        alert('Please enter a valid comment before saving.');
        return;
      }

      try {
        const payload = {
          id: detail.id,
          comments: detail.comments.trim(), // Send trimmed comment to avoid unnecessary spaces
        };

        // Send the comment to the backend
        const response = await axios.post(`${API_BASE_URL}/update_comment`, payload);

        // Update the details array with the new comment
        const updatedDetails = this.details.map((item) => {
          if (item.id === detail.id) {
            return { ...item, comments: detail.comments.trim(), hasComment: true };
          }
          return item;
        });
        this.details = updatedDetails;

        // Show success message and close the modal
        alert(response.data.message || 'Comment saved successfully!');
        this.closeComment();
      } catch (error) {
        console.error('Error saving comment:', error);
        alert(error.response?.data?.error || 'Failed to save the comment. Please try again.');
      }
    },
    //end comment methods
    sortmethod(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    debouncedSearch() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        // Handle debounce logic
      }, 300);
    },
  },
};
</script>

<style scoped>
.fttatable {
  flex: auto;
  flex-direction: column;
  border-collapse: collapse;
  width: 100%;
}

.ftta_scrollable {
  margin: 15px;
  box-shadow: 2px 3px 5px rgb(175, 175, 175);
  height: 369px;
  overflow-y: auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
