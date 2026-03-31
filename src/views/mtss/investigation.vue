<template>
  <div>
    <!-- Header and User Button Section -->
    <div class="flex">
      <Header />
      <UserBtn />
    </div>

    <!-- Title Section -->
    <div class="flex flex-col mt-18 justify-center font-bold text-center">
      <h1 class="text-4xl">Investigation</h1>
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
          <PieChart v-if="Object.keys(provinceData).length > 0" :provinceData="provinceData" />
          <div v-else class="text-center text-gray-500">
            No province data available for the pie chart.
          </div>
        </div>
      </div>

    </div>

    <!-- Total Sum Section -->
    <div class="flex bg-white justify-between pl-4 pt-4">
      <h2 class="flex text-xl font-semibold">
        There are {{ totalSum }} total sum of released Investigation Reports.
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
            <input v-model="searchQuery" @input="debouncedSearch" type="search" id="default-search" class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search name, province, city, barangay, river, status or remarks..." required />
          </div>
        </div>
      </div>

      <div class="flex content-center gap-3">
        <button 
            @click="downloadSummary" 
            class="bg-blue-400 hover:bg-blue-100 h-12 px-4 text-white rounded-lg">
            Download Summary
        </button>

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
 <!-- Table Section -->
    <div class="mt-8 overflow-x-auto">
      <table class="w-full table-auto text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th class="px-2 py-2 w-8">No</th>
            <th class="px-2 py-2 w-20 cursor-pointer truncate" @click="sortByDate('month')">
              Month
              <span v-if="sortKey === 'month'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            
            <th class="px-2 py-2 w-64 truncate">Title of Document</th>
            <th class="px-2 py-2 w-32 truncate">Complainant</th>
            <th class="px-2 py-2 w-32 cursor-pointer" @click="sortByDate('complaint_received')">
              Complaint Received
              <span v-if="sortKey === 'complaint_received'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="px-2 py-2 w-32">Province</th>
            <th class="px-2 py-2 w-32 truncate">City/Municipality</th>
            <th class="px-2 py-2 w-32 truncate">Barangay</th>
            <th class="px-2 py-2 w-32 truncate">Sitio</th>
            <th v-if="!hideColumns.date_acted" class="px-2 py-2 w-32">Date Acted</th>
            <th v-if="!hideColumns.report_date" class="px-2 py-2 w-32 cursor-pointer" @click="sortByDate('report_date')">
              Report Date
              <span v-if="sortKey === 'report_date'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th v-if="!hideColumns.transmittal_date" class="px-2 py-2 w-32 cursor-pointer" @click="sortByDate('transmittal_date')">
              Transmittal Date
              <span v-if="sortKey === 'transmittal_date'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="px-2 py-2 w-32 cursor-pointer" @click="sortByDate('released_date')">
              Date Released
              <span v-if="sortKey === 'released_date'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th v-if="!hideColumns.mmd_personnel" class="px-2 py-2 w-40 truncate">MMD Personnel</th>
            <th class="px-2 py-2 w-32 truncate">Remarks</th>
            <th class="px-2 py-2 w-32 truncate">Historical Data</th>
            <th class="px-2 py-2 w-32 text-center">Proof of MOV Uploaded</th>
            <th class="px-2 py-2 w-32 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(entry, index) in filteredEntries" :key="entry.ID" class="bg-white border-b">
            <td class="px-2 py-2">{{ index + 1 }}</td>
            <td class="px-2 py-2 truncate">{{ entry.month }}</td>
            
            <td class="px-2 py-2 w-64 break-words">{{ entry.text_field }}</td>
            <td class="px-2 py-2 w-32 truncate">{{ entry.complainant }}</td>
            <td class="px-2 py-2 w-32">{{ entry.complaint_received }}</td>
            <td class="px-2 py-2 w-32">{{ entry.province }}</td>
            <td class="px-2 py-2 w-32 truncate">{{ entry.city_municipality }}</td>
            <td class="px-2 py-2 w-32 truncate">{{ entry.barangay }}</td>
            <td class="px-2 py-2 w-32 truncate">{{ entry.sitio }}</td>
            <td v-if="!hideColumns.date_acted" class="px-2 py-2 w-32">{{ entry.date_acted }}</td>
            <td v-if="!hideColumns.report_date" class="px-2 py-2 w-32">{{ entry.report_date }}</td>
            <td v-if="!hideColumns.transmittal_date" class="px-2 py-2 w-32">{{ entry.transmittal_date }}</td>
            <td class="px-2 py-2 w-32">{{ entry.released_date }}</td>
            <td v-if="!hideColumns.mmd_personnel" class="px-2 py-2 w-40 truncate">{{ entry.mmd_personnel }}</td>
            <td class="px-2 py-2 w-32  truncate">{{ entry.remarks }}</td>
            <td class="px-2 py-2 w-32 text-center">
              <button @click="openPDF(entry.HistoricalData)" class="bg-blue-500 text-white px-2 py-1 rounded">View</button>
            </td>
            <td class="px-2 py-2 w-32 text-center">
              <button @click="openPDF(entry.MOVpdf)" class="bg-red-500 text-white px-2 py-1 rounded">View</button>
            </td>
            <td class="px-2 py-2 flex justify-center w-32 space-x-1">
              
              <button @click="openLink(entry.coordinates)" class="rounded"><img src="../../assets/icons/map.png" class="w-6"></button>
              <button v-if="!isMMD" @click="openUpdateModal(entry.ID)" class="rounded"><img src="../../assets/icons/edit.png" class="w-6"></button>
              <button v-if="!isMMD" @click="deleteEntry(entry.ID)" class="rounded"><img src="../../assets/icons/remove.png" class="w-6"></button>
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
              <div class="mmt-2 space-y-3">
                <div class="mt-2 flex items-center">
                  <label class="w-48">
                      Select Month:<span class="text-red-500">*</span>
                  </label>
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
                  <label for="text_field" class="text-gray-700">Title of Document<span class="text-red-500">*</span></label>
                  <textarea v-model="newEntry.text_field" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                <div class="mt-2 flex flex-col">
                  <label for="text_field" class="text-gray-700">Complainant<span class="text-red-500">*</span></label>
                  <textarea v-model="newEntry.complainant" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Complaint Received:<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.complaint_received" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                    <p class="mr-5">Province<span class="text-red-500">*</span></p>
                    <select v-model="newEntry.province" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>BUKIDNON</option>
                      <option>CAMUIGUIN</option>
                      <option>LANAO DEL NORTE</option>
                      <option>MISAMIS OCCIDENTAL</option>
                      <option>MISAMIS ORIENTAL</option>
                    </select>
                  </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">City/Municipality:<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.city_municipality" type="text" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Barangay:<span class="text-red-500">*</span></p>
                  <input v-model="newEntry.barangay" type="text" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Sitio:</p>
                  <input v-model="newEntry.sitio" type="text" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date Acted:</p>
                  <input v-model="newEntry.date_acted" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
                  <p class="mr-5">Date Released:</p>
                  <input v-model="newEntry.released_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">MMD Personnel:</p>
                  <input v-model="newEntry.mmd_personnel" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Remarks:</p>
                  <input v-model="newEntry.remarks" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Historical Data:</p>
                  <input ref="HistoricalData" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">MOV:</p>
                  <input ref="MOVpdf" type="file" accept="application/pdf" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Enter map url:</p>
                  <input v-model="newEntry.coordinates" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
    <!-- End Delete All Confirmation Modal -->

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
                <div class="mt-2 flex justify-between">
                  <label for="text_field" class="text-gray-700">Select Month</label>
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
                  <label for="text_field" class="text-gray-700">Title of Document</label>
                  <textarea v-model="updateEntry.text_field" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                <div class="mt-2 flex flex-col">
                  <label for="text_field" class="text-gray-700">Complainant</label>
                  <textarea v-model="updateEntry.complainant" id="text_field" rows="4" class="w-full bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Complaint Received:</p>
                  <input v-model="updateEntry.complaint_received" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                    <p class="mr-5">Province</p>
                    <select v-model="updateEntry.province" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>BUKIDNON</option>
                      <option>CAMUIGUIN</option>
                      <option>LANAO DEL NORTE</option>
                      <option>MISAMIS OCCIDENTAL</option>
                      <option>MISAMIS ORIENTAL</option>
                    </select>
                  </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">City/Municipality</p>
                  <input v-model="updateEntry.city_municipality" type="text" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Barangay</p>
                  <input v-model="updateEntry.barangay" type="text" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Sitio</p>
                  <input v-model="updateEntry.sitio" type="text" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Date Acted:</p>
                  <input v-model="updateEntry.date_acted" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
                  <p class="mr-5">Date Released:</p>
                  <input v-model="updateEntry.released_date" type="date" class="pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">MMD Personnel:</p>
                  <input v-model="updateEntry.mmd_personnel" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Remarks:</p>
                  <input v-model="updateEntry.remarks" type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                

              <div class="mt-2 flex">
                    <!-- Label -->
                    <p class="mr-5 w-40">Historical Data:</p>

                    <!-- File section -->
                    <div class="flex flex-col">
                      <input ref="HistoricalData" type="file" accept="application/pdf" @change="handleFileUpload($event, 'HistoricalData')" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <div v-if="updateEntry.HistoricalData" class="flex items-center mt-1">
                        <input type="checkbox" v-model="deleteHistoricalData" class="mr-2">
                        <label>Delete existing</label>
                      </div>
                    </div>
                </div>

                <div class="mt-2 flex">
                    <!-- Label -->
                    <p class="mr-5 w-40">Proof of MOV:</p>

                    <!-- File section -->
                    <div class="flex flex-col">
                      <input ref="MOVpdf" type="file" accept="application/pdf" @change="handleFileUpload($event, 'MOVpdf')" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <div v-if="updateEntry.MOVpdf" class="flex items-center mt-1">
                        <input type="checkbox" v-model="deleteMOV" class="mr-2">
                        <label>Delete existing</label>
                      </div>
                    </div>
                </div>
                
                <div class="mt-2 flex justify-between">
                  <p class="mr-5">Enter map URL:</p>
                  <input v-model="updateEntry.coordinates"  type="text" class="w-72 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
import AddBtn from '../../components/MTSS/add-btn.vue';
import UserBtn from '../../components/user-dbbtn.vue';
import MonthBarChart from '../../components/bymonth-barchart.vue';
import PieChart from '../../components/byprovince-piechart.vue';
import viewdetail from '../../components/MTES/modals/view/MPSA-details.vue';
import { viewDetail, detail_id } from '../mtes/dashboards/MPSA-dashboard.vue';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { API_BASE_URL } from '../../config'

export default {

  components: {Header,UserBtn,AddBtn,MonthBarChart,PieChart,viewdetail},

  data() {
    return {
      investigation: [],
      searchQuery: '',
      sortKey: '',
      sortOrder: 'asc',
      showModal: false,
      newEntry: this.getEmptyEntry(),
      isUpdateModalOpen: false, // State to track if the update modal is open
      updateEntry: this.getEmptyEntry(), // Object to store the entry being updated
     
      userRole: localStorage.getItem('userRole') || '',
      showDeleteAllModal: false, // State for delete all confirmation modal

      file: null,
      MOVpdfFile: null,
      HistoricalDataFile: null,

      deleteMOV: false, 
      deleteHistoricalData: false,

      // Add hideColumns object to control visibility of specific columns
      hideColumns: {
      date_acted: true,
      report_date: true,
      transmittal_date: true,
      mmd_personnel: true,
      },
  };
},

  computed: {
  filteredEntries() {
    return this.getFilteredAndSortedData();
  },
  // Method to get the total count of entries for the latest year
  totalSum() {
    if (!this.investigation.length) return 0; // Check if entries is empty
    
    // Find the latest year from the dataset
    const latestYear = Math.max(...this.investigation.map(item => {
      const year = new Date(item.released_date).getFullYear();
      return isNaN(year) ? 0 : year; // Handle invalid dates
    }));
    
    // Filter dataset for the latest year and count the entries
    const count = this.investigation.filter(investigation => new Date(investigation.released_date).getFullYear() === latestYear).length;
    console.log('Total Count for Latest Year:', count); // Log the total count
    
    return count;
  },

  monthlyTotals() {
    // Extract the latest year from the dataset
    const latestYear = Math.max(...(this.investigation || []).map(item => {
      const date = new Date(item.released_date);
      return isNaN(date.getTime()) ? 0 : date.getFullYear(); // Handle invalid dates
    }));

    // Initialize an array for 12 months
    const monthlyData = Array(12).fill(0);

    // Populate the monthlyData array
    (this.investigation || []).forEach(entry => {
      const releaseDate = new Date(entry.released_date);
      if (releaseDate.getFullYear() === latestYear && !isNaN(releaseDate.getTime())) {
        const month = releaseDate.getMonth(); // 0 = January, 11 = December
        monthlyData[month]++;
      }
    });

    return monthlyData;
  },

  provinceData() {
      const latestYear = Math.max(...this.investigation.map(item => new Date(item.released_date).getFullYear()));
      const provinceTotals = {};

      this.investigation.forEach(investigation => {
        const Year = new Date(investigation.released_date);
        if (Year.getFullYear() === latestYear) {
          if (!provinceTotals[investigation.province]) {
            provinceTotals[investigation.province] = 0;
          }
          provinceTotals[investigation.province]++;
        }
      });

      return provinceTotals;
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
        ID: '',
        text_field: '',
        complainant: '',
        complaint_received: '',
        province: '',
        city_municipality: '',
        barangay: '',
        sitio: '',
        date_acted: '',
        report_date: '',
        transmittal_date: '',
        released_date: '',
        mmd_personnel: '',
        remarks: '',

        HistoricalData: '',
        MOVpdf: '',
        coordinates: '',


      };
    },  

    confirmDeleteAll() {
      this.showDeleteAllModal = false;
      axios.delete(`${API_BASE_URL}/api/MonitoringInvestigation/deleteAllRecords`)
        .then(() => {
          this.investigation = [];
          alert("All entries deleted successfully.");
        })
        .catch(error => {
          console.error(error);
          alert("Failed to delete all entries.");
        });
    },

    fetchInvestigation() {
      axios.get(`${API_BASE_URL}/api/MonitoringInvestigation`)
        .then(response => {
          this.investigation = response.data;
        })
        .catch(error => {
          console.error('Error fetching Investigation:', error);
          alert('Failed to load data. Please check if the backend server is running.');
        });
    },
    getFilteredAndSortedData() {
    const query = this.searchQuery.toLowerCase();
    let filteredData = this.investigation.filter(entry =>
      entry.month.toLowerCase().includes(query) ||
      entry.released_date.toLowerCase().includes(query) ||
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

    addNewEntry() {

      // Client-side validation for required fields
      const requiredFields = ['month', 'text_field', 'complainant', 'complaint_received','province','city_municipality','barangay'];
      for (const field of requiredFields) {
        if (!this.newEntry[field]) {
          alert(`The field "${field.replace(/_/g, ' ')}" is required.`);
          return;
        }
      }

      const fileInput = this.$refs.MOVpdf.files[0] || null; // Use null if no file is selected
      const fileInput2 = this.$refs.HistoricalData.files[0] || null; // Use null if no file is selected

      if (fileInput && fileInput.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size exceeds 5MB.');
        return;
      }
      if (fileInput2 && fileInput2.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size exceeds 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('month', this.newEntry.month);
      formData.append('text_field', this.newEntry.text_field);
      formData.append('complainant', this.newEntry.complainant);
      formData.append('complaint_received', this.newEntry.complaint_received);
      formData.append('province', this.newEntry.province);
      formData.append('city_municipality', this.newEntry.city_municipality);
      formData.append('barangay', this.newEntry.barangay);
      formData.append('sitio', this.newEntry.sitio);
      formData.append('date_acted', this.newEntry.date_acted);
      formData.append('report_date', this.newEntry.report_date);
      formData.append('transmittal_date', this.newEntry.transmittal_date);
      formData.append('released_date', this.newEntry.released_date);
      formData.append('mmd_personnel', this.newEntry.mmd_personnel);
      formData.append('remarks', this.newEntry.remarks);
      
      if (fileInput2) {
      formData.append('HistoricalData', fileInput2);
      }
      if (fileInput) {
      formData.append('MOVpdf', fileInput);
      }
      
      formData.append('coordinates', this.newEntry.coordinates);

      axios.post(`${API_BASE_URL}/api/MonitoringInvestigation`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        this.investigation.push(response.data);
        this.clearNewEntry();
      })
      .catch(error => {
        console.error('Error adding entry:', error.response ? error.response.data : error.message);
      });
    },
    
    clearNewEntry() {
      this.newEntry = {
        month: '',
        text_field: '',
        complainant: '',
        complaint_received: '',
        province: '',
        city_municipality: '',
        barangay: '',
        sitio: '',
        date_acted: '',
        report_date: '',
        transmittal_date: '',
        released_date: '',
        mmd_personnel: '',
        remarks: '',
        HistoricalData: '',
        MOVpdf: '',
        coordinates: '',
      };
      this.showModal = false;
      if (this.$refs.HistoricalData) {
        this.$refs.HistoricalData.value = '';
      }
      if (this.$refs.MOVpdf) {
        this.$refs.MOVpdf.value = '';
      }
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

    openLink(url) {
      if (!url || url === 'null' || url.trim() === '') {
        alert("No map URL available for this entry.");
        return;
      }

      // Ensure the link has a proper protocol
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      window.open(url, "_blank");
    },

    sortByDate(key) {
      this.sortKey = key;
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    deleteEntry(entryID) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this entry?')) {
      axios.delete(`${API_BASE_URL}/api/MonitoringInvestigation/${entryID}`)
        .then(response => {
          // Remove the entry from the local array
          this.investigation = this.investigation.filter(entry => entry.ID !== entryID);
          alert('Entry deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete the entry.');
        });
    }
  },
  


  openUpdateModal(thisID) {
    const entry = this.investigation.find(entry => entry.ID === thisID); // Find the entry to be updated by its number
    if (entry) {
      this.updateEntry = { ...entry }; // Copy the entry data to `updateEntry`
      this.isUpdateModalOpen = true; // Open the update modal
      
      this.deleteMOV = false;
      this.deleteHistoricalData = false;
      this.MOVpdfFile = null;       // ✅ reset file
      this.HistoricalDataFile = null;    
    }
  },

  closeModal() {
    this.isUpdateModalOpen = false; 
    this.updateEntry = this.getEmptyEntry();

          
    this.deleteMOV = false;
    this.deleteHistoricalData = false;
    this.MOVpdfFile = null;       // ✅ reset file
    this.HistoricalDataFile = null;    
  },



  handleFileUpload(event, fileType) {
    console.log('handleFileUpload called with fileType:', fileType);
    if (fileType === 'MOVpdf') {
      this.MOVpdfFile = event.target.files[0];
      console.log('MOVpdfFile set:', this.MOVpdfFile);
    } else if (fileType === 'HistoricalData') {
      this.HistoricalDataFile = event.target.files[0];
      console.log('HistoricalData set:', this.HistoricalDataFile);
    }
  },

  // Method to handle the update process
  async handleUpdate() {

      // Client-side validation for required fields
      const requiredFields = ['month', 'text_field', 'complainant', 'complaint_received','province','city_municipality','barangay'];
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
    formData.append('month', this.updateEntry.month);
    formData.append('text_field', this.updateEntry.text_field);
    formData.append('complainant', this.updateEntry.complainant);
    formData.append('complaint_received', this.updateEntry.complaint_received);
    formData.append('province', this.updateEntry.province);
    formData.append('city_municipality', this.updateEntry.city_municipality);
    formData.append('barangay', this.updateEntry.barangay);
    if (this.updateEntry.sitio) {
          formData.append('sitio', this.updateEntry.sitio);
    }
    if (this.updateEntry.date_acted) {
          formData.append('date_acted', this.updateEntry.date_acted);
    }
    if (this.updateEntry.report_date) {
          formData.append('report_date', this.updateEntry.report_date);
    }
    if (this.updateEntry.transmittal_date) {
          formData.append('transmittal_date', this.updateEntry.transmittal_date);
    } 
    if (this.updateEntry.released_date) {
          formData.append('released_date', this.updateEntry.released_date);
    } 
    if (this.updateEntry.mmd_personnel) {
          formData.append('mmd_personnel', this.updateEntry.mmd_personnel);
    } 
    if (this.updateEntry.remarks) {
          formData.append('remarks', this.updateEntry.remarks);
    } 
    if (this.updateEntry.coordinates) {
      formData.append('coordinates', this.updateEntry.coordinates);
    } 
   
    // Append the file if selected
    // ✅ If new file uploaded
    if (this.MOVpdfFile) {
      formData.append('MOVpdf', this.MOVpdfFile);
    }

    // ✅ If delete checkbox checked
    if (this.deleteMOV) {
      formData.append('clear_MOVpdf', '1');
    }

    // Append the file if selected

    // ✅ If new file uploaded
    if (this.HistoricalDataFile) {
      formData.append('HistoricalData', this.HistoricalDataFile);
    }

    // ✅ If delete checkbox checked
    if (this.deleteHistoricalData) {
      formData.append('clear_HistoricalData', '1');
    }



    axios.post(`${API_BASE_URL}/api/MonitoringInvestigation/${this.updateEntry.ID}`, formData)
      .then(response => {
        const index = this.investigation.findIndex(entry => entry.ID === this.updateEntry.ID);
        if (index !== -1) {
          this.investigation[index] = response.data; // Directly assign the updated data to the entry in the array
        }

        
        this.MOVpdfFile = null;
        this.HistoricalDataFile = null;
        this.deleteMOV = false;
        this.deleteHistoricalData = false;
    
        this.closeModal(); // Close the modal after successful update
        alert('Entry updated successfully!');
      })
      .catch(error => {
        console.error('Error adding entry:', error.response ? error.response.data : error.message);
      });
  },    
    debouncedSearch: debounce(function() {
      this.fetchInvestigation();
    }, 300),

    downloadSummary() {
      const data = this.filteredEntries;
      if (data.length === 0) {
        alert('No data to download.');
        return;
      }

      // Define CSV headers
      const headers = [
        'month',
        'text_field',
        'complainant',
        'complaint_received',
        'province',
        'city_municipality',
        'barangay',
        'sitio',
        'date_acted',
        'report_date',
        'transmittal_date',
        'released_date',
        'mmd_personnel',
        'remarks'
      ];

      // Convert data to CSV rows
      const csvRows = data.map((entry, index) => [
        index + 1,
        entry.month,
        entry.text_field,
        entry.complainant,
        entry.complaint_received,
        entry.province,
        entry.city_municipality,
        entry.barangay,
        entry.sitio,
        entry.date_acted,
        entry.report_date,
        entry.transmittal_date,
        entry.released_date,
        entry.mmd_personnel,
        entry.remarks

      ]);

      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field || ''}"`).join(','))
        .join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `investigation_summary_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    
  },

  

  mounted() {
    this.fetchInvestigation();
    console.log('userRole:', this.userRole);
    console.log('isMMD:', this.isMMD);
  }
};
</script>
