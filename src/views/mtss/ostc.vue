<template>
  <div>
    <!-- Header and User Button Section -->
    <div class="flex">
      <Header />
      <UserBtn />
    </div>

    <!-- Title Section -->
    <div class="flex flex-col mt-18 justify-center font-bold text-center">
      <h1 class="text-4xl">Ore Sample Transport Certificate</h1>
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
        There are {{ totalSum }} total sum of released Ore Sample Transport Certificates.
      </h2>
    </div>

    <div class="flex justify-between mt-8">

      <!-- Search -->
      <div class="flex w-2/5 ml-2">
        <div class="flex items-center bg-blue-100 rounded-l-lg px-3 pointer-events-none">
          <!-- search icon -->
        </div>

        <input
          v-model="searchQuery"
          @input="debouncedSearch"
          type="search"
          class="block w-full p-4 text-sm border border-gray-300 rounded-r-lg bg-gray-50"
          placeholder="Search client and certification no ..."
        />
      </div>

      <!-- Buttons RIGHT SIDE -->
      <div class="flex gap-3 mr-4">

        <AddBtn v-if="!isMMD" @click="showModal = true" />

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
            <th scope="col" class="px-6 py-3">Client</th>
            <th scope="col" class="px-6 py-3">Certification No.</th>
            <th scope="col" class="px-6 py-3">Kind of Sample</th>
            <th scope="col" class="px-6 py-3">Weight</th>
            <th scope="col" class="px-6 py-3">Source / Origin</th>
            <th scope="col" class="px-6 py-3">Destination</th>

            <th v-if="!hideColumns.received_ord" scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('received_ord')">
              Date Received by ORD
              <span v-if="sortKey === 'received_ord'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th v-if="!hideColumns.received_mmd" scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('received_mmd')">
              Date Received by MMD
              <span v-if="sortKey === 'received_mmd'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th v-if="!hideColumns.payment_date" scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('payment_date')">Payment Date
              <span v-if="sortKey === 'payment_date'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th v-if="!hideColumns.sample_inspection" scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('sample_inspection')">Sample Inspection
              <span v-if="sortKey === 'sample_inspection'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3 cursor-pointer" @click="sortByDate('issued')">
              Date Issued
              <span v-if="sortKey === 'issued'" aria-label="Sorted ascending">
                <template v-if="sortOrder === 'asc'">▲</template>
                <template v-else>▼</template>
              </span>
            </th>
            <th scope="col" class="px-6 py-3">MMD Personnel</th>
            <th scope="col" class="px-6 py-3 text-center">Proof of MOV Uploaded</th>
            <th v-if="!isMMD" scope="col" class="px-6 py-3 flex justify-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in filteredEntries" :key="entry.no" class="bg-white border-b"> 
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4" style="width: 300px;">{{ entry.client }}</td>
            <td class="px-6 py-4">{{ entry.certification_no }}</td>
            <td class="px-6 py-4">{{ entry.kind_of_sample }}</td>
            <td class="px-6 py-4">{{ entry.weight }}</td>
            <td class="px-6 py-4">{{ entry.source_origin }}</td>
            <td class="px-6 py-4">{{ entry.destination }}</td>
            <td v-if="!hideColumns.received_ord" class="px-6 py-4">{{ entry.received_ord }}</td>
            <td v-if="!hideColumns.received_mmd" class="px-6 py-4">{{ entry.received_mmd }}</td>
            <td v-if="!hideColumns.payment_date" class="px-6 py-4">{{ entry.payment_date }}</td>
            <td v-if="!hideColumns.sample_inspection" class="px-6 py-4">{{ entry.sample_inspection }}</td>
            <td class="px-6 py-4">{{ entry.issued }}</td>
            <td class="px-6 py-4">{{ entry.mmd_personnel }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="openPDF(entry.MOVpdf)" class="bg-red-500 text-white px-2 py-1 rounded">View</button>
            </td>
            <td class="px-6 py-4 flex justify-center">
              <!-- this is the button to open the modal for updating entry -->
              <button v-if="!isMMD" @click="openUpdateModal(entry.no)" class="bg-grey-100 text-white px-2 py-1 rounded"><img src="../../assets/icons/edit.png" style="width: 25px;"></button>
              <button v-if="!isMMD" @click="deleteEntry(entry.no)" class="bg-grey-100 text-white px-2 py-1 rounded "><img src="../../assets/icons/remove.png" style="width: 20px;"></button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredEntries.length === 0" class="text-center mt-4 text-gray-600">
        No results found.
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
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-2 space-y-3">
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <label class="w-48">
                      Client:<span class="text-red-500">*</span>
                    </label>
                    <input v-model="newEntry.client" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <label class="w-48">
                    Certification No:<span class="text-red-500">*</span>
                    </label>
                    <input v-model="newEntry.certification_no" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <label class="w-48">
                      Kind of Sample:<span class="text-red-500">*</span>
                    </label>
                    <input v-model="newEntry.kind_of_sample" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <label class="w-48">
                      Weight:<span class="text-red-500">*</span>
                    </label>
                    <input v-model="newEntry.weight" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <label class="w-48">
                      Source / Origin:<span class="text-red-500">*</span>
                    </label>
                    <input v-model="newEntry.source_origin" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <label class="w-48">
                      Destination:<span class="text-red-500">*</span>
                    </label>
                    <input v-model="newEntry.destination" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <p class="mr-5">Date Received By ORD:</p>
                    <input v-model="newEntry.received_ord" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <p class="mr-5">Date Received By MMD:</p>
                    <input v-model="newEntry.received_mmd" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <p class="mr-5">Payment Date:</p>
                    <input v-model="newEntry.payment_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <p class="mr-5">Sample Inspection:</p>
                    <input v-model="newEntry.sample_inspection" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <label class="w-48">
                      Date Issued:<span class="text-red-500">*</span>
                    </label>
                    <input v-model="newEntry.issued" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <p class="mr-5">MMD Personnel:</p>
                    <input v-model="newEntry.mmd_personnel" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:items-center">
                    <p class="mr-5">Proof of MOV Uploaded:</p>
                    <input ref="MOVpdf" type="file" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
      <!-- End Modal -->

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
    <!-- End Delete All Confirmation Modal -->

    <!-- This is the modal for update method -->
    <div v-if="isUpdateModalOpen" class="fixed inset-0 overflow-y-auto" aria-modal="true" role="dialog">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <form @submit.prevent="handleUpdate" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Client:<span class="text-red-500 ml-1">*</span></p>
                  <input v-model="updateEntry.client" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>

                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Certification No.:<span class="text-red-500 ml-1">*</span></p>
                  <input v-model="updateEntry.certification_no" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Kind of Sample:<span class="text-red-500 ml-1">*</span></p>
                  <input v-model="updateEntry.kind_of_sample" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Weight:<span class="text-red-500 ml-1">*</span></p>
                  <input v-model="updateEntry.weight" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Source / Origin:<span class="text-red-500">*</span></p>
                  <input v-model="updateEntry.source_origin" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Destination:<span class="text-red-500 ml-1">*</span></p>
                  <input v-model="updateEntry.destination" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date Received By ORD:</p>
                  <input v-model="updateEntry.received_ord" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date Received By MMD:</p>
                  <input v-model="updateEntry.received_mmd" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Payment Date:</p>
                  <input v-model="updateEntry.payment_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Sample Inspection:</p>
                  <input v-model="updateEntry.sample_inspection" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date Issued:<span class="text-red-500 ml-1">*</span></p>
                  <input v-model="updateEntry.issued" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">MMD Personnel:</p>
                  <input v-model="updateEntry.mmd_personnel" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                
                <div class="mt-2 flex">
                  <!-- Label -->
                  <p class="mr-5 w-40">Proof of MOV:</p>

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
    <!-- End Update Modal -->
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
      ostc: [], // Array to store fetched entries
      searchQuery: '', // Search query string
      sortKey: '', // Key to sort entries by
      sortOrder: 'asc', // Sorting order (ascending by default)
      showModal: false, // State for add entry modal
      newEntry: this.getEmptyEntry(), // Template for a new entry
      isUpdateModalOpen: false, // State to track if the update modal is open
      updateEntry: this.getEmptyEntry(), // Object to store the entry being updated
      debouncedSearch: this.debounce(this.search, 300), // Debounced search function
      file: null,
      userRole: localStorage.getItem('userRole') || '', // Store user role for reactivity
      deleteMOV: false,
      showDeleteAllModal: false, // State for delete all confirmation modal

      // Add hideColumns object to control visibility of specific columns
      hideColumns: {
        received_ord: true,
        received_mmd: true,
        payment_date: true,
        sample_inspection: true,
      },
    };
  },
  

  computed: {
    filteredEntries() {
      return this.getFilteredAndSortedData();
    },
    totalSum() {
      const latestYear = Math.max(...this.ostc.map(item => new Date(item.issued).getFullYear()));
      return this.ostc
        .filter(ostc => new Date(ostc.issued).getFullYear() === latestYear)
        .length;
    },
    monthlyTotals() {
      const latestYear = Math.max(...(this.ostc || []).map(item => new Date(item.issued).getFullYear()));
      const monthlyData = Array(12).fill(0);

      (this.ostc || []).forEach(entry => {
        const releaseDate = new Date(entry.issued);
        if (releaseDate.getFullYear() === latestYear) {
          const month = releaseDate.getMonth();
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
        no: '',
        client: '',
        certification_no: '',
        kind_of_sample: '',
        weight: '',
        source_origin: '',
        destination: '',
        received_ord: '',
        received_mmd: '',
        payment_date: '',
        sample_inspection: '',
        issued: '',
        mmd_personnel: '',
        MOVpdf: '',
      };
    },

    confirmDeleteAll() {
      this.showDeleteAllModal = false;
      axios.delete(`${API_BASE_URL}/api/MonitoringOSTC/deleteAllRecords`)
        .then(() => {
          this.ostc = [];
          alert("All entries deleted successfully.");
        })
        .catch(error => {
          console.error(error);
          alert("Failed to delete all entries.");
        });
    },

    deleteEntry(no) {
      if (!confirm('Are you sure you want to delete this entry?')) {
        return;
      }
      axios.delete(`${API_BASE_URL}/api/MonitoringOSTC/${no}`)
        .then(response => {
          this.ostc = this.ostc.filter(entry => entry.no !== no);
          alert('Entry deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete the entry.');
        });
    },
    fetchOSTC() {
      axios.get(`${API_BASE_URL}/api/MonitoringOSTC`)
        .then(response => {
          console.log('Fetched data:', response.data);
          this.ostc = response.data;
        })
        .catch(error => {
          console.error('Error fetching monitoringOSTC:', error);
          alert('Failed to load data. Please check if the backend server is running.');
        });
    },

    addNewEntry() {

      // Client-side validation for required fields
      const requiredFields = ['client', 'certification_no', 'kind_of_sample', 'weight','source_origin','destination','issued'];
      for (const field of requiredFields) {
        if (!this.newEntry[field]) {
          alert(`The field "${field.replace(/_/g, ' ')}" is required.`);
          return;
        }
      }

      const fileInput = this.$refs.MOVpdf.files[0] || null;

      if (fileInput && fileInput.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('client', this.newEntry.client);
      formData.append('certification_no', this.newEntry.certification_no);
      formData.append('kind_of_sample', this.newEntry.kind_of_sample);
      formData.append('weight', this.newEntry.weight);
      formData.append('source_origin', this.newEntry.source_origin);
      formData.append('destination', this.newEntry.destination);
      formData.append('received_ord', this.newEntry.received_ord);
      formData.append('received_mmd', this.newEntry.received_mmd);
      formData.append('payment_date', this.newEntry.payment_date);
      formData.append('sample_inspection', this.newEntry.sample_inspection);
      formData.append('issued', this.newEntry.issued);
      formData.append('mmd_personnel', this.newEntry.mmd_personnel);

      if (fileInput) {
        formData.append('MOVpdf', fileInput);
      }

      axios.post(`${API_BASE_URL}/api/MonitoringOSTC`, formData)
        .then(response => {
          console.log('Added new entry:', response.data);
          this.ostc.push(response.data);
          this.newEntry = this.getEmptyEntry();
          this.showModal = false;
          alert('Entry added successfully!');
        })
        .catch(error => {
          console.error('Error adding entry:', error.response ? error.response.data : error.message);
        });
    },
    // Method to open the update modal
    openUpdateModal(entryNo) {
      const entry = this.ostc.find(e => e.no === entryNo);

      if (entry) {
        this.updateEntry = { ...entry };
        this.file = null;       // ✅ reset file
        this.deleteMOV = false; // reset checkbox
        this.isUpdateModalOpen = true;
      }
    },

    // Method to close the modal
    closeModal() {
      this.isUpdateModalOpen = false;
      this.updateEntry = this.getEmptyEntry();
      this.file = null;        // ✅ reset
      this.deleteMOV = false;
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    // Method to handle the update process
    async handleUpdate() {

      // Client-side validation for required fields
      const requiredFields = ['client', 'certification_no', 'kind_of_sample', 'weight','source_origin','destination','issued'];
      for (const field of requiredFields) {
        if (!this.updateEntry[field]) {
          alert(`The field "${field.replace(/_/g, ' ')}" is required.`);
          return;
        }
      }
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
      formData.append('client', this.updateEntry.client);
      formData.append('certification_no', this.updateEntry.certification_no);
      formData.append('kind_of_sample', this.updateEntry.kind_of_sample);
      formData.append('weight', this.updateEntry.weight);
      formData.append('source_origin', this.updateEntry.source_origin);
      formData.append('destination', this.updateEntry.destination);
      formData.append('issued', this.updateEntry.issued);
      formData.append('mmd_personnel', this.updateEntry.mmd_personnel);
      if (this.updateEntry.received_ord) {
        formData.append('received_ord', this.updateEntry.received_ord);
      }

      if (this.updateEntry.received_mmd) {
        formData.append('received_mmd', this.updateEntry.received_mmd);
      }

      if (this.updateEntry.payment_date) {
        formData.append('payment_date', this.updateEntry.payment_date);
      }

      if (this.updateEntry.sample_inspection) {
        formData.append('sample_inspection', this.updateEntry.sample_inspection);
      }

      // ✅ If new file uploaded
      if (this.file) {
        formData.append('MOVpdf', this.file);
      }

      // ✅ If delete checkbox checked
      if (this.deleteMOV) {
        formData.append('clear_MOVpdf', '1');
      }

    axios.post(`${API_BASE_URL}/api/MonitoringOSTC/${this.updateEntry.no}`, formData)
        .then(response => {
          const index = this.ostc.findIndex(entry => entry.no === this.updateEntry.no);
          if (index !== -1) {
            this.ostc[index] = response.data; // Directly assign the updated data to the entry in the array
          }

          this.file = null;        // ✅ reset file
          this.deleteMOV = false;  // reset checkbox
          this.closeModal(); // Close the modal after successful update

          alert('Entry updated successfully!');
        })
        .catch(error => {
          console.error('Error adding entry:', error.response ? error.response.data : error.message);
          
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
      let filteredData = this.ostc;

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
      if (!filePath) {
        alert('No PDF uploaded.');
        return;
      }

      const cleanedPath = filePath.replace('public/', '');
      const url = `${API_BASE_URL}/storage/${cleanedPath}`;
      window.open(url, '_blank');
    },
  },
  mounted() {
    this.fetchOSTC();
    console.log('userRole:', this.userRole);
    console.log('isMMD:', this.isMMD);
  }
};
</script>