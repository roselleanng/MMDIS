<template>
  <div class="flex">
    <Header />
    <UserBtn />
  </div>

  <div>
    <button @click="scrollToTop" class="scroll-btn top">&#8679;</button>
    <button @click="scrollToBottom" class="scroll-btn bottom">&#8681;</button>
  </div>

<!-- Table Section -->
<div class="flex justify-center">
  <div class="mt-2 text-center w-11/12">

<!-- APPLICANT'S SECTION -->
<p class="text-left text-xl font-semibold p-5">
  APPLICATION DETAILS
  <span
    class="px-2 text-xs text-blue-600 cursor-pointer"
    v-if="userRole !== 'mmd'"
    @click="showEditModal"
  >
    edit
  </span>
</p>
<table class="w-full text-left border border-gray-300">
  <tbody>
    <tr class="border border-gray-300">
      <td class="border border-gray-300 p-3 text-sm font-medium" style="width: 210px;">Tenement Name</td>
      <td class="border border-gray-300 p-3 text-sm" style="width: 700px;">{{ details.tenement_name }}</td>
      <td class="border border-gray-300 p-3 text-sm font-medium" style="width: 210px;">Category</td>
      <td class="border border-gray-300 p-3 text-sm">{{ details.category }}</td>
    </tr>

    <tr class="border border-gray-300">
      <td class="border border-gray-300 p-3 text-sm font-medium">
      Tenement Number
      
      </td>


      <td class="border border-gray-300 p-3 text-sm">{{ details.tenement_number || '' }}</td>
      <td class="border border-gray-300 p-3 text-sm font-medium">Email Address</td>
      <td class="border border-gray-300 p-3 text-sm">{{ details.email }}</td>
    </tr>
    <tr class="border border-gray-300">
      <td class="border border-gray-300 p-3 text-sm font-medium">Location/s</td>
      <td class="border border-gray-300 p-3 text-sm">
        <span v-html="formatLocation(details)"></span>
      </td>
      <td class="border border-gray-300 p-3 text-sm font-medium">Authorized Representative</td>
      <td class="border border-gray-300 p-3 text-sm">{{ details.authorized_rep }}</td>
    </tr>
    <tr class="border border-gray-300">
      <td class="border border-gray-300 p-3 text-sm font-medium">Commodity</td>
      <td class="border border-gray-300 p-3 text-sm">{{ details.commodity }}</td>
      <td class="border border-gray-300 p-3 text-sm font-medium">Address</td>
      <td class="border border-gray-300 p-3 text-sm">{{ details.address }}</td>
    </tr>
    <tr class="border border-gray-300">
      <td class="border border-gray-300 p-3 text-sm font-medium">Date Filed</td>
      <td class="border border-gray-300 p-3 text-sm">{{ details.date_filed }}</td>
      <td class="border border-gray-300 p-3 text-sm font-medium">Contact Number</td>
      <td class="border border-gray-300 p-3 text-sm">{{ details.contact_no }}</td>
    </tr>
    <tr class="border border-gray-300">
      <td class="border border-gray-300 p-3 text-sm font-medium">Others</td>
      <td class="border border-gray-300 p-3 text-sm">
        <span v-if="details.others && details.others !== 'null'">
          {{ details.others }}
        </span>
      </td>
      <td class="border border-gray-300 p-3 text-sm font-medium">Others</td>
      <td class="border border-gray-300 p-3 text-sm">
        <span v-if="details.oth_rs && details.oth_rs !== 'null'">
          {{ details.oth_rs }}
        </span>
      </td>
    </tr>
  </tbody>
</table>

<div
  v-if="showModal"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
  @click.self="hideEditModal"
>
  <div class="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Edit Application Details</h2>
        <p class="text-sm text-gray-500">Update the application information below.</p>
      </div>

      <button
        @click="hideEditModal"
        class="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6 space-y-8">
      <!-- Basic Information -->
      <section>
        <h3 class="w-full text-left mb-4 border-b pb-2 text-base font-semibold text-gray-800">
          Basic Information
        </h3>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Tenement Name</label>
            <input
              v-model="editDetails.tenement_name"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Tenement Number</label>
            <input
              v-model="editDetails.tenement_number"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Category</label>
            <input
              v-model="editDetails.category"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Commodity</label>
            <input
              v-model="editDetails.commodity"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Date Filed</label>
            <input
              v-model="editDetails.date_filed"
              type="date"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Area Hectares</label>
            <input
              v-model="editDetails.area_hectares"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      </section>

      <!-- Contact Information -->
      <section>
        <h3 class="w-full text-left mb-4 border-b pb-2 text-base font-semibold text-gray-800">
          Contact Information
        </h3>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Authorized Representative</label>
            <input
              v-model="editDetails.authorized_rep"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Contact Number</label>
            <input
              v-model="editDetails.contact_no"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Email Address</label>
            <input
              v-model="editDetails.email"
              type="email"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div class="md:col-span-2">
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Address</label>
            <input
              v-model="editDetails.address"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div class="md:col-span-2">
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Others</label>
            <input
              v-model="editDetails.others"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div class="md:col-span-2">
            <label class="mb-1 block text-left text-sm font-medium text-gray-700">Other RS</label>
            <input
              v-model="editDetails.oth_rs"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      </section>

      <!-- Additional Location 1 -->
      <!-- Location Section -->
      <section>
        <div class="flex items-center justify-between mb-4 border-b pb-2">
          <h3 class="text-left text-base font-semibold text-gray-800">
            Location Details
          </h3>

          <button
            v-if="visibleLocationCount < 4"
            type="button"
            @click="addLocation"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Location
          </button>
        </div>

        <!-- PRIMARY LOCATION (this is the main one) -->
        <div class="mb-8">
          <h4 class="text-left mb-4 text-sm font-semibold text-gray-700">
            Primary Location
          </h4>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input v-model="editDetails.barangay" placeholder="Barangay" class="input"/>
            <input v-model="editDetails.city" placeholder="City" class="input"/>
            <input v-model="editDetails.province" placeholder="Province" class="input"/>
            <input v-model="editDetails.area_hectares" placeholder="Area Hectares" class="input"/>
          </div>
        </div>

        <!-- ADDITIONAL 1 -->
        <div v-if="visibleLocationCount >= 2" class="mb-8">
          <h4 class="text-left mb-4 text-sm font-semibold text-gray-700">
            Additional Location 1
          </h4>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input v-model="editDetails.barangay1" placeholder="Barangay" class="input"/>
            <input v-model="editDetails.city1" placeholder="City" class="input"/>
            <input v-model="editDetails.province1" placeholder="Province" class="input"/>
            <input v-model="editDetails.area_hectares1" placeholder="Area Hectares" class="input"/>
          </div>
        </div>

        <!-- ADDITIONAL 2 -->
        <div v-if="visibleLocationCount >= 3" class="mb-8">
          <h4 class="text-left mb-4 text-sm font-semibold text-gray-700">
            Additional Location 2
          </h4>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input v-model="editDetails.barangay2" placeholder="Barangay" class="input"/>
            <input v-model="editDetails.city2" placeholder="City" class="input"/>
            <input v-model="editDetails.province2" placeholder="Province" class="input"/>
            <input v-model="editDetails.area_hectares2" placeholder="Area Hectares" class="input"/>
          </div>
        </div>

        <!-- ADDITIONAL 3 -->
        <div v-if="visibleLocationCount >= 4">
          <h4 class="text-left mb-4 text-sm font-semibold text-gray-700">
            Additional Location 3
          </h4>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input v-model="editDetails.barangay3" placeholder="Barangay" class="input"/>
            <input v-model="editDetails.city3" placeholder="City" class="input"/>
            <input v-model="editDetails.province3" placeholder="Province" class="input"/>
            <input v-model="editDetails.area_hectares3" placeholder="Area Hectares" class="input"/>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <div class="flex justify-end gap-3 border-t bg-white px-6 py-4">
      <button
        @click="hideEditModal"
        class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-white bg-red-600"
      >
        Cancel
      </button>

      <button
        @click="saveApplicationDetails"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>

<!-- CHRONOLOGY SECTION -->
<p class="text-left text-xl font-semibold p-5">Chronology (Application Period)</p>
<table class="w-full text-left border border-gray-300">
  <tbody>
    <tr class="border border-gray-300">
      <td class="border p-3 text-center w-1/4">Date</td>
      <td class="border p-3 text-center w-1/2">Remarks</td>
      <td class="border p-3 text-center w-1/4">Action</td>
    </tr>
    <tr v-for="(entry, index) in chronology" :key="entry.id || index" class="border border-gray-300">
      <td class="border border-gray-300 p-3 py-2 text-sm font-medium">
        <input 
          type="date"
          class="h-[35px] w-full border px-2 rounded"
          v-model="entry.date"
        />
      </td>
      <td class="border border-gray-300 p-3 py-2 text-sm font-medium">
        <textarea class="h-[25px] w-full border px-2" v-model="entry.remarks"></textarea>
      </td>
      <td class="border border-gray-300 p-3 py-2 text-sm font-medium text-center">
        <button v-if="userRole !== 'mmd'" 
        @click="removeChronologyRow(index)"
        class="bg-red-500 text-white px-2 py-1 rounded">
        Remove
      </button>
      </td>
    </tr>
    <tr>
      <td colspan="3" class="border border-gray-300 p-3 text-center">
        <button v-if="userRole !== 'mmd'" @click="addChronologyRow" class="bg-blue-500 text-white px-4 py-2 rounded">Add Another Row</button>
      </td>
    </tr>
  </tbody>
</table>

<!-- MANDATORY REQUIREMENTS SECTION -->
<p class="text-left text-xl font-semibold p-5">MANDATORY REQUIREMENTS</p>


<table class="w-full text-left border-collapse border border-gray-300">
  <thead class="text-xl text-center">
    <tr class="bg-green-800 text-white">
      <th class="p-2 text-base border border-gray-300">Requirements</th>
      <th class="p-2 text-base border border-gray-300" style="width: 300px;">
        Upload Requirements <br /> and Attachments
      </th>
      <th class="p-2 text-base border border-gray-300">Remarks/Status</th>
    </tr>
  </thead>

  <tbody>
    <tr v-for="(req, index) in requirements" :key="req.id || index">

      <td class="border border-gray-300 text-sm font-normal p-3 align-top" style="width: 750px;">
        <div class="flex justify-between items-start gap-2">
          <div class="w-full">
            <label class="font-semibold">
              {{ index + 1 }}.
              <span v-if="index < 5" class="text-gray-500 text-xs">(Default)</span>
            </label>
            <textarea
            v-model="req.requirement_text"
            :readonly="userRole === 'mmd' || index < 5"
            class="w-full border p-2 mt-2"
            rows="6"
          ></textarea>
          </div>

          <button
            v-if="userRole !== 'mmd' && index >= 5"
            @click="removeRequirement(index)"
            class="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Remove
          </button>
          
        </div>
      </td>

      <td class="p-2 text-sm border border-gray-300 align-top">
        <div v-if="userRole !== 'mmd'" class="mb-4">
          <label class="text-sm text-gray-500">Files to upload:</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            @change="handleRequirementUpload(index, 'document', $event)"
            class="hover:bg-amber-100 flex h-10 rounded-md border bg-white px-3 py-2 text-sm text-gray-400 cursor-pointer w-full"
          />
        </div>

        <div class="mb-4">
          <label class="text-sm text-gray-500">Requirements Uploaded:</label>
          <div
            v-for="file in getRequirementUploads(req, 'document')"
            :key="file.id || file.file_name"
            class="flex items-center justify-between mt-1"
          >
            <a
              :href="getStoredFileUrl(file.file_path)"
              target="_blank"
              class="text-sm text-blue-500 hover:underline"
            >
              {{ file.file_name }}
            </a>

            <button
              v-if="userRole !== 'mmd'"
              @click="deleteRequirementUpload(req, file)"
              class="text-red-500 text-xs ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        <div v-if="userRole !== 'mmd'" class="mb-4">
          <label class="text-sm text-gray-500">Images to upload:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            @change="handleRequirementUpload(index, 'image', $event)"
            class="hover:bg-amber-100 flex h-10 rounded-md border bg-white px-3 py-2 text-sm text-gray-400 cursor-pointer w-full"
          />
        </div>

        <div>
          <label class="text-sm text-gray-500">Attachments:</label>
          <div
            v-for="file in getRequirementUploads(req, 'image')"
            :key="file.id || file.file_name"
            class="flex items-center justify-between mt-1"
          >
            <a
              :href="getStoredFileUrl(file.file_path)"
              target="_blank"
              class="text-sm text-blue-500 hover:underline"
            >
              {{ file.file_name }}
            </a>

            <button
              v-if="userRole !== 'mmd'"
              @click="deleteRequirementUpload(req, file)"
              class="text-red-500 text-xs ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      </td>

      <td class="border border-gray-300 text-sm p-3 align-top">
        <div class="flex flex-col items-start">
          <label>Remarks/Status:</label>
          <textarea
            class="h-[120px] w-full border px-2 mb-3"
            v-model="req.remarks"
            :readonly="userRole === 'mmd'"
          ></textarea>

          <label>Recommendations/Lacking Submission:</label>
          <textarea
            class="h-[120px] w-full border p-2 text-red-600"
            v-model="req.recommendation"
            :readonly="userRole === 'mmd'"
          ></textarea>
        </div>
      </td>
    </tr>
    <tr v-if="userRole !== 'mmd'">
    <td colspan="3" class="border border-gray-300 p-3 text-center">
      <button
        @click="addRequirement"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Requirement
      </button>
    </td>
  </tr>
  </tbody>
</table>

    <!-- Summary of Lacking Requirements -->
    <p class="text-left text-xl font-semibold p-5">SUMMARY OF LACKING REQUIREMENTS</p>
    <table class="w-full mb-5 text-left p-2 border border-collapse">
      <thead>
        <tr class="bg-green-800 text-white text-center">
          <th class="w-6/12 p-2 border text-base">Requirements</th>
          <th class="p-2 border text-base">Remarks or Status | Recommendation or Lacking Submission</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(req, index) in requirements" :key="'summary-' + (req.id || index)">
          <td class="border text-xs px-2 align-top">
            <b>{{ index + 1 }}.</b> {{ req.requirement_text }}
          </td>
          <td class="text-left text-xs w-full border px-2 align-top">
            <label>Recommendation or Lacking Submission:</label>
            <div class="text-red-600">
              {{ req.recommendation }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

<!-- Status of Application -->
<p class="text-left text-xl font-semibold p-5 flex items-center">
  STATUS OF THE APPLICATION
  <span class="px-2 text-xs text-blue-600 cursor-pointer" v-if="userRole !== 'mmd'" @click="openEditModal">edit</span>
</p>
<table class="w-full border-collapse">
  <tbody>
    <tr>
      <td class="text-left text-base p-2 border w-2/4">Status: </td>
      <td class="text-left text-base p-2 border w-2/4">{{ details.status }}</td>
    </tr>
    <tr>
      <td class="text-left text-base p-2 border w-2/4">Stage of Processing: </td>
      <td class="text-left text-base p-2 border w-2/4">{{ details.stage_of_processing }}</td>
    </tr>
    <tr v-if="details.status === 'Issued'">
      <td class="text-left text-base p-2 border w-2/4">Expiration Date: </td>
      <td class="text-left text-base p-2 border w-2/4">{{ details.expiration_date }}</td>
    </tr>

    <tr v-if="details.status === 'Issued'">
      <td class="text-left text-base p-2 border w-2/4">Renewal Filing Date: </td>
      <td class="text-left text-base p-2 border w-2/4">{{ details.renewal_file_date }}</td>
    </tr>

  </tbody>
</table>

<!-- Modal Section -->
<div v-if="EditModal" class="fixed top-0 left-0 w-full h-full flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5); z-index: 1000;" @click.self="closeEditModal">
  <div class="bg-white rounded-lg w-1/4" style="max-width: 90%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); animation: fadeIn 0.3s ease-in-out;">
    <div class="flex justify-between items-center p-4" style="border-bottom: 1px solid #ddd;"> 
      <h2 class="text-lg font-bold">Edit</h2>
    </div>
    <div class="mt-2 flex flex-col space-y-2">
      <div class="flex justify-between p-2 mt-4">
        <p class="mr-5">Status:</p>
        <select
          v-model="selectedCategory"
          class="w-72 pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="" disabled selected class="text-center text-gray-100"></option>
          <option value="On-going Process">On-going Process</option>
          <option value="Issued">Issued</option>
          <option value="Denied">Denied</option>
          <option value="With Order of Finality">With Order of Finality</option>
          <option value="Endorsed to MGB CO for Clearance">Endorsed to MGB CO for Clearance</option>
          <option value="Endorsed to MGB CO for Approval">Endorsed to MGB CO for Approval</option>
        </select>
      </div>

      <!-- Conditionally render this select input when "On-going Process" is selected -->
      <div v-if="selectedCategory === 'On-going Process'" class="flex justify-between p-2 mt-4">
        <p class="mr-5">Stage of Processing:</p>
        <select v-model="selectedOngoingProcessing" class="w-72 pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="" disabled selected class="text-center text-gray-100"></option>
          <option value="Under Pre-Processing by Mining Tenement Evaluation Section">Under Pre-Processing by Mining Tenement Evaluation Section</option>
          <option value="Under Preliminary Evaluation">Under Preliminary Evaluation</option>
          <option value="Pending Area Clearance/Status (FMS/EMPAS,LMS)">Pending Area Clearance/Status (FMS/EMPAS,LMS)</option>
          <option value="Undergoing Publication/Posting/Radio Announcement">Undergoing Publication/Posting/Radio Announcement</option>
          <option value="Published/Posted Announcement within 30-days period for possible protest/adverse claim">Published/Posted Announcement within 30-days period for possible protest/adverse claim</option>
          <option value="With mining dispute filed at Panel of Arbitrators">With mining dispute filed at Panel of Arbitrators</option>
          <option value="Appeal to the Mines Adjudication Board/LSD-CO/OP">Appeal to the Mines Adjudication Board/LSD-CO/OP</option>
          <option value="Pending NCIP Certification/Proof of Consultation from LGU,ECC, etc.">Pending NCIP Certification/Proof of Consultation from LGU,ECC, etc.</option>
          <option value="Under Final Evaluation by R.O.">Under Final Evaluation by R.O.</option>
          <option value="Endorsed to Central Office">Endorsed to Central Office</option>
          <option value="Denied by MGB-RO/COP/PA/MAB but within grace period for Motion for Reconsideration or Appeal">Denied by MGB-RO/COP/PA/MAB but within grace period for Motion for Reconsideration or Appeal</option>
          <option value="Denied/Rejected by MGB-RO/COP/PA/MAB but with pending Motion for Reconsideration or Appeal">Denied/Rejected by MGB-RO/COP/PA/MAB but with pending Motion for Reconsideration or Appeal</option>
          <option value="A. Others (Renewal)">A. Others (Renewal)</option>
          <option value="B. Others (With Clearance)">B. Others (With Clearance)</option>
          <option value="Conversion from Other Tenement">Conversion from Other Tenement</option>
          <option value="Denied by MGB-RO/COP/PA/MAP/DENR but with pending Appeal at the O.P.">Denied by MGB-RO/COP/PA/MAP/DENR but with pending Appeal at the O.P.</option>
          <option value="- - -">- - -</option>
        </select>
      </div>

      <!-- Expiration date input, enabled when "Issued" is selected -->
      <div class="flex justify-between p-2 mt-4">
        <p class="mr-5">Expiration Date:</p>
        <input
          v-model="expiration_date"
          type="date"
          :disabled="selectedCategory !== 'Issued'"
          class="w-72 pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
        />
      </div>

      <div class="flex justify-between p-2 mt-4">
        <p class="mr-5">Renewal Date Filed:</p>
        <input
          v-model="renewal_file_date"
          type="date"
          :disabled="selectedCategory !== 'Issued'"
          class="w-72 pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
        />
      </div>
    </div>

    <div class="p-4 text-right" style="border-top: 1px solid #ddd;">
      <!-- Save Button -->
      <button @click="saveChanges" class="py-1 px-2 mx-2 rounded cursor-pointer text-white hover:text-gray-950 bg-green-800 hover:bg-green-100">Save</button>
      <!-- Close Button -->
      <button @click="closeEditModal" class="py-1 px-2 mx-2 rounded cursor-pointer text-white hover:bg-red-700 bg-red-800">Close</button>
    </div>
  </div>
</div>



    <!-- Overall Remarks/Status/Recommendations -->
        <p class="text-left text-xl font-semibold p-5">OVERALL REMARKS/ RECOMMENDATIONS</p>
        <textarea class="rounded w-full p-2 border" style="height: 300px;" v-model="overallStatus"></textarea>

        <p class="text-left text-xl font-semibold p-5">SIGNATURES</p>

        <!-- THREE COLUMNS IN ONE ROW -->
        <div class="grid grid-cols-3 gap-x-10">

          <!-- Prepared by -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-left">Prepared by:</h3>

            <div
              v-for="(person, index) in preparedBy"
              :key="person.id || 'prep-' + index"
              class="flex gap-2 mb-2 items-center"
            >
              <input
                v-model="person.name"
                type="text"
                placeholder="Name"
                class="border p-2 w-40"
              />
              <input
                v-model="person.designation"
                type="text"
                placeholder="Designation"
                class="border p-2 w-48"
              />
              <button v-if="userRole !== 'mmd'" 
                @click="removeSignature('preparedBy', index)"
                class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                title="Remove signature"
              >
                ✕
              </button>
            </div>

            <button
              v-if="userRole !== 'mmd'"
              @click="preparedBy.push({ id: null, name: '', designation: '' })"
              class="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2"
            >
              Add Row
            </button>
          </div>

          <!-- Received by -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-left">Received by:</h3>

            <div
              v-for="(person, index) in receivedBy"
              :key="person.id || 'rec-' + index"
              class="flex gap-2 mb-2 items-center"
            >
              <input
                v-model="person.name"
                type="text"
                placeholder="Name"
                class="border p-2 w-40"
              />
              <input
                v-model="person.designation"
                type="text"
                placeholder="Designation"
                class="border p-2 w-48"
              />
              <button v-if="userRole !== 'mmd'" 
                @click="removeSignature('receivedBy', index)"
                class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                title="Remove signature"
              >
                ✕
              </button>
            </div>

            <button
              v-if="userRole !== 'mmd'"
              @click="receivedBy.push({ id: null, name: '', designation: '' })"
              class="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2"
            >
              Add Row
            </button>
          </div>

          <!-- Received / Noted by -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-left">Received / Noted by:</h3>

            <div
              v-for="(person, index) in receivedNotedBy"
              :key="person.id || 'note-' + index"
              class="flex gap-2 mb-2 items-center"
            >
              <input
                v-model="person.name"
                type="text"
                placeholder="Name"
                class="border p-2 w-40"
              />
              <input
                v-model="person.designation"
                type="text"
                placeholder="Designation"
                class="border p-2 w-48"
              />
              <button v-if="userRole !== 'mmd'" 
                @click="removeSignature('receivedNotedBy', index)"
                class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                title="Remove signature"
              >
                ✕
              </button>
            </div>

            <button
              v-if="userRole !== 'mmd'"
              @click="receivedNotedBy.push({ id: null, name: '', designation: '' })"
              class="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2"
            >
              Add Row
            </button>
          </div>


</div>

    <div class="flex flex-col justify-center m-4">
      <div>
        <button
          v-if="userRole !== 'mmd'"
          class=" text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 w-36 h-10 rounded-md ml-2 hover:scale-105 transition-all duration-300"
          @click="update">
          UPDATE
        </button>
        <button
        
          class=" text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 w-36 h-10 rounded-md ml-2 hover:scale-105 transition-all duration-300"
          @click="toggleModal">
          {{ isVisible ? 'Close' : 'View' }}
        </button>
        <button
        v-if="details.status === 'Issued'"
        class="text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 w-36 h-10 rounded-md ml-2 hover:scale-105 transition-all duration-300"
        @click="navigateToRenewal(details.id)">
        Renewal
      </button>
      </div>

      <!-- Modal Overlay -->
      <div v-if="isVisible" class="fixed top-0 left-0 w-full h-full flex justify-center items-center" style="background: rgba(0, 0, 0, 0.5); z-index: 1000;" @click.self="toggleModal">
        <div class="bg-white rounded-lg w-4/5 relative" style="max-width: 640px;">
          <faxx/>
        </div>
      </div>
    </div>

    

  </div>
</div>
</template>

<script setup>
import Header from '../../components/header.vue'
import UserBtn from '../../components/user-dbbtn.vue'
import faxx from '../mtes/factsheet.vue'
import { API_BASE_URL } from '../../config'
import axios from 'axios'

</script>

<script>

const DEFAULT_REQUIREMENTS = [
  "Application Form (MGB Form No. 7-1) to be accompanied by eight (8) sets of the FTAA proposal and five (5) sets of the following: \n\n Filing Fee: PhP300.00/hectare but not less than PhP500,000/Application (pursuant to DENR Administrative Order No. 2013-10 dated February 21, 2013).",
  "Location Map/ Sketch Plan (1:50,000 NAMRIA topographic map) showing coordinates/ boundaries (in tabulated form) with major environmental features/ other projects (prepared, sealed and signed by a deputized Geodetic Engineer)",
  "Two (2)-Year Exploration Work Program (MGB Form No. 5-4), duly prepared, signed and sealed by a licensed Mining Engineer or Geologist",
  "Proof of technical competence in the form of: \n \n 4.1 Bio-data and track records in mining operations/ environmental management \n 4.2 Sworn commitment of the technical person(s) who will undertake the implementation of the Work Programs",
  "Affidavit of Undertaking (using MGB Form No.99-10)"
];

export default {
  name: 'typeapp',
  components: {
   
  },
  props: {
    detail_id: String,
  },
  data() {
    return {
      userRole: localStorage.getItem('userRole'),
      currentPage: 1, // Track the current page number
      totalPages: 5,  // Set the total number of pages (this can be dynamic based on the content)
      EditModal: false,
      selectedCategory: '',
      selectedOngoingProcessing: '',
      expiration_date: '',
      renewal_file_date: '',
      details: {},
      showModal: false,
      editDetails: {
        tenement_name: '',
        tenement_number: '',
        category: '',
        email: '',
        authorized_rep: '',
        commodity: '',
        address: '',
        date_filed: '',
        contact_no: '',
        others: '',
        oth_rs: '',
        barangay: '',
        city: '',
        province: '',
        area_hectares: '',
        barangay1: '',
        city1: '',
        province1: '',
        area_hectares1: '',
        barangay2: '',
        city2: '',
        province2: '',
        area_hectares2: '',
        barangay3: '',
        city3: '',
        province3: '',
        area_hectares3: ''
      },
      isLoading: false,
      id: null,
      overallStatus: '',
      isVisible: false,
      showChildComponent: false,
      selectedStatus: '',
      otherStatus: '',
      visibleLocationCount: 1,

      requirements: [],
      chronology: [],
      preparedBy: [],
      receivedBy: [],
      receivedNotedBy: []
    };
  },
  methods: {

    addRequirement() {
      this.requirements.push({
        id: null,
        requirement_no: this.requirements.length + 1,
        requirement_text: '',
        remarks: '',
        recommendation: '',
        uploads: []
      });
    },

    removeRequirement(index) {
      this.requirements.splice(index, 1);

      this.requirements.forEach((item, i) => {
        item.requirement_no = i + 1;
      });

      if (this.requirements.length === 0) {
        this.requirements.push({
          id: null,
          requirement_no: 1,
          requirement_text: '',
          remarks: '',
          recommendation: '',
          uploads: []
        });
      }
    },

    handleRequirementUpload(index, fileType, event) {
      const files = event?.target?.files;
      if (!files?.length) return;

      const MAX_SIZE = fileType === 'image'
        ? 5 * 1024 * 1024
        : 10 * 1024 * 1024;

      for (const file of files) {
        if (file.size > MAX_SIZE) {
          alert(`${file.name} exceeds the size limit.`);
          continue;
        }

        this.requirements[index].uploads.push({
          id: null,
          file_name: file.name,
          file_path: '',
          file_type: fileType,
          file
        });
      }

      event.target.value = '';
    },

    getRequirementUploads(req, type) {
      return (req.uploads || []).filter(file => file.file_type === type);
    },

    getStoredFileUrl(filePath) {
      return `${API_BASE_URL}/storage/${filePath}`;
    },

    async deleteRequirementUpload(req, upload) {
      if (!confirm('Delete this file?')) return;

      if (!upload.id) {
        req.uploads = req.uploads.filter(f => f !== upload);
        return;
      }

      try {
        await axios.delete(`${API_BASE_URL}/api/mandatory-requirement-uploads/${upload.id}`);
        req.uploads = req.uploads.filter(f => f.id !== upload.id);
      } catch (error) {
        console.error(error);
        alert('Failed to delete file');
      }
    },

    removeSignature(arrayName, index) {
      this[arrayName].splice(index, 1);

      if (this[arrayName].length === 0) {
        this[arrayName].push({ id: null, name: '', designation: '' });
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    scrollToBottom() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    },

    formatLocation(detail) {
      const locations = [
        `${detail.barangay}, ${detail.city}, ${detail.province} <span style="color: red;">(${detail.area_hectares} hectare/s)</span>`, // Apply color to area_hectares
        `${detail.barangay1}, ${detail.city1}, ${detail.province1} <span style="color: red;">(${detail.area_hectares1} hectare/s)</span>`,
        `${detail.barangay2}, ${detail.city2}, ${detail.province2} <span style="color: red;">(${detail.area_hectares2} hectare/s)</span>`,
        `${detail.barangay3}, ${detail.city3}, ${detail.province3} <span style="color: red;">(${detail.area_hectares3} hectare/s)</span>`
      ];

      // Filter out invalid locations
      const validLocations = locations.filter(loc => 
        !loc.includes('null') && !loc.includes('undefined') && loc.trim() !== ', , '
      );

      return validLocations.join('<br>'); // Join locations with a line break
    },
    openEditModal() {
      this.EditModal = true;
      this.selectedCategory = this.details.status;
      this.selectedOngoingProcessing = this.details.status === 'On-going Process' ? this.details.stage_of_processing : '';
      this.expiration_date = this.details.expiration_date || '';
      this.renewal_file_date = this.details.renewal_file_date || '';
    },
    closeEditModal() {
      this.EditModal = false;
      this.resetSelections();
    },
    addLocation() {
      if (this.visibleLocationCount < 4) {
        this.visibleLocationCount++;
      }
    },
    showEditModal() {
      this.editDetails = {
        tenement_name: this.details.tenement_name || '',
        tenement_number: this.details.tenement_number || '',
        category: this.details.category || '',
        email: this.details.email || '',
        authorized_rep: this.details.authorized_rep || '',
        commodity: this.details.commodity || '',
        address: this.details.address || '',
        date_filed: this.details.date_filed || '',
        contact_no: this.details.contact_no || '',
        others: this.details.others || '',
        oth_rs: this.details.oth_rs || '',

        barangay: this.details.barangay || '',
        city: this.details.city || '',
        province: this.details.province || '',
        area_hectares: this.details.area_hectares || '',

        barangay1: this.details.barangay1 || '',
        city1: this.details.city1 || '',
        province1: this.details.province1 || '',
        area_hectares1: this.details.area_hectares1 || '',

        barangay2: this.details.barangay2 || '',
        city2: this.details.city2 || '',
        province2: this.details.province2 || '',
        area_hectares2: this.details.area_hectares2 || '',

        barangay3: this.details.barangay3 || '',
        city3: this.details.city3 || '',
        province3: this.details.province3 || '',
        area_hectares3: this.details.area_hectares3 || ''
      };

      const hasLocation1 =
        this.details.barangay1 || this.details.city1 || this.details.province1 || this.details.area_hectares1;

      const hasLocation2 =
        this.details.barangay2 || this.details.city2 || this.details.province2 || this.details.area_hectares2;

      const hasLocation3 =
        this.details.barangay3 || this.details.city3 || this.details.province3 || this.details.area_hectares3;

      this.visibleLocationCount = 1;

      if (hasLocation1) this.visibleLocationCount = 2;
      if (hasLocation2) this.visibleLocationCount = 3;
      if (hasLocation3) this.visibleLocationCount = 4;

      this.showModal = true;
    },

    hideEditModal() {
      this.showModal = false;
    },
    async saveApplicationDetails() {
  if (!this.id) {
    this.handleError('ID is undefined. Cannot save changes.');
    return;
  }

  this.isLoading = true;

  try {
    const formData = new FormData();

    Object.entries(this.editDetails).forEach(([key, value]) => {
      formData.append(key, value ?? '');
    });

    await axios.post(`${API_BASE_URL}/api/update_details/${this.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    alert('Application details updated successfully');
    await this.getDetails();
    this.hideEditModal();
  } catch (error) {
    this.handleError(error);
  } finally {
    this.isLoading = false;
  }
},
    createFormData1() {
      const formData = new FormData();
      formData.append('tenement_number', this.tenement_number);
      return formData;
    },
    resetSelections() {
      this.selectedCategory = '';
      this.selectedOngoingProcessing = '';
      this.expiration_date = '';
      this.renewal_file_date = '';
    },
    async saveChanges() {
      if (!this.id) return;

      this.isLoading = true;

      try {
        const formData = this.createFormData();

        await axios.post(`${API_BASE_URL}/api/update_status/${this.id}`, formData);

        // Update extra fields
        const detailsForm = new FormData();
        detailsForm.append('expiration_date', this.expiration_date || '');
        detailsForm.append('renewal_file_date', this.renewal_file_date || '');

        await axios.post(`${API_BASE_URL}/api/update_details/${this.id}`, detailsForm);
        // 🔥 THIS IS THE KEY
        //await this.getDetails();

        this.closeEditModal();

      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    createFormData() {
      const formData = new FormData();

      if (this.selectedCategory === 'On-going Process') {
        formData.append('status', this.selectedCategory);
        formData.append('stage_of_processing', this.selectedOngoingProcessing);
      }
      else {
        formData.append('status', this.selectedCategory);
        if (this.selectedCategory === 'Issued') {
          formData.append('expiration_date', this.expiration_date);
        }
      }

      return formData;
    },

    handleError(error) {
      console.error('Error saving changes:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        alert(`Failed to update details: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert('Failed to update details: No response from server.');
      } else {
        alert('Failed to update details: ' + error.message);
      }
    },
    //
    toggleModal() {
      this.isVisible = !this.isVisible;
    },
    navigateToRenewal(detail_id) {
            window.location.href = `/Renewal/${detail_id}`;
        },


      async getDetails() {
          try {
            const detailId = this.$route.params.detail_id;

            const detailsResponse = await axios.get(`${API_BASE_URL}/get_details/${detailId}`);
            this.details = detailsResponse.data || {};
            this.id = this.details.id;

            try {
              const overallstatus = await axios.get(`${API_BASE_URL}/api/get_mtsrstatus`);
              const filteredoverall = overallstatus.data.find(
                req => req.id_reference === parseInt(detailId)
              );
              this.overallStatus = filteredoverall?.overallstatus || '';
            } catch (error) {
              console.error('Error fetching mtsrstatus:', error);
              this.overallStatus = '';
            }

            try {
              const requirementsResponse = await axios.get(`${API_BASE_URL}/api/mandatory_requirements/${detailId}`);

              const rawRequirements = Array.isArray(requirementsResponse.data)
                ? requirementsResponse.data
                : Array.isArray(requirementsResponse.data?.data)
                  ? requirementsResponse.data.data
                  : [];

              this.requirements = rawRequirements.map(req => ({
                id: req.id,
                requirement_no: req.requirement_no,
                requirement_text: req.requirement_text || '',
                remarks: req.remarks || '',
                recommendation: req.recommendation || '',
                uploads: Array.isArray(req.uploads) ? req.uploads : []
              }));
            } catch (error) {
              console.error('Error fetching requirements:', error);
              this.requirements = [];
            }

            try {
              const chronologyResponse = await axios.get(`${API_BASE_URL}/api/chronology/${detailId}`);
              const rawChronology = Array.isArray(chronologyResponse.data)
                ? chronologyResponse.data
                : Array.isArray(chronologyResponse.data?.data)
                  ? chronologyResponse.data.data
                  : [];

              this.chronology = rawChronology.map(item => ({
                id: item.id,
                date: item.chronology_date || '',
                remarks: item.chronology_remarks || ''
              }));
            } catch (error) {
              console.error('Error fetching chronology:', error);
              this.chronology = [];
            }

            if (this.chronology.length === 0) {
              this.chronology = [{ id: null, date: '', remarks: '' }];
            }

            if (this.requirements.length === 0) {
              this.requirements = DEFAULT_REQUIREMENTS.map((text, index) => ({
                id: null,
                requirement_no: index + 1,
                requirement_text: text,
                remarks: '',
                recommendation: '',
                uploads: []
              }));
            }

            while (this.requirements.length < 5) {
              const index = this.requirements.length;
              this.requirements.push({
                id: null,
                requirement_no: index + 1,
                requirement_text: DEFAULT_REQUIREMENTS[index] || '',
                remarks: '',
                recommendation: '',
                uploads: []
              });
            }

            try {
            const signaturesResponse = await axios.get(`${API_BASE_URL}/api/signatures/${detailId}`);
            const rawSignatures = Array.isArray(signaturesResponse.data)
              ? signaturesResponse.data
              : Array.isArray(signaturesResponse.data?.data)
                ? signaturesResponse.data.data
                : [];

            this.preparedBy = rawSignatures
              .filter(item => item.signature_type === 'prepared')
              .map(item => ({
                id: item.id,
                name: item.name || '',
                designation: item.designation || ''
              }));

            this.receivedBy = rawSignatures
              .filter(item => item.signature_type === 'received')
              .map(item => ({
                id: item.id,
                name: item.name || '',
                designation: item.designation || ''
              }));

            this.receivedNotedBy = rawSignatures
              .filter(item => item.signature_type === 'received_noted')
              .map(item => ({
                id: item.id,
                name: item.name || '',
                designation: item.designation || ''
              }));

          } catch (error) {
            console.error('Error fetching signatures:', error);
            this.preparedBy = [{ id: null, name: '', designation: '' }];
            this.receivedBy = [{ id: null, name: '', designation: '' }];
            this.receivedNotedBy = [{ id: null, name: '', designation: '' }];
          }

          } catch (error) {
            console.error('Error fetching details:', error);

            this.requirements = DEFAULT_REQUIREMENTS.map((text, index) => ({
              id: null,
              requirement_no: index + 1,
              requirement_text: text,
              remarks: '',
              recommendation: '',
              uploads: []
            }));

            this.chronology = [{ id: null, date: '', remarks: '' }];
          }


        },

    addChronologyRow() {
      this.chronology.push({ id: null, date: '', remarks: '' });
    },
    removeChronologyRow(index) {
          this.chronology.splice(index, 1);

          // Ensure at least one row exists
          if (this.chronology.length === 0) {
      this.chronology.push({ id: null, date: '', remarks: '' });
    }
    },

    async update() {
        // Validate chronology date first
        const hasEmptyChronologyDate = this.chronology.some(item => {
          const hasRemarks = item.remarks && item.remarks.trim() !== '';
          const hasDate = item.date && item.date.trim() !== '';

          // require date when row has remarks or when row exists but date is empty
          return !hasDate && (hasRemarks || this.chronology.length > 0);
        });

        
      try {
        const detailId = this.$route.params.detail_id;

        console.log('1. Updating mtsrstatus...');
        await axios.post(`${API_BASE_URL}/api/update_mtsrstatus/${detailId}`, {
          id_reference: detailId,
          overallstatus: this.overallStatus
        });

        console.log('2. Updating mandatory requirements...');
        const requirementsForm = new FormData();
        requirementsForm.append('id_reference', detailId);
        requirementsForm.append(
          'requirements',
          JSON.stringify(
            this.requirements.map((req, index) => ({
              id: req.id,
              requirement_no: index + 1,
              requirement_text: req.requirement_text,
              remarks: req.remarks,
              recommendation: req.recommendation
            }))
          )
        );

        this.requirements.forEach((req, index) => {
          (req.uploads || []).forEach(upload => {
            if (upload.file instanceof File) {
              requirementsForm.append(`uploads[${index}][]`, upload.file);
              requirementsForm.append(`uploads_meta[${index}][]`, upload.file_type);
            }
          });
        });

        await axios.post(
          `${API_BASE_URL}/api/mandatory_requirements/update/${detailId}`,
          requirementsForm
        );

        console.log('3. Updating chronology...');
        await axios.post(`${API_BASE_URL}/api/chronology/update/${detailId}`, {
          id_reference: detailId,
          chronology: this.chronology.map((item, index) => ({
            id: item.id || null,
            chronology_date: item.date,
            chronology_remarks: item.remarks,
            sort_order: index + 1
          }))
        });

        console.log('4. Updating signatures...');
        await axios.post(`${API_BASE_URL}/api/signatures/update/${detailId}`, {
          id_reference: detailId,
          signatures: [
            ...this.preparedBy
              .filter(p => p.name || p.designation)
              .map((p) => ({
                id: p.id || null,
                signature_type: 'prepared',
                name: p.name,
                designation: p.designation
              })),
            ...this.receivedBy
              .filter(p => p.name || p.designation)
              .map((p) => ({
                id: p.id || null,
                signature_type: 'received',
                name: p.name,
                designation: p.designation
              })),
            ...this.receivedNotedBy
              .filter(p => p.name || p.designation)
              .map((p) => ({
                id: p.id || null,
                signature_type: 'received_noted',
                name: p.name,
                designation: p.designation
              }))
          ]
        });

        alert('Update successful');
        await this.getDetails();

      } catch (error) {
        console.error('Update failed:', error);
        console.error('Failed URL:', error.config?.url);
        console.error('Response data:', error.response?.data);
        alert(`Update failed at: ${error.config?.url}`);
      }
    },
  },
  mounted() {
      this.getDetails();
    },
}
</script>

<style scoped>
.scroll-btn {
  @apply fixed right-5 bg-amber-400 hover:bg-amber-200 text-black border-none px-4 py-2 rounded-md cursor-pointer text-lg shadow-md transition-colors;
}

.top {
  @apply bottom-20;
}

.bottom {
  @apply bottom-5;
}

.input {
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 8px;
  border-radius: 8px;
}
</style>

