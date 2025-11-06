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
<p class="text-left text-xl font-semibold p-5">APPLICATION DETAILS</p>
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
      <span class="px-2 text-xs text-blue-600 cursor-pointer" @click="showEditModal">edit</span>
      </td>

      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
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
      <td class="border border-gray-300 p-3 text-sm">{{ details.tenement_number }}</td>
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
      <td class="border border-gray-300 p-3 text-sm">{{ details.others }}</td>
      <td class="border border-gray-300 p-3 text-sm font-medium">Others</td>
      <td class="border border-gray-300 p-3 text-sm">{{ details.oth_rs }}</td>
    </tr>
  </tbody>
</table>


<!-- MANDATORY REQUIREMENTS SECTION -->
<p class="text-left text-xl font-semibold p-5">MANDATORY REQUIREMENTS</p>
<table class="w-full text-left border-collapse border border-gray-300">
  <thead class="text-xl text-center">
    <tr class="bg-green-800 text-white">
      <th class="p-2 text-base border border-gray-300">Requirements</th>
      <th class="p-2 text-base border border-gray-300" style="width: 300px;">Upload Requirements <br> and Attachments</th>
      <th class="p-2 text-base border border-gray-300">Remarks/Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 text-justify text-sm font-normal p-3" style="width: 750px;">
        <b>1.</b> Application Form (MGB Form No. 7-1) to be accompanied by eight (8) sets of the FTAA proposal and five (5) sets of the following:
        <br><br>Filing Fee: PhP300.00/hectare but not less than PhP500,000/Application (pursuant to DENR Administrative Order No. 2013-10 dated February 21, 2013).
      </td>
      <td class="p-2 flex flex-col space-y-2 justify-center items-left text-sm border-gray-300">
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
              <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Files to upload:
              </label>
              <input type="file" multiple accept="application/*" @change="handleFileUpload('file1', $event)" ref="fileInput1"
                class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
              <div v-for="(file) in uploadFiles.file1" :key="file.name">
                <p class="text-sm text-gray-500 ml-3">{{ file.name }}</p>
              </div>
        </div>
        
        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Requirements Uploaded:
          </label>
          <div v-for="(file, index) in uploadFiles.file1" :key="index">
            <a 
              :href="getFileUrl('file1', file)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ file }}
            </a>
          </div>
        </div>
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
          <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Table/Flowsheet/Images to upload: 
          </label>
          <input type="file" multiple accept="image/*" @change="handleImageUpload('img1', $event)" 
            class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
          <div v-for="(img, index) in imagesFiles.img1" :key="index">
            <p class="text-sm text-gray-500 ml-3">{{ img.name }}</p>
          </div>
        </div>

        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm mb-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Attachments:
          </label>
          <div v-for="(img, index) in imagesFiles.img1" :key="index">
            <a 
              :href="getImgUrl('img1', img)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ img }}
            </a>
          </div>
        </div>
      </td>
      <td class="border border-gray-300 text-center text-sm p-3">
        <div class="flex flex-col items-start">
        Remarks/Status: <textarea class="h-[155px] w-full border px-2" v-model="remarks.textInput1"></textarea>
        Recommendations/Lacking Submission: <textarea class="h-[155px] w-full border p-2 text-red-700" v-model="recommendation.textInput1"></textarea>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-300 text-justify text-sm font-normal p-3">
        <b>2.</b> Location Map/ Sketch Plan (1:50,000 NAMRIA topographic map) showing coordinates/ boundaries (in tabulated form) with major environmental features/ other projects (prepared, sealed and signed by a deputized Geodetic Engineer)
      </td>
      <td class="p-2 flex flex-col space-y-2 justify-center items-left text-sm border-t border-gray-300">
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
              <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Files to upload:
              </label>
              <input type="file" multiple accept="application/*" @change="handleFileUpload('file2', $event)" ref="fileInput2"
                class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
              <div v-for="(file) in uploadFiles.file2" :key="file.name">
                <p class="text-sm text-gray-500 ml-3">{{ file.name }}</p>
              </div>
        </div>
        
        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Requirements Uploaded:
          </label>
          <div v-for="(file, index) in uploadFiles.file2" :key="index">
            <a 
              :href="getFileUrl('file2', file)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ file }}
            </a>
          </div>
        </div>
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
          <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Table/Flowsheet/Images to upload: 
          </label>
          <input type="file" multiple accept="image/*" @change="handleImageUpload('img2', $event)" 
            class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
          <div v-for="(img, index) in imagesFiles.img2" :key="index">
            <p class="text-sm text-gray-500 ml-3">{{ img.name }}</p>
          </div>
        </div>

        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm mb-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Attachments:
          </label>
          <div v-for="(img, index) in imagesFiles.img2" :key="index">
            <a 
              :href="getImgUrl('img2', img)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ img }}
            </a>
          </div>
        </div>
      </td>
      <td class="border border-gray-300 text-center text-sm p-3">
        <div class="flex flex-col items-start">
        Remarks/Status: <textarea class="h-[155px] w-full border px-2" v-model="remarks.textInput2"></textarea>
        Recommendations/Lacking Submission: <textarea class="h-[155px] w-full border p-2 text-red-700" v-model="recommendation.textInput2"></textarea>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-300 text-justify text-sm font-normal p-3">
        <b>3.</b> Two (2)-Year Exploration Work Program (MGB Form No. 5-4), duly prepared, signed and sealed by a licensed Mining Engineer or Geologist
      </td>
      <td class="p-2 flex flex-col space-y-2 justify-center items-left text-sm border-t border-gray-300">
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
              <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Files to upload:
              </label>
              <input type="file" multiple accept="application/*" @change="handleFileUpload('file3', $event)" ref="fileInput3"
                class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
              <div v-for="(file) in uploadFiles.file3" :key="file.name">
                <p class="text-sm text-gray-500 ml-3">{{ file.name }}</p>
              </div>
        </div>
        
        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Requirements Uploaded:
          </label>
          <div v-for="(file, index) in uploadFiles.file3" :key="index">
            <a 
              :href="getFileUrl('file3', file)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ file }}
            </a>
          </div>
        </div>
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
          <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Table/Flowsheet/Images to upload: 
          </label>
          <input type="file" multiple accept="image/*" @change="handleImageUpload('img3', $event)" 
            class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
          <div v-for="(img, index) in imagesFiles.img3" :key="index">
            <p class="text-sm text-gray-500 ml-3">{{ img.name }}</p>
          </div>
        </div>

        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm mb-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Attachments:
          </label>
          <div v-for="(img, index) in imagesFiles.img3" :key="index">
            <a 
              :href="getImgUrl('img3', img)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ img }}
            </a>
          </div>
        </div>
      </td>
      <td class="border border-gray-300 text-center text-sm p-3">
        <div class="flex flex-col items-start">
        Remarks/Status: <textarea class="h-[155px] w-full border px-2" v-model="remarks.textInput3"></textarea>
        Recommendations/Lacking Submission: <textarea class="h-[155px] w-full border p-2 text-red-700" v-model="recommendation.textInput3"></textarea>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-300 text-justify text-sm font-normal p-3">
        <b>4.</b> Proof of technical competence in the form of:
        <br> &nbsp; &nbsp; &nbsp;4.1 Bio-data and track records in mining operations/ environmental management 
        <br> &nbsp; &nbsp; &nbsp;4.2 Sworn commitment of the technical person(s) who will undertake the implementation of the Work Programs
      </td>
      <td class="p-2 flex flex-col space-y-2 justify-center items-left text-sm border-t border-gray-300">
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
              <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Files to upload:
              </label>
              <input type="file" multiple accept="application/*" @change="handleFileUpload('file4', $event)" ref="fileInput4"
                class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
              <div v-for="(file) in uploadFiles.file4" :key="file.name">
                <p class="text-sm text-gray-500 ml-3">{{ file.name }}</p>
              </div>
        </div>
        
        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Requirements Uploaded:
          </label>
          <div v-for="(file, index) in uploadFiles.file4" :key="index">
            <a 
              :href="getFileUrl('file4', file)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ file }}
            </a>
          </div>
        </div>
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
          <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Table/Flowsheet/Images to upload: 
          </label>
          <input type="file" multiple accept="image/*" @change="handleImageUpload('img4', $event)" 
            class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
          <div v-for="(img, index) in imagesFiles.img4" :key="index">
            <p class="text-sm text-gray-500 ml-3">{{ img.name }}</p>
          </div>
        </div>

        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm mb-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Attachments:
          </label>
          <div v-for="(img, index) in imagesFiles.img4" :key="index">
            <a 
              :href="getImgUrl('img4', img)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ img }}
            </a>
          </div>
        </div>
      </td>
      <td class="border border-gray-300 text-center text-sm p-3">
        <div class="flex flex-col items-start">
        Remarks/Status: <textarea class="h-[155px] w-full border px-2" v-model="remarks.textInput4"></textarea>
        Recommendations/Lacking Submission: <textarea class="h-[155px] w-full border p-2 text-red-700" v-model="recommendation.textInput4"></textarea>
        </div>
      </td>
    </tr>
    <tr>
      <td class="border border-gray-300 text-justify text-sm font-normal p-3">
        <b>5.</b> Affidavit of Undertaking (using MGB Form No.99-10)
      </td>
      <td class="p-2 flex flex-col space-y-2 justify-center items-left text-sm border-t border-gray-300">
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
              <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Files to upload:
              </label>
              <input type="file" multiple accept="application/*" @change="handleFileUpload('file5', $event)" ref="fileInput5"
                class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
              <div v-for="(file) in uploadFiles.file5" :key="file.name">
                <p class="text-sm text-gray-500 ml-3">{{ file.name }}</p>
              </div>
        </div>
        
        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Requirements Uploaded:
          </label>
          <div v-for="(file, index) in uploadFiles.file5" :key="index">
            <a 
              :href="getFileUrl('file5', file)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ file }}
            </a>
          </div>
        </div>
        <div class="grid max-w-xs items-center gap-1.5 mx-5 justify-center">
          <label class="text-sm mt-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Table/Flowsheet/Images to upload: 
          </label>
          <input type="file" multiple accept="image/*" @change="handleImageUpload('img5', $event)" 
            class="hover:bg-amber-100 flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium cursor-pointer">
          <div v-for="(img, index) in imagesFiles.img5" :key="index">
            <p class="text-sm text-gray-500 ml-3">{{ img.name }}</p>
          </div>
        </div>

        <div class="grid max-w-xs items-center mx-5 justify-left">
          <label class="text-sm mb-3 text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Attachments:
          </label>
          <div v-for="(img, index) in imagesFiles.img5" :key="index">
            <a 
              :href="getImgUrl('img5', img)" 
              target="_blank" 
              class="text-sm text-blue-500 ml-3 hover:underline">
              {{ img }}
            </a>
          </div>
        </div>
      </td>
      <td class="border border-gray-300 text-center text-sm p-3">
        <div class="flex flex-col items-start">
        Remarks/Status: <textarea class="h-[155px] w-full border px-2" v-model="remarks.textInput5"></textarea>
        Recommendations/Lacking Submission: <textarea class="h-[155px] w-full border p-2 text-red-700" v-model="recommendation.textInput5"></textarea>
        </div>
      </td>
    </tr>
  </tbody>
</table>

    <!-- Summary of Lacking Requirements -->
    <p class="text-left text-xl font-semibold p-5">SUMMARY OF LACKING REQUIREMENTS</p>
    <table class="w-full mb-5 text-left p-2 border border-collapse">
        <thead class="w-full">
        <tr class="bg-green-800 text-white" style="text-align: center;">
          <th class="w-6/12 p-2 border text-base">Requirements</th>
          <th class="p-2 border text-base">Remarks or Status | Recommendation or Lacking Submission</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border text-xs px-2">
            <b>1.</b> &nbsp; Application Form (MGB Form No. 7-1) to be accompanied by eight (8) sets of the FTAA proposal and five (5) sets of the following:
            <br>&nbsp; &nbsp; Filing Fee: PhP300.00/hectare but not less than PhP500,000/Application (pursuant to DENR Administrative Order No. 2013-10 dated February 21, 2013).
          </td>

          <td class="text-left h-24 text-xs w-full border px-2">
            <br><label>Remarks/Status: <p>{{ remarks.textInput1 }}</p></label><br>
            <label>Recommendation or Lacking Submission: <p style="color: red;">{{ recommendation.textInput1 }}</p></label>   
          </td>
        </tr>
        
        <tr>
          <td class="border text-xs px-2">
            <b>2.</b> &nbsp; Location Map/ Sketch Plan (1:50,000 NAMRIA topographic map) showing coordinates/ boundaries (in tabulated form) with major environmental features/ other projects (prepared, sealed and signed by a deputized Geodetic Engineer)
          </td>

          <td class="text-left h-24 text-xs w-full border px-2">
            <br><label>Remarks/Status: <p>{{ remarks.textInput2 }}</p></label><br>
            <label class="mt-2">Recommendation or Lacking Submission: <p style="color: red;">{{ recommendation.textInput2 }}</p></label>   
          </td>
        </tr>

        <tr>
          <td class="border text-xs px-2">
            <b>3.</b> &nbsp; Two (2)-Year Exploration Work Program (MGB Form No. 5-4), duly prepared, signed and sealed by a licensed Mining Engineer or Geologist
          </td>

          <td class="text-left h-24 text-xs w-full border px-2">
            <br><label>Remarks/Status: <p>{{ remarks.textInput3 }}</p></label><br>
            <label class="mt-2">Recommendation or Lacking Submission: <p style="color: red;">{{ recommendation.textInput3 }}</p></label>   
          </td>
        </tr>

        <tr>
          <td class="border text-xs px-2">
            <b>4.</b> &nbsp; Proof of technical competence in the form of:
            <br> &nbsp; &nbsp; &nbsp;4.1 Bio-data and track records in mining operations/ environmental management 
            <br> &nbsp; &nbsp; &nbsp;4.2 Sworn commitment of the technical person(s) who will undertake the implementation of the Work Programs
          </td>

          <td class="text-left h-24 text-xs w-full border px-2">
            <br><label>Remarks/Status: <p>{{ remarks.textInput4 }}</p></label><br>
            <label>Recommendation or Lacking Submission: <p style="color: red;">{{ recommendation.textInput4 }}</p></label>  
          </td>
        </tr>

        <tr>
          <td class="border text-xs px-2">
            <b>5.</b> &nbsp; Affidavit of Undertaking (using MGB Form No.99-10)
          </td>

          <td class="text-left h-24 text-xs w-full border px-2">  
            <br><label>Remarks/Status: <p>{{ remarks.textInput5 }}</p></label><br>
            <label>Recommendation or Lacking Submission: <p style="color: red;">{{ recommendation.textInput5 }}</p></label>  
          </td>
        </tr>
      </tbody>
    </table>

<!-- Status of Application -->
<p class="text-left text-xl font-semibold p-5 flex items-center">
  STATUS OF THE APPLICATION
  <span class="px-2 text-xs text-blue-600 cursor-pointer" @click="openEditModal">edit</span>
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
  </tbody>
</table>

<!-- Modal Section -->
<div v-if="EditModal" class="fixed top-0 left-0 w-full h-full flex items-center justify-center" style="background-color: rgba(0, 0, 0, 0.5); z-index: 1000;" @click.self="closeEditModal">
  <div class="bg-white rounded-lg w-1/4" style="max-width: 90%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); animation: fadeIn 0.3s ease-in-out;">
    <div class="flex justify-between items-center p-4" style="border-bottom: 1px solid #ddd;"> 
      <h2 class="text-lg font-bold">Edit</h2>
    </div>
    <div class="mt-2 flex flex-col space-y-2">
      <div class="flex justify-between p-2">
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
<!-- --- -->
<div class="flex flex-col justify-center m-4">
  <div>
    <button
      class=" text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 w-36 h-10 rounded-md ml-2 hover:scale-105 transition-all duration-300"
      @click="update">
      UPDATE
    </button>
    <button
      class=" text-white hover:text-gray-950 bg-green-800 hover:bg-green-100 w-36 h-10 rounded-md ml-2 hover:scale-105 transition-all duration-300"
      @click="toggleModal">
      {{ isVisible ? 'Close' : 'View' }}
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
import imagees from '../../components/MTES/modals/imguploads.vue'
import faxx from '../mtes/factsheet.vue'
import { API_BASE_URL } from '../../config'
import axios from 'axios'

</script>

<script>
export default {
  name: 'typeapp',
  components: {
    imagees
  },
  props: {
    detail_id: String,
  },
  data() {
    return {
      currentPage: 1, // Track the current page number
      totalPages: 5,  // Set the total number of pages (this can be dynamic based on the content)
      EditModal: false,
      selectedCategory: '',
      selectedOngoingProcessing: '',
      details: {},
        status: '',
        stage_of_processing: '',
      showModal: false,
      tenement_number: '',
      isLoading: false,
      id: null,
      selectedCategory: "",
      selectedOngoingProcessing: "",
      overallStatus: '',
      isVisible: false,
      showChildComponent: false,
      selectedStatus: '',
      otherStatus: '',
      remarks: {
        textInput1: '',
        textInput2: '',
        textInput3: '',
        textInput4: '',
        textInput5: '',
      },
      recommendation: {
        textInput1: '',
        textInput2: '',
        textInput3: '',
        textInput4: '',
        textInput5: '',
      },
      uploadFiles: {
        file1: [],
        file2: [],
        file3: [],
        file4: [],
        file5: []
      },
      imagesFiles: {
        img1: [],
        img2: [],
        img3: [],
        img4: [],
        img5: []
      }
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    scrollToBottom() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    },
    getFileUrl(folder, file) {
      return `${API_BASE_URL}/storage/MandatoryRequirements/${folder}/${file}`; 
    },
    getImgUrl(folder, img) {
      return `${API_BASE_URL}/storage/Images/${folder}/${img}`;
    },
    handleFileUpload(fileKey, event) {
      const files = event?.target?.files;
      if (files?.length) {
        this.uploadFiles[fileKey] = Array.from(files);
        console.log(`Files for ${fileKey}:`, this.uploadFiles[fileKey]);
      } else {
        console.error(`No files found for key: ${fileKey}`);
      }
    },
    handleImageUpload(imgKey, event) {
      const images = event?.target?.files;
      if (images?.length) {
        this.imagesFiles[imgKey] = Array.from(images);
        console.log(`Images for ${imgKey}:`, this.imagesFiles[imgKey]);
      } else {
        console.error(`No images found for key: ${imgKey}`);
      }
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
    },
    closeEditModal() {
      this.EditModal = false;
      this.resetSelections();
    },
    showEditModal() {
      this.showModal = true;
    },
    hideEditModal() {
      this.showModal = false;
    },
    async savetenement_number() {
      console.log(`Attempting to save changes with ID: ${this.id}`);
      
      if (!this.id) {
        this.handleError('ID is undefined. Cannot save changes.');
        return;
      }

      this.isLoading = true;
      try {
        const formData = this.createFormData1();
        const response = await axios.post(`${API_BASE_URL}/update_details/${this.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert('Details updated successfully');
        await this.fetchDetails(this.id);
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
    handleError(error) {
      console.error('Error:', error);
      alert('An error occurred while saving the details.');
    },
    resetSelections() {
      this.selectedCategory = '';
      this.selectedOngoingProcessing = '';
    },
    async fetchDetails(id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/get_details/${id}`);
        this.details = response.data || {};
        this.id = this.details.id; // Assuming the ID is part of the response
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    },
    async saveChanges() {
      console.log(`Attempting to save changes with ID: ${this.id}`);
      
      if (!this.id) {
        this.handleError('ID is undefined. Cannot save changes.');
        return;
      }

      this.isLoading = true;
      try {
        const formData = this.createFormData();
        const response = await axios.post(`${API_BASE_URL}/update_status/${this.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert('Details updated successfully');
        await this.fetchDetails(this.id);
        this.closeEditModal();
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },

    createFormData() {
      const formData = new FormData();
      formData.append('status', this.selectedCategory);
      formData.append('stage_of_processing', this.selectedOngoingProcessing);
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
    myAction(payload) {
      const { containerId, images } = payload;
      this.imagesfile[containerId] = images;
      console.log(`Uploaded images for ${containerId}:`, images);
    },
    async getDetails() {
    //Details applicants
      try {
        const response = await axios.get(`${API_BASE_URL}/get_details/`);
        this.details = response.data.filter(det => det.id == this.$route.params.detail_id);
      } catch (error) {
        console.error('Error fetching details:', error);
      }

      try {
        const overallstatus = await axios.get(`${API_BASE_URL}/get_mtsrstatus`);
        const filteredoverall = overallstatus.data.find(req => req.id_reference === parseInt(this.$route.params.detail_id));

        this.overallStatus = this.filterLoremIpsum(filteredoverall.overallstatus);
      } catch (error) {
        console.error('Error fetching details:', error);
      }

      try {
  const { data = [] } = await axios.get(`${API_BASE_URL}/get_remarks`);
  const row = data.find(req => String(req.id_reference) === String(this.$route.params.detail_id)) || {};

  for (let i = 1; i <= 5; i++) {
    const raw = row[`input${i}`] ?? '';
    this.remarks[`textInput${i}`] = this.filterLoremIpsum(String(raw));
  }
} catch (error) {
  console.error('Error fetching details:', error);
}

      try {
        const requirements = await axios.get(`${API_BASE_URL}/get_recommendation`);
        const filteredrequirements = requirements.data.find(req => req.id_reference == this.$route.params.detail_id);

        this.recommendation.textInput1 = this.filterLoremIpsum(filteredrequirements.input1 !== null ? filteredrequirements.input1 : '');
        this.recommendation.textInput2 = this.filterLoremIpsum(filteredrequirements.input2 !== null ? filteredrequirements.input2 : '');
        this.recommendation.textInput3 = this.filterLoremIpsum(filteredrequirements.input3 !== null ? filteredrequirements.input3 : '');
        this.recommendation.textInput4 = this.filterLoremIpsum(filteredrequirements.input4 !== null ? filteredrequirements.input4 : '');
        this.recommendation.textInput5 = this.filterLoremIpsum(filteredrequirements.input5 !== null ? filteredrequirements.input5 : '');

      } catch (error) {
        console.error('Error fetching reco details:', error);
      }

      try {
        const uploads = await axios.get(`${API_BASE_URL}/get_files`);
        const uploadsrequirements = uploads.data.filter(req => req.id_reference == this.$route.params.detail_id);
        console.log(uploadsrequirements);

        Object.keys(this.uploadFiles).forEach(key => {
          this.uploadFiles[key] = [];
        });

        for (let i = 1; i <= 5; i++) {
          const key = `file${i}`;
          this.uploadFiles[key] = [];
        }

        uploadsrequirements.forEach((req) => {
          for (let i = 1; i <= 5; i++) {
            const key = `file${i}`;
            
            if (req.hasOwnProperty(key) && req[key] !== null) {
              try {
                this.uploadFiles[key] = JSON.parse(req[key]);
              } catch (e) {
                console.error(`Error parsing JSON for ${key}:`, e);
                this.uploadFiles[key] = [];
              }
            }
          }
        });
      } catch (error) {
        console.error('Error fetching reco details:', error);
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/get_images`);
        const imagesData = response.data.filter(req => req.id_reference == this.$route.params.detail_id);
        console.log(imagesData);
        
        Object.keys(this.imagesFiles).forEach(key => {
          this.imagesFiles[key] = [];
        });
        
        imagesData.forEach(req => {
          for (let i = 1; i <= 5; i++) {
            const key = `img${i}`;
            if (req.hasOwnProperty(key) && req[key] !== null) {
              try {
                this.imagesFiles[key] = JSON.parse(req[key]);
              } catch (e) {
                console.error(`Error parsing JSON for ${key}:`, e);
                this.imagesFiles[key] = [];
              }
            }
          }
        });
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    },
    filterLoremIpsum(text) {
      return text;
    },

    async update() {
      try {
        alert('An update has been initiated.');

        // Collecting FormData
        const formDataStatus = new FormData();
        formDataStatus.append('id_reference', this.$route.params.detail_id);
        formDataStatus.append('overallstatus', this.overallStatus);

        const formDataRemarks = new FormData();
        const formDataRecommendation = new FormData();
        formDataRemarks.append('id_reference', this.$route.params.detail_id);
        formDataRecommendation.append('id_reference', this.$route.params.detail_id);

        for (let i = 1; i <= 5; i++) {
          formDataRemarks.append(`input${i}`, this.remarks[`textInput${i}`]);
          formDataRecommendation.append(`input${i}`, this.recommendation[`textInput${i}`]);
        }

        const formDataImages = new FormData();
        formDataImages.append('id_reference', this.$route.params.detail_id);

        Object.entries(this.imagesFiles).forEach(([key, files]) => {
          if (Array.isArray(files) && files.length) {
            files.forEach(file => {
              if (file instanceof File && ['jpeg', 'jpg', 'png'].includes(file.name.split('.').pop().toLowerCase())) {
                formDataImages.append(`${key}[]`, file);
                console.log(`Appending image file: ${file.name} to ${key}[]`); // Debugging log
              }
            });
          }
        });

        const formDataUploads = new FormData();
        formDataUploads.append('id_reference', this.$route.params.detail_id);

        if (this.uploadFiles) {
          Object.entries(this.uploadFiles).forEach(([key, files]) => {
            if (Array.isArray(files)) {
              files.forEach(file => {
                if (file instanceof File && ['pdf', 'doc', 'docx'].includes(file.name.split('.').pop().toLowerCase())) {
                  formDataUploads.append(`${key}[]`, file);
                }
              });
            }
          });
        }

        // Execute API calls in parallel
        await Promise.all([
          axios.post(`${API_BASE_URL}/update_mtsrstatus/${this.$route.params.detail_id}`, formDataStatus),
          axios.post(`${API_BASE_URL}/update_remarks/${this.$route.params.detail_id}`, formDataRemarks),
          axios.post(`${API_BASE_URL}/update_recommendation/${this.$route.params.detail_id}`, formDataRecommendation),
          axios.post(`${API_BASE_URL}/update_images/${this.$route.params.detail_id}`, formDataImages, { headers: { 'Content-Type': 'multipart/form-data' } }),
          axios.post(`${API_BASE_URL}/update_uploads/${this.$route.params.detail_id}`, formDataUploads)
        ]);

        console.log('All updates completed successfully.');
        window.location.reload(); // Refresh page only once after all requests complete
      } catch (error) {
        console.error('Error during update:', error);
        window.location.reload(); // Refresh in case of error
      }
    },
  },
  mounted() {
    this.getDetails();
    const id = this.$route.params.detail_id;
    this.fetchDetails(id); 
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
</style>

