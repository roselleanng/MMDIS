<template>
  <!-- Modal -->
  <div v-if="showModal" class="fixed inset-0 overflow-y-auto" style="z-index: 10;">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal content -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div style="max-width: 40rem;" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 id="modal-title" class="flex justify-center text-xl leading-6 font-medium text-gray-900 p-4">Application Form</h3>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div class="items-center">
                  <p class="flex">Applicant Name:<p class="pl-1 text-red-500">*</p></p>
                  <input v-model="detailstoadd.tenement_name" type="text" class="w-full bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="items-center">
                  <p class="">Tenement Number:</p>
                  <input v-model="detailstoadd.tenement_number" type="text" class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
              </div>

              <!-- First Set of Dropdowns (Always Visible) -->
              <div class="mt-2">
                <p class="flex mr-5">Location 1:<p class="pl-1 text-red-500">*</p></p>
                <select @change="handleRegion(0, $event)" class="w-full bg-green-300 rounded-md text-center">
                  <option value="" disabled selected>- - - - Select a Region - - - -</option>
                  <option v-for="region in regions" :value="region.region_code" :key="region.region_code">{{ region.region_name }}</option>
                </select>
                <select v-model="detailstoadd[`province${index}`]" @change="handleProvince(0, $event)" class="w-full bg-green-300 rounded-md mt-2 text-center">
                  <option value="" disabled selected>- - - - Select Province - - - - </option>
                  <option v-for="province in locations[0].provinces" :value="province.province_code" :key="province.province_code">{{ province.province_name }}</option>
                </select>
                <select v-model="detailstoadd[`city${index}`]" @change="handleCity(0, $event)" class="w-full bg-green-300 rounded-md mt-2 text-center">
                  <option value="" disabled selected>- - - - Select City - - - - </option>
                  <option v-for="city in locations[0].cities" :value="city.city_code" :key="city.city_code">{{ city.city_name }}</option>
                </select>
                <select v-model="detailstoadd[`barangay${index}`]" @change="handleBarangay(0, $event)"class="w-full bg-green-300 rounded-md mt-2 text-center">
                  <option value="" disabled selected>- - - - Select Barangay - - - -</option>
                  <option v-for="barangay in locations[0]?.barangays" :key="barangay.brgy_code" :value="barangay.brgy_code">  {{ barangay.brgy_name }} </option>
                </select>
                <p class="flex">Area (HA):<p class="pl-1 text-red-500">*</p></p>
                <input v-model="detailstoadd.area_hectares" type="number" class="w-full bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              </div>
              

              <!-- Dynamically Added Locations -->
              <div class="mt-2" v-for="(location, index) in visibleLocations" :key="index">
                <p class="mr-5">Location {{ index + 2 }}:</p>
                <select @change="handleRegion(index + 1, $event)" class="w-full bg-amber-100 hover:bg-amber-50 rounded-md text-center">
                  <option value="" disabled selected>- - - - Select a Region - - - -</option>
                  <option v-for="region in regions" :value="region.region_code" :key="region.region_code">{{ region.region_name }}</option>
                </select>
                <select @change="handleProvince(index + 1, $event)" class="w-full bg-amber-100 hover:bg-amber-50 rounded-md mt-2 text-center">
                  <option value="" disabled selected>- - - - Select Province - - - -</option>
                  <option v-for="province in locations[index + 1].provinces" :value="province.province_code" :key="province.province_code">{{ province.province_name }}</option>
                </select>
                <select @change="handleCity(index + 1, $event)" class="w-full bg-amber-100 hover:bg-amber-50 rounded-md mt-2 text-center">
                  <option value="" disabled selected>- - - - Select City - - - - </option>
                  <option v-for="city in locations[index + 1].cities" :value="city.city_code" :key="city.city_code">{{ city.city_name }}</option>
                </select>
                <select @change="handleBarangay(index + 1, $event)" class="w-full bg-amber-100 hover:bg-amber-50 rounded-md mt-2 text-center">
                  <option value="" disabled selected>- - - - Select Barangay - - - - </option>
                  <option v-for="barangay in locations[index + 1]?.barangays" :key="barangay.brgy_code" :value="barangay.brgy_code">{{ barangay.brgy_name }}</option>
                </select>
                <p class="">Area (HA):</p>
                <input @change="handleAreaHectares(index + 1, $event)" type="number" class="w-full bg-amber-100 hover:bg-amber-50 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <!-- Remove Button to Hide the Location -->
                <button @click="removeLocation(index)" class="mt-4 hover:bg-red-700 bg-red-800 text-white px-2 py-1 rounded flex justify-end">Remove</button>
              </div>

              <!-- Button to Add More Locations (Hidden if Maximum Reached) -->
              <button v-if="visibleLocations.length < 3" @click="addLocation" class="mt-4 bg-amber-400 hover:bg-amber-200 text-black px-2 py-1 rounded">+ Add Location</button>

              <div class="grid grid-cols-2 gap-4 mt-2">
                <div class="items-center">
                  <p class="flex">Commodity:<p class="pl-1 text-red-500">*</p></p>
                  <input v-model="detailstoadd.commodity" type="text" class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="items-center">
                  <p class="flex">Date Filed:<p class="pl-1 text-red-500">*</p></p>
                  <input v-model="detailstoadd.date_filed" type="date" class="text-center w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
              </div>
              <div class="items-center">
                  <p class="">Others:</p>
                  <input v-model="detailstoadd.others" type="text" class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              </div>
                <h3 class="flex justify-center text-base leading-6 font-medium text-gray-900 p-4">Applicant's Details</h3>
                <div class="mt-2 grid grid-cols-2 gap-4">
                  <!-- Left Column -->
                  <div>
                    <div class="items-center">
                      <p class="flex mr-2 w-40">Category:<p class="pl-1 text-red-500">*</p></p>
                      <select
                        v-model="selectedCategory"
                        class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option value="" disabled selected class="text-center text-gray-100">- - - - Select an option - - - -</option>
                        <option value="Individual">Individual</option>
                        <option value="Corporation">Corporation</option>
                        <option value="Cooperative">Cooperative</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <input v-if="selectedCategory === 'Other'" v-model="otherCategory" 
                      class="mt-2 pl-1 pr-1 border rounded-md w-full" placeholder="Enter other category"/>

                    <div class="items-center mt-2">
                      <p class="mr-2">Authorized Representative:<span class="pl-1 text-red-500">*</span></p>
                      <input v-model="detailstoadd.authorized_rep" type="text" 
                        class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>

                    <div class="items-center mt-2">
                      <p class="flex mr-2 w-40">Contact Number:<p class="pl-1 text-red-500">*</p></p>
                      <input v-model="contactnum" type="text" @input="formatContactNum" 
                        class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div>
                    <div class="items-center">
                      <p class="flex mr-2 w-40">Email Address:<p class="pl-1 text-red-500">*</p></p>
                      <input v-model="detailstoadd.email" type="text" required 
                        class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>

                    <div class="items-center mt-2">
                      <p class="flex mr-2 w-40">Address:<p class="pl-1 text-red-500">*</p></p>
                      <input v-model="detailstoadd.address" type="text" required 
                        class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>

                    <div class="items-center mt-2">
                      <p class="mr-2 w-40">Others:</p>
                      <input v-model="detailstoadd.oth_rs" type="text" required 
                        class="w-full pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>
                  </div>
                </div>

                <div class="flex justify-center mt-4 border-t">
                  <label class="inline-flex items-center m-2">
                    <input v-model="detailstoadd.status" type="radio" name="options" value="On-going Process" class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                    <span class="ml-2">On-going Process</span>
                  </label>

                  <label class="inline-flex items-center m-2">
                    <input v-model="detailstoadd.status"type="radio" name="options" value="Issued" class="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"/>
                    <span class="ml-2">Issued</span>
                  </label>

                  <label class="inline-flex items-center m-2">
                    <input v-model="detailstoadd.status" type="radio" name="options" value="Denied" class="form-radio h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"/>
                    <span class="ml-2">Denied</span>
                  </label>
                  <label class="inline-flex items-center m-2">
                    <input v-model="detailstoadd.status"type="radio" name="options" value="Issued Expired" class="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"/>
                    <span class="ml-2">Issued Expired</span>
                  </label>
                </div>

                <div class="flex justify-center mt-4 border-t">
                  <label class="inline-flex items-center m-2">
                    <input v-model="detailstoadd.status"type="radio" name="options" value="With Order of Finality" class="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"/>
                    <span class="ml-2">With Order of Finality</span>
                  </label>

                  <label class="inline-flex items-center m-2">
                    <input v-model="detailstoadd.status"type="radio" name="options" value="Endorsed to MGB CO for Clearance" class="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"/>
                    <span class="ml-2">Endorsed to MGB CO for Clearance</span>
                  </label>

                  <label class="inline-flex items-center m-2">
                    <input v-model="detailstoadd.status" type="radio" name="options" value="Endorsed to MGB CO for Approval" class="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"/>
                    <span class="ml-2">Endorsed to MGB CO for Approval</span>
                  </label>
                </div>

                <!-- Conditional dropdown for "On-going Process" -->
                <div class="flex justify-between border-t" v-if="detailstoadd.status === 'On-going Process'">
                  <p class="mr-5 mt-4">Stage of Processing:</p>
                  <select v-model="selectedOngoingProcessing" class="mt-4 w-96 pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="" disabled selected class="text-center text-gray-100">- - - - Select an option - - - -</option>
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
                                <!-- Conditional input for Expiration Date when status is "Issued" -->
                                <div class="flex justify-between border-t" v-if="detailstoadd.status === 'Issued'">
                  <p class="mr-5 mt-4">Expiration Date:<span class="pl-1 text-red-500">*</span></p>
                  <input v-model="detailstoadd.expiration_date" type="date" class="mt-4 w-96 pl-1 pr-1 bg-green-300 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="$emit('close')" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
          <button @click="submit" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-800 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Modal -->
</template>

<script>
import { regions, provinces, cities, barangays } from 'select-philippines-address';
import axios from 'axios';
import { API_BASE_URL } from '../../../../config';

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      details: [],
      contactnum: '',
      selectedOngoingProcessing: '',
      selectedCategory: '',
      otherCategory: '',
      regions: [],
      locations: [{ provinces: [], cities: [], barangays: [] }], // First location initialized
      visibleLocations: [], // Tracks additional locations
      showModal: true,
      submissionStatus: '',
      detailstoadd: {
        tenement_name: '',
        tenement_number: '',
        barangay:'',
        city:'',
        province:'',
        area_hectares: '', // Main field
        commodity: '',
        date_filed: '',
        others: '',
        authorized_rep: '',
        email: '',
        address: '',
        oth_rs: '',
        status: '',
        stage_of_processing: '-',
        expiration_date: '',
        application: 'mpl'
      },
    };
  },
  computed: {
    formattedDate() {
      if (!this.detailstoadd.date_filed) return '';
      const dateObj = new Date(this.detailstoadd.date_filed);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  watch: {
    selectedCategory(newValue) {
      if (newValue !== 'other') {
        this.otherCategory = '';
      }
    },
  },
  created() {
    
    regions().then(response => {
      this.regions = response;
    });
  },
  methods: {
    handleRegion(index, event) {
      const regionName = event.target.selectedOptions[0].text;
      provinces(event.target.value).then(response => {
        this.locations[index].provinces = response;
        this.locations[index].cities = [];
        this.locations[index].barangays = [];
      });
    },
    handleProvince(index, event) {
      const selectedProvince = event.target.selectedOptions[0].text; // Get the province name
      this.detailstoadd[`province${index > 0 ? index - 0 : ''}`] = selectedProvince; // Store name

      cities(event.target.value).then(response => {
        this.locations[index].cities = response;
        this.locations[index].barangays = [];
      });
    },
    handleCity(index, event) {
      const selectedCity = event.target.selectedOptions[0].text; // Get the city name
      this.detailstoadd[`city${index > 0 ?  index - 0 : ''}`] = selectedCity; // Store name
      barangays(event.target.value).then(response => {
        this.locations[index].barangays = response;
      });
    },
    handleBarangay(index, event) {
      const selectedBarangay = event.target.selectedOptions[0].text; // Get barangay name
      this.detailstoadd[`barangay${index > 0 ?  index - 0 : '' }`] = selectedBarangay; // Store dynamically
      console.log(index)
      console.log(selectedBarangay)
    },
    handleAreaHectares(index, event) {
      const key = `area_hectares${index}`; // Ensure consistent naming
      
      this.detailstoadd[key] = event.target.value;
      console.log(`Updated ${key}:`, this.detailstoadd[key]); // Debugging
    },
    addLocation() {
      if (this.visibleLocations.length < 3) {
        this.visibleLocations.push({}); // Track visible locations
        this.locations.push({ provinces: [], cities: [], barangays: [], area_hectares: [] }); // Add valid location object
      }
    },
    removeLocation(index) {
      this.visibleLocations.splice(index, 1);
      this.locations.splice(index + 1, 1);
    },

    validateForm() {
      const missingFields = [];

      if (!this.detailstoadd.tenement_name.trim()) {
        missingFields.push('Applicant Name');
      }

      if (!this.detailstoadd.province || !this.detailstoadd.city || !this.detailstoadd.barangay) {
        missingFields.push('Complete Location 1 (Region, Province, City, Barangay)');
      }

      if (!this.detailstoadd.area_hectares) {
        missingFields.push('Area (HA) for Location 1');
      }

      if (!this.detailstoadd.commodity.trim()) {
        missingFields.push('Commodity');
      }

      if (!this.detailstoadd.date_filed) {
        missingFields.push('Date Filed');
      }

      if (!this.selectedCategory) {
        missingFields.push('Category');
      } else if (this.selectedCategory === 'Other' && !this.otherCategory.trim()) {
        missingFields.push('Other Category');
      }

      if (!this.contactnum || this.contactnum.length !== 11) {
        missingFields.push('Valid Contact Number (11 digits)');
      }

      if (!this.detailstoadd.email.trim()) {
        missingFields.push('Email Address');
      }

      if (!this.detailstoadd.address.trim()) {
        missingFields.push('Address');
      }

      if (!this.detailstoadd.status) {
        missingFields.push('Status');
      }

      if (this.detailstoadd.status === 'On-going Process' && !this.selectedOngoingProcessing) {
        missingFields.push('Stage of Processing');
      }

      if (this.detailstoadd.status === 'Issued' && !this.detailstoadd.expiration_date) {
        missingFields.push('Expiration Date');
      }
      
      

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields:\n\n${missingFields.join('\n')}`);
        return false;
      }

      return true;
    },

    submit() {

      if (!this.validateForm()) {
            return;
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(this.detailstoadd)) {
            formData.append(key, value);
        }

        formData.append('category', this.selectedCategory === 'Other' ? this.otherCategory : this.selectedCategory);
        formData.append('contact_no', this.contactnum);

        // Ensure area_hectares for first location is included
        formData.append('area_hectares', this.detailstoadd['area_hectares']);

        // Update stage_of_processing based on status
        if (this.detailstoadd.status === 'On-going Process') {
            formData.append('stage_of_processing', this.selectedOngoingProcessing);
            this.detailstoadd.stage_of_processing = this.selectedOngoingProcessing; // Ensure it's reflected in the object
        } else {
            formData.append('stage_of_processing', '-');
            this.detailstoadd.stage_of_processing = '-';
        }

                // Include expiration_date if status is "Issued"
                if (this.detailstoadd.status === 'Issued') {
            formData.append('expiration_date', this.detailstoadd.expiration_date);
        }

        this.visibleLocations.forEach((_, index) => {
            formData.append(`barangay${index + 1}`, this.detailstoadd[`barangay${index + 1}`]);
            formData.append(`city${index + 1}`, this.detailstoadd[`city${index + 1}`]);
            formData.append(`province${index + 1}`, this.detailstoadd[`province${index + 1}`]);
            formData.append(`area_hectares${index + 1}`, this.detailstoadd[`area_hectares${index + 1}`]);
        });

        axios.post(`${API_BASE_URL}/add_details`, formData)
            .then(response => {
                alert('Details submitted successfully!');
                location.reload(); // Refresh the page
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to submit details. Please try again.');
            });
    },
    formatContactNum() {
      this.contactnum = this.contactnum.replace(/\D/g, '').slice(0, 11);
      if (!this.contactnum.startsWith('09')) {
        this.contactnum = '09';
      }
    },


  }
};
</script>