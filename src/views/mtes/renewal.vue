<template>
  <div class="flex">
    <Header />
    <UserBtn />
  </div>

  <div>
    <button @click="scrollToTop" class="scroll-btn top">&#8679;</button>
    <button @click="scrollToBottom" class="scroll-btn bottom">&#8681;</button>
  </div>

  <div class="flex justify-center">
    <div class="mt-2 text-center w-11/12">
      <p class="text-center text-4xl font-bold p-5">RENEWAL PROCESS</p>

      <!-- APPLICATION DETAILS -->
      <p class="text-left text-xl font-semibold p-5">APPLICATION DETAILS</p>
      <table class="w-full text-left border border-gray-300">
        <tbody>
          <tr class="border border-gray-300">
            <td class="border border-gray-300 p-3 text-sm font-medium" style="width: 210px;">Tenement Name</td>
            <td class="border border-gray-300 p-3 text-sm" style="width: 700px;">{{ displayValue(details.tenement_name) }}</td>
            <td class="border border-gray-300 p-3 text-sm font-medium" style="width: 210px;">Category</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.application) }}</td>
          </tr>

          <tr class="border border-gray-300">
            <td class="border border-gray-300 p-3 text-sm font-medium">
              Tenement Number
            </td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.tenement_number) }}</td>
            <td class="border border-gray-300 p-3 text-sm font-medium">Email Address</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.email) }}</td>
          </tr>

          <tr class="border border-gray-300">
            <td class="border border-gray-300 p-3 text-sm font-medium">Location/s</td>
            <td class="border border-gray-300 p-3 text-sm">
              <span v-html="formatLocation(details)"></span>
            </td>
            <td class="border border-gray-300 p-3 text-sm font-medium">Authorized Representative</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.authorized_rep) }}</td>
          </tr>

          <tr class="border border-gray-300">
            <td class="border border-gray-300 p-3 text-sm font-medium">Commodity</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.commodity) }}</td>
            <td class="border border-gray-300 p-3 text-sm font-medium">Address</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.address) }}</td>
          </tr>

          <tr class="border border-gray-300">
            <td class="border border-gray-300 p-3 text-sm font-medium">Renewal Filing Date</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.renewal_file_date) }}</td>
            <td class="border border-gray-300 p-3 text-sm font-medium">Contact Number</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.contact_no) }}</td>
          </tr>

          <tr class="border border-gray-300">
            <td class="border border-gray-300 p-3 text-sm font-medium">Others</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.others) }}</td>
            <td class="border border-gray-300 p-3 text-sm font-medium">Others</td>
            <td class="border border-gray-300 p-3 text-sm">{{ displayValue(details.oth_rs) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- TENEMENT NUMBER MODAL -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div class="bg-white p-5 rounded-lg shadow-lg w-96">
          <h2 class="text-lg font-semibold mb-4">Edit Tenement Number</h2>
          <input
            v-model="tenement_number"
            type="text"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Add/Change Tenement Number"
          />
          <div class="flex justify-end mt-4">
            <button @click="hideEditModal" class="px-4 py-2 bg-gray-400 text-white rounded mr-2">Cancel</button>
            <button @click="savetenement_number" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>

      <!-- CHRONOLOGY -->
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
                v-model="entry.chronology_date"
                :disabled="userRole === 'mmd'"
              />
            </td>
            <td class="border border-gray-300 p-3 py-2 text-sm font-medium">
              <textarea
                class="min-h-[60px] w-full border px-2 py-1 rounded"
                v-model="entry.chronology_remarks"
                :disabled="userRole === 'mmd'"
              ></textarea>
            </td>
            <td class="border border-gray-300 p-3 py-2 text-sm font-medium text-center">
              <button
                v-if="userRole !== 'mmd'"
                @click="removeChronology(index)"
                class="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </td>
          </tr>

          <tr>
            <td colspan="3" class="border border-gray-300 p-3 text-center">
              <button
                v-if="userRole !== 'mmd'"
                @click="addChronology"
                class="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Another Row
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- REQUIREMENTS -->
      <div v-if="details.application">
        <p class="text-left text-xl font-semibold p-5">RENEWAL REQUIREMENTS</p>

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
        <template v-if="req.type === 'note'">
          <td colspan="3" class="border border-gray-300 text-sm font-semibold p-3 bg-gray-100">
            {{ req.requirement_text }}
          </td>
        </template>

        <template v-else>
          <!-- REQUIREMENT COLUMN -->
          <td
            class="border border-gray-300 text-sm font-normal p-3 align-top"
            style="width: 750px;"
          >
            <div class="flex justify-between items-start gap-2">
              <div class="w-full">
                <label class="font-semibold">
                  {{ req.requirement_no }}.
                </label>

                <textarea
                  v-model="req.requirement_text"
                  :readonly="userRole === 'mmd'"
                  class="w-full border p-2 mt-2"
                  rows="6"
                  placeholder="Enter requirement"
                ></textarea>
              </div>

              <button
                v-if="userRole !== 'mmd'"
                @click="removeRequirement(index)"
                class="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Remove
              </button>
            </div>
          </td>

          <!-- UPLOAD COLUMN -->
          <td class="p-2 text-sm border border-gray-300 align-top">
            <div v-if="userRole !== 'mmd'" class="mb-4">
              <label class="text-sm text-gray-500">Files to upload:</label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                @change="handleRequirementUpload(index, $event, 'document')"
                class="hover:bg-amber-100 flex h-10 rounded-md border bg-white px-3 py-2 text-sm text-gray-400 cursor-pointer w-full"
              />
            </div>

            <div class="mb-4">
              <label class="text-sm text-gray-500">Requirements Uploaded:</label>
              <div
                v-for="(file, i) in req.uploads.filter(f => f.file_type === 'document')"
                :key="'doc-' + (file.id || i)"
                class="flex items-center justify-between mt-1 gap-2"
              >
                <a
                  v-if="file.existing"
                  :href="file.url"
                  target="_blank"
                  class="text-sm text-blue-500 hover:underline break-all"
                >
                  {{ file.file_name }}
                </a>

                <span v-else class="text-sm break-all">
                  {{ file.file_name }}
                </span>

                <button
                  v-if="userRole !== 'mmd'"
                  @click="deleteRequirementUpload(index, i)"
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
                @change="handleRequirementUpload(index, $event, 'image')"
                class="hover:bg-amber-100 flex h-10 rounded-md border bg-white px-3 py-2 text-sm text-gray-400 cursor-pointer w-full"
              />
            </div>

            <div>
              <label class="text-sm text-gray-500">Attachments:</label>
              <div
                v-for="(file, i) in req.uploads.filter(f => f.file_type === 'image')"
                :key="'img-' + (file.id || i)"
                class="flex items-center justify-between mt-1 gap-2"
              >
                <a
                  v-if="file.existing"
                  :href="file.url"
                  target="_blank"
                  class="text-sm text-blue-500 hover:underline break-all"
                >
                  {{ file.file_name }}
                </a>

                <span v-else class="text-sm break-all">
                  {{ file.file_name }}
                </span>

                <button
                  v-if="userRole !== 'mmd'"
                  @click="deleteRequirementUpload(index, i)"
                  class="text-red-500 text-xs ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </td>

          <!-- REMARKS COLUMN -->
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
        </template>
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
</div>

      <!-- SUMMARY -->
      <p class="text-left text-xl font-semibold p-5">SUMMARY OF LACKING REQUIREMENTS</p>
      <table class="w-full mb-5 text-left p-2 border border-collapse">
        <thead class="w-full">
          <tr class="bg-green-800 text-white text-center">
            <th class="w-6/12 p-2 border text-base">Requirements</th>
            <th class="p-2 border text-base">Remarks or Status | Recommendation or Lacking Submission</th>
          </tr>
        </thead>
        <tbody>
            <tr
              v-for="(req, index) in requirements.filter(r => r.type !== 'note')"
              :key="index"
            >
            <td class="border px-2 py-2">
              <b>{{ req.requirement_no }}.</b> {{ displayValue(req.requirement_text) }}
            </td>
            <td class="border px-2 py-2 text-red-600">
              {{ displayValue(req.recommendation) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- STATUS MODAL -->
      <div
        v-if="EditModal"
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center"
        style="background-color: rgba(0, 0, 0, 0.5); z-index: 1000;"
        @click.self="closeEditModal"
      >
        <div
          class="bg-white rounded-lg w-1/4"
          style="max-width: 90%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); animation: fadeIn 0.3s ease-in-out;"
        >
          <div class="flex justify-between items-center p-4" style="border-bottom: 1px solid #ddd;">
            <h2 class="text-lg font-bold">Edit</h2>
          </div>

          <div class="mt-2 flex flex-col space-y-2">
            <div class="flex justify-between p-2 mt-4">
              <p class="mr-5">Status:</p>
              <select
                v-model="selectedCategory"
                class="w-72 pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm"
              >
                <option value="" disabled></option>
                <option value="On-going Process">On-going Process</option>
                <option value="Issued">Issued</option>
                <option value="Denied">Denied</option>
                <option value="With Order of Finality">With Order of Finality</option>
                <option value="Endorsed to MGB CO for Clearance">Endorsed to MGB CO for Clearance</option>
                <option value="Endorsed to MGB CO for Approval">Endorsed to MGB CO for Approval</option>
              </select>
            </div>

            <div v-if="selectedCategory === 'On-going Process'" class="flex justify-between p-2 mt-4">
              <p class="mr-5">Stage of Processing:</p>
              <select
                v-model="selectedOngoingProcessing"
                class="w-72 pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm"
              >
                <option value="" disabled></option>
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

            <div class="flex justify-between p-2 mt-4">
              <p class="mr-5">Expiration Date:</p>
              <input
                v-model="expiration_date"
                type="date"
                :disabled="selectedCategory !== 'Issued'"
                class="w-72 pl-1 pr-1 bg-orange-100 rounded-md border-gray-300 shadow-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div class="p-4 text-right" style="border-top: 1px solid #ddd;">
            <button @click="saveChanges" class="py-1 px-2 mx-2 rounded text-white bg-green-800 hover:bg-green-100 hover:text-gray-950">
              Save
            </button>
            <button @click="closeEditModal" class="py-1 px-2 mx-2 rounded text-white hover:bg-red-700 bg-red-800">
              Close
            </button>
          </div>
        </div>
      </div>

    <!-- Overall Remarks/Status/Recommendations -->
    <p class="text-left text-xl font-semibold p-5">OVERALL REMARKS/ RECOMMENDATIONS</p>
        <textarea class="rounded w-full p-2 border" style="height: 300px;" v-model="overallStatus"></textarea>


      <!-- SIGNATURES -->
      <p class="text-left text-xl font-semibold p-5">SIGNATURES</p>

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
              :disabled="userRole === 'mmd'"
            />
            <input
              v-model="person.designation"
              type="text"
              placeholder="Designation"
              class="border p-2 w-48"
              :disabled="userRole === 'mmd'"
            />
            <button
              v-if="userRole !== 'mmd'"
              @click="removeSignature('preparedBy', index)"
              class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              title="Remove signature"
            >
              ✕
            </button>
          </div>

          <button
            v-if="userRole !== 'mmd'"
            @click="preparedBy.push(createEmptySignature())"
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
              :disabled="userRole === 'mmd'"
            />
            <input
              v-model="person.designation"
              type="text"
              placeholder="Designation"
              class="border p-2 w-48"
              :disabled="userRole === 'mmd'"
            />
            <button
              v-if="userRole !== 'mmd'"
              @click="removeSignature('receivedBy', index)"
              class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              title="Remove signature"
            >
              ✕
            </button>
          </div>

          <button
            v-if="userRole !== 'mmd'"
            @click="receivedBy.push(createEmptySignature())"
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
              :disabled="userRole === 'mmd'"
            />
            <input
              v-model="person.designation"
              type="text"
              placeholder="Designation"
              class="border p-2 w-48"
              :disabled="userRole === 'mmd'"
            />
            <button
              v-if="userRole !== 'mmd'"
              @click="removeSignature('receivedNotedBy', index)"
              class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              title="Remove signature"
            >
              ✕
            </button>
          </div>

          <button
            v-if="userRole !== 'mmd'"
            @click="receivedNotedBy.push(createEmptySignature())"
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
            class="text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 w-36 h-10 rounded-md ml-2 hover:scale-105 transition-all duration-300"
            @click="update"
          >
            UPDATE
          </button>

          <button
            class="text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 w-36 h-10 rounded-md ml-2 hover:scale-105 transition-all duration-300"
            @click="toggleModal"
          >
            {{ isVisible ? 'Close' : 'View' }}
          </button>
        </div>

        <div
          v-if="isVisible"
          class="fixed top-0 left-0 w-full h-full flex justify-center items-center"
          style="background: rgba(0, 0, 0, 0.5); z-index: 1000;"
          @click.self="toggleModal"
        >
          <div class="bg-white rounded-lg w-4/5 relative" style="max-width: 640px;">
            <faxx
              :details="details"
              :requirements="requirements"
              :chronology="chronology"
              :overallvalue="overallStatus"
              :preparedBy="preparedBy"
              :receivedBy="receivedBy"
              :receivedNotedBy="receivedNotedBy"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header.vue'
import UserBtn from '../../components/user-dbbtn.vue'
import imagees from '../../components/MTES/modals/imguploads.vue'
import faxx from '../mtes/renewal_factsheet.vue'
import { API_BASE_URL } from '../../config'
import axios from 'axios'

export default {
  name: 'typeapp',
  components: {
    Header,
    UserBtn,
    imagees,
    faxx
  },
  props: {
    detail_id: String,
  },
  data() {
    return {
      userRole: localStorage.getItem('userRole'),
      EditModal: false,
      selectedCategory: '',
      selectedOngoingProcessing: '',
      expiration_date: '',
      details: {},
      showModal: false,
      tenement_number: '',
      isLoading: false,
      id: null,
      overallStatus: '',
      isVisible: false,

      requirements: [],
      chronology: [],

      preparedBy: [],
      receivedBy: [],
      receivedNotedBy: []
    }
  },

  methods: {
    displayValue(value) {
      return value === null || value === undefined || value === '' || value === 'null'
        ? ''
        : value
    },

    createEmptyRequirement(no = 1) {
      return {
        id: null,
        requirement_no: no,
        requirement_text: '',
        type: 'requirement',
        remarks: '',
        recommendation: '',
        uploads: []
      }
    },

    createEmptyChronology(sortOrder = 1) {
      return {
        id: null,
        chronology_date: '',
        chronology_remarks: '',
        sort_order: sortOrder
      }
    },

    createEmptySignature() {
      return {
        id: null,
        name: '',
        designation: ''
      }
    },

    ensureSignatureSlots() {
      if (!this.preparedBy.length) this.preparedBy.push(this.createEmptySignature())
      if (!this.receivedBy.length) this.receivedBy.push(this.createEmptySignature())
      if (!this.receivedNotedBy.length) this.receivedNotedBy.push(this.createEmptySignature())
    },
        removeSignature(arrayName, index) {
      this[arrayName].splice(index, 1)

      if (this[arrayName].length === 0) {
        this[arrayName].push(this.createEmptySignature())
      }
    },

    getDefaultRequirements(application) {
      const app = (application || '').toUpperCase().trim()

      const defaults = {
        MPP: [
          { type: 'requirement', text: 'Letter of intent with Justification of Renewal' },
          { type: 'requirement', text: 'Payment of renewal fee' },
          { type: 'requirement', text: 'Comprehensive technical reports on the outcome of the operations, signed by a licensed Mining Engineer or Metallurgical Engineer' },
          { type: 'requirement', text: 'Comprehensive technical reports on the level of ECC compliance, signed by an Environmental Officer' },
          { type: 'requirement', text: 'Audited financial statements covering the term of the MPP' },
          { type: 'requirement', text: 'Social Development and Management Program' },
          { type: 'requirement', text: 'Work Program duly prepared, signed and sealed by a licensed Metallurgical Engineer' },
          { type: 'note', text: 'Other Supporting Papers as the Regional Office concerned may require' },
          { type: 'requirement', text: 'Corporate Secretary’s Certificate attesting to the authority of the President to sign and execute documents in connection with the renewal application' },
          { type: 'requirement', text: 'Certification of the Regional Office concerned as to the Permit Holder’s level of implementation of the Work Programs and compliance with the terms and conditions of the MPP, including reporting and fiscal obligations' },
          { type: 'requirement', text: 'Integrated Environmental Protection and Enhancement Program (EPEP) and Final Mine Rehabilitation/Decommissioning Plan (FMRDP)' },
          { type: 'requirement', text: 'Certificate of Environmental Management and Community Relations Record (CEMCRR)' }
        ],
        ISAG: [
          { type: 'requirement', text: 'Letter of intent with Justification of Renewal' },
          { type: 'requirement', text: 'Payment of Renewal Fee' },
          { type: 'requirement', text: 'Comprehensive technical report on the outcome of the operations (and corresponding expenditures, as well as the payment of taxes and fees), including their environmental effects (should be signed and sealed by a licensed Mining Engineer or Geologist of the applicant), as validated by the MGB RO concerned.'},
          { type: 'requirement', text: 'Five-Year Work Program (MGB Form No. 5-2) duly prepared, signed and sealed by licensed Mining Engineer or Geologist of the applicant'},
          { type: 'requirement', text: 'Five-Year Social Development and Management Program'},
          { type: 'requirement', text: 'Surety bond in the amount of PhP20,000.00'},
          { type: 'requirement', text: 'Audited Report of Expenditures incurred during the operations period'},
          { type: 'requirement', text: 'EPEP (MGB Form No. 16-2) as provided for in Section 169 of DAO No. 2010-21'},
          { type: 'requirement', text: 'Other supporting papers as the Regional Office may require or the applicant may submit: /n a. CEMCRR'}
        ]
      }

      let count = 1

      return (defaults[app] || []).map((item) => {
        if (item.type === 'note') {
          return {
            id: null,
            requirement_no: null,
            requirement_text: item.text,
            type: 'note',
            remarks: '',
            recommendation: '',
            uploads: []
          }
        }

        return {
          id: null,
          requirement_no: count++,
          requirement_text: item.text,
          type: 'requirement',
          remarks: '',
          recommendation: '',
          uploads: []
        }
      })
    },

    addRequirement() {
      // get only real requirements
      const requirementIndexes = this.requirements
        .map((req, index) => ({ req, index }))
        .filter(r => r.req.type !== 'note')

      // find last requirement index
      const lastRequirementIndex = requirementIndexes.length
        ? requirementIndexes[requirementIndexes.length - 1].index
        : -1

      const nextNo = requirementIndexes.length + 1
      const newRequirement = this.createEmptyRequirement(nextNo)

      // insert BELOW last requirement
      this.requirements.splice(lastRequirementIndex + 1, 0, newRequirement)

      // re-number
      let count = 1
      this.requirements.forEach((req) => {
        if (req.type === 'note') {
          req.requirement_no = null
        } else {
          req.requirement_no = count++
        }
      })
    },

    removeRequirement(index) {
      this.requirements.splice(index, 1)

      let count = 1
      this.requirements.forEach((req) => {
        if (req.type === 'note') {
          req.requirement_no = null
        } else {
          req.requirement_no = count++
        }
      })

      if (!this.requirements.length) {
        const defaults = this.getDefaultRequirements(this.details.application)
        this.requirements = defaults.length ? defaults : [this.createEmptyRequirement(1)]
      }
    },

    addChronology() {
      this.chronology.push(this.createEmptyChronology(this.chronology.length + 1))
    },

    removeChronology(index) {
      this.chronology.splice(index, 1)

      this.chronology.forEach((row, i) => {
        row.sort_order = i + 1
      })

      if (!this.chronology.length) {
        this.chronology.push(this.createEmptyChronology(1))
      }
    },

    handleRequirementUpload(index, event, type = 'document') {
      const files = Array.from(event.target.files || [])

      files.forEach(file => {
        this.requirements[index].uploads.push({
          id: null,
          file_name: file.name,
          file_type: type,
          file,
          existing: false,
          url: ''
        })
      })

      event.target.value = null
    },

    async deleteRequirementUpload(reqIndex, uploadIndex) {
      const upload = this.requirements[reqIndex].uploads[uploadIndex]

      if (!confirm('Delete this upload?')) return

      try {
        if (upload.id) {
          await axios.delete(`${API_BASE_URL}/api/renewal-requirement-uploads/${upload.id}`)
        }

        this.requirements[reqIndex].uploads.splice(uploadIndex, 1)
      } catch (error) {
        console.error(error)
        alert('Failed to delete upload')
      }
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    scrollToBottom() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    },

    formatLocation(detail) {
      const parts = [
        {
          barangay: detail.barangay,
          city: detail.city,
          province: detail.province,
          area: detail.area_hectares
        },
        {
          barangay: detail.barangay1,
          city: detail.city1,
          province: detail.province1,
          area: detail.area_hectares1
        },
        {
          barangay: detail.barangay2,
          city: detail.city2,
          province: detail.province2,
          area: detail.area_hectares2
        },
        {
          barangay: detail.barangay3,
          city: detail.city3,
          province: detail.province3,
          area: detail.area_hectares3
        }
      ]

      const validLocations = parts
        .filter(loc =>
          [loc.barangay, loc.city, loc.province].some(
            v => v !== null && v !== undefined && v !== '' && v !== 'null'
          )
        )
        .map(loc => {
          const place = [loc.barangay, loc.city, loc.province]
            .filter(v => v !== null && v !== undefined && v !== '' && v !== 'null')
            .join(', ')

          const areaText =
            loc.area !== null && loc.area !== undefined && loc.area !== '' && loc.area !== 'null'
              ? ` <span style="color: red;">(${loc.area} hectare/s)</span>`
              : ''

          return `${place}${areaText}`
        })

      return validLocations.length ? validLocations.join('<br>') : '—'
    },

    openEditModal() {
      this.EditModal = true
      this.selectedCategory = this.details.status || ''
      this.selectedOngoingProcessing =
        this.details.status === 'On-going Process' ? (this.details.stage_of_processing || '') : ''
      this.expiration_date = this.details.expiration_date || ''
    },

    closeEditModal() {
      this.EditModal = false
      this.resetSelections()
    },

    showEditModal() {
      this.showModal = true
      this.tenement_number = this.details.tenement_number || ''
    },

    hideEditModal() {
      this.showModal = false
    },

    resetSelections() {
      this.selectedCategory = ''
      this.selectedOngoingProcessing = ''
      this.expiration_date = ''
    },

    createFormData1() {
      const formData = new FormData()
      formData.append('tenement_number', this.tenement_number || '')
      return formData
    },

    async savetenement_number() {
      if (!this.id) {
        this.handleError('ID is undefined. Cannot save changes.')
        return
      }

      this.isLoading = true
      try {
        const formData = this.createFormData1()
        await axios.post(`${API_BASE_URL}/update_details/${this.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        alert('Details updated successfully')
        await this.getDetails()
        this.hideEditModal()
      } catch (error) {
        this.handleError(error)
      } finally {
        this.isLoading = false
      }
    },

    createFormData() {
      const formData = new FormData()

      formData.append('status', this.selectedCategory || '')

      if (this.selectedCategory === 'On-going Process') {
        formData.append('stage_of_processing', this.selectedOngoingProcessing || '')
      } else {
        formData.append('stage_of_processing', '')
      }

      if (this.selectedCategory === 'Issued') {
        formData.append('expiration_date', this.expiration_date || '')
      } else {
        formData.append('expiration_date', '')
      }

      return formData
    },

    async saveChanges() {
      if (!this.id) {
        this.handleError('ID is undefined. Cannot save changes.')
        return
      }

      this.isLoading = true
      try {
        const formData = this.createFormData()

        await axios.post(`${API_BASE_URL}/update_status/${this.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        await axios.post(`${API_BASE_URL}/update_details/${this.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        alert('Details updated successfully')
        await this.getDetails()
        this.closeEditModal()
      } catch (error) {
        this.handleError(error)
      } finally {
        this.isLoading = false
      }
    },

    handleError(error) {
      console.error('Error saving changes:', error)

      if (error.response) {
        alert(`Failed to update details: ${error.response.data.message || 'Unknown error'}`)
      } else if (error.request) {
        alert('Failed to update details: No response from server.')
      } else {
        alert('Failed to update details: ' + error.message)
      }
    },

    toggleModal() {
      this.isVisible = !this.isVisible
    },

    async getDetails() {
      try {
        const response = await axios.get(`${API_BASE_URL}/get_details/`)
        this.details = response.data.find(det => det.id == this.$route.params.detail_id) || {}
      } catch (error) {
        console.error('Error fetching details:', error)
        this.details = {}
      }

      try {
         const overallstatus = await axios.get(`${API_BASE_URL}/api/get_renewal_mtsrstatus`);
        const filteredoverall = overallstatus.data.find(
          req => req.id_reference === parseInt(this.$route.params.detail_id)
        );
        this.overallStatus = filteredoverall?.overallstatus || '';
      } catch (error) {
        console.error('Error fetching mtsrstatus:', error);
        this.overallStatus = '';
      }
        

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/get_renewal_requirements/${this.$route.params.detail_id}`
        )

        this.requirements = (response.data || []).map((req, index) => ({
        id: req.id,
        requirement_no: req.requirement_no ?? index + 1,
        requirement_text: req.requirement_text || '',
        type: req.type || 'requirement',
        remarks: req.remarks || '',
        recommendation: req.recommendation || '',
        uploads: (req.uploads || []).map(file => ({
          id: file.id,
          file_name: file.file_name,
          file_type: file.file_type,
          file_path: file.file_path,
          existing: true,
          url: file.url || `/storage/${file.file_path}`
        }))
      }))

      if (!this.requirements.length) {
        const defaults = this.getDefaultRequirements(this.details.application)
        this.requirements = defaults.length ? defaults : [this.createEmptyRequirement(1)]
      }
      } catch (error) {
        console.error('Error fetching renewal requirements:', error)
        const defaults = this.getDefaultRequirements(this.details.application)
        this.requirements = defaults.length ? defaults : [this.createEmptyRequirement(1)]
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/get_renewal_chronologies/${this.$route.params.detail_id}`
        )

        this.chronology = (response.data || []).map((row, index) => ({
          id: row.id,
          chronology_date: row.chronology_date || '',
          chronology_remarks: row.chronology_remarks || '',
          sort_order: row.sort_order || index + 1
        }))

        if (!this.chronology.length) {
          this.chronology = [this.createEmptyChronology(1)]
        }
      } catch (error) {
        console.error('Error fetching chronology:', error)
        this.chronology = [this.createEmptyChronology(1)]
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/get-renewal-signatures/${this.$route.params.detail_id}`
        )

        const rows = Array.isArray(response.data) ? response.data : []

        this.preparedBy = rows
          .filter(r => r.signature_type === 'prepared')
          .map(r => ({
            id: r.id,
            name: r.name || '',
            designation: r.designation || ''
          }))

        this.receivedBy = rows
          .filter(r => r.signature_type === 'received')
          .map(r => ({
            id: r.id,
            name: r.name || '',
            designation: r.designation || ''
          }))

        this.receivedNotedBy = rows
          .filter(r => r.signature_type === 'received_noted')
          .map(r => ({
            id: r.id,
            name: r.name || '',
            designation: r.designation || ''
          }))

        this.ensureSignatureSlots()
      } catch (error) {
        console.error('Error fetching signatures:', error)
        this.preparedBy = []
        this.receivedBy = []
        this.receivedNotedBy = []
        this.ensureSignatureSlots()
      }
    },

    async update() {
      try {
        const detailId = this.$route.params.detail_id

        const formData = new FormData()

        console.log('1. Updating mtsrstatus...');
        await axios.post(`${API_BASE_URL}/api/update_renewal_mtsrstatus/${detailId}`, {
          overallstatus: this.overallStatus
        });

        formData.append(
          'requirements',
          JSON.stringify(
            this.requirements.map((req, index) => ({
              id: req.id,
              requirement_no: index + 1,
              requirement_text: req.requirement_text || '',
              type: req.type || 'requirement',
              remarks: req.type === 'note' ? '' : (req.remarks || ''),
              recommendation: req.type === 'note' ? '' : (req.recommendation || '')
            }))
          )
        )

        this.requirements.forEach((req, i) => {
          req.uploads.forEach(file => {
            if (!file.existing && file.file instanceof File) {
              formData.append(`uploads[${i}][]`, file.file)
              formData.append(`uploads_meta[${i}][]`, file.file_type)
            }
          })
        })

        await axios.post(
          `${API_BASE_URL}/api/update_renewal_requirements/${detailId}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        await axios.post(
          `${API_BASE_URL}/api/update_renewal_chronologies/${detailId}`,
          {
            chronology: this.chronology.map((row, index) => ({
              id: row.id,
              chronology_date: row.chronology_date || null,
              chronology_remarks: row.chronology_remarks || null,
              sort_order: index + 1
            }))
          }
        )

        const signatures = [
          ...this.preparedBy.map(p => ({ ...p, signature_type: 'prepared' })),
          ...this.receivedBy.map(p => ({ ...p, signature_type: 'received' })),
          ...this.receivedNotedBy.map(p => ({ ...p, signature_type: 'received_noted' }))
        ].filter(row => row.name || row.designation || row.id)

        await axios.post(
          `${API_BASE_URL}/api/update_renewal_signatures/${detailId}`,
          { signatures }
        )

        alert('Update successful')
        await this.getDetails()
      } catch (error) {

      console.error(error)
      console.log(error.response?.data)
      alert(error.response?.data?.error || error.response?.data?.message || 'Update failed')
      }
    }
  },

  mounted() {
    this.id = this.$route.params.detail_id
    this.getDetails()
  }
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
</style>