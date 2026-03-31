<template>
    <!-- PAGE 1 -->
      <div
        v-if="showThisPage(1)"
        id="page-001"
        class="bg-white border-t flex flex-col items-stretch h-[297mm]"
        style="width: 100%; max-width: 816px; position: relative; overflow: hidden;"
      >
      <img src="../../assets/icons/Header.png" class="flex" style="padding: 0px 20px" />

      <p class="mt-4 text-sm font-bold text-center" style="letter-spacing: 3px;">
        FACT SHEET / EVALUATION SHEET
      </p>

      <p class="mt-1 text-xs text-center font-semibold uppercase">
        <span class="font-normal">
          {{ formatApplication(detail.application) || '—' }}
        </span>
      </p>

      <div class="flex flex-col flex-1 ml-16">
        <!-- I. APPLICATION DETAILS -->
        <div>
          <p class="font-bold text-left text-xs mt-10 mb-4" style="letter-spacing: 3px;">
            I.  APPLICATION DETAILS
          </p>

          <table class="w-11/12 border border-gray-300 table-fixed" style="font-size: 10px;">
            <tbody>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left w-72">NAME OF APPLICANT:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.tenement_name }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">APPLICATION NUMBER:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.tenement_number || '' }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">LOCATION:</td>
                <td class="px-2 py-1 border border-gray-300 text-left whitespace-pre-wrap break-words">
                  {{ formatLocation(detail) }}
                </td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">COMMODITY:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.commodity }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">AREA (HECTARES):</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.area_hectares }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">DATE FILED:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.date_filed }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- II. APPLICANT'S DETAILS -->
        <div>
          <p class="font-bold text-left text-xs mt-8 mb-4" style="letter-spacing: 3px;">
            II.  APPLICANT'S DETAILS
          </p>

          <table class="w-11/12 border border-gray-300 table-fixed" style="font-size: 10px;">
            <tbody>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left w-72">CATEGORY:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.category }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">AUTHORIZED REPRESENTATIVE:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.authorized_rep }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">CONTACT NUMBER:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.contact_no }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">EMAIL ADDRESS:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">{{ detail.email }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 font-bold border border-gray-300 text-left">OTHERS:</td>
                <td class="px-2 py-1 border border-gray-300 text-left">
                  <span v-if="detail.others && detail.others !== 'null'">
                    {{ detail.others }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- III. CHRONOLOGY -->
        <div>
          <p class="font-bold text-left text-xs mt-8 mb-4" style="letter-spacing: 3px;">
            III.&nbsp;&nbsp;CHRONOLOGY (APPLICATION PERIOD)
          </p>

          <table
            v-if="chronologyItems.length > 0"
            class="page1-chronology-table w-11/12 border border-gray-300 table-fixed break-inside-avoid"
            style="font-size: 10px;"
          >
            <thead>
              <tr>
                <th class="px-2 py-1 font-bold border border-gray-300 text-center w-1/4">Date</th>
                <th class="px-2 py-1 font-bold border border-gray-300 text-center">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in chronologyPage1" :key="'chronology-1-' + index">
                <td class="px-2 py-1 border border-gray-300 text-left align-top whitespace-pre-wrap break-words">
                  {{ item.date }}
                </td>
                <td class="px-2 py-1 border border-gray-300 text-left align-top whitespace-pre-wrap break-words">
                  {{ item.remarks }}
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else class="text-xs text-gray-500">
            No records available
          </p>

        </div>
        </div>

      <div class="flex justify-center mt-auto pt-6 pb-4">
  <img src="../../assets/icons/Footer.png" style="width: 80%;" />
</div>
    </div>

    <!-- EXTRA CHRONOLOGY PAGES -->
    <template v-for="(chunk, pageIndex) in chronologyOverflowPages" :key="'chronology-page-' + pageIndex">
      <div
        :id="`page-chron-${pageIndex + 1}`"
        v-if="showThisPage(pageIndex + 2)"
        class="bg-white border-t flex flex-col h-[297mm]"
        style="width: 100%; max-width: 816px; position: relative; overflow: hidden;"
      >
        <img src="../../assets/icons/Header.png" class="flex" style="padding: 0px 20px" />

        <div class="flex flex-col flex-1 ml-16 mt-8">
          <div>
            <p class="font-bold text-left text-xs mt-8 mb-4" style="letter-spacing: 3px;">
              III.  CHRONOLOGY (APPLICATION PERIOD)
            </p>

            <table class="w-11/12 border border-gray-300 table-fixed" style="font-size: 10px;">
              <thead>
                <tr>
                  <th class="px-2 py-1 font-bold border border-gray-300 text-center w-1/4">Date</th>
                  <th class="px-2 py-1 font-bold border border-gray-300 text-center">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in chunk" :key="'chronology-overflow-' + pageIndex + '-' + index">
                  <td class="px-2 py-1 border border-gray-300 text-left align-top whitespace-pre-wrap break-words">
                    {{ item.date }}
                  </td>
                  <td class="px-2 py-1 border border-gray-300 text-left align-top whitespace-pre-wrap break-words">
                    {{ item.remarks }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-center mt-auto pt-6 pb-4">
          <img src="../../assets/icons/Footer.png" style="width: 80%;" />
        </div>
      </div>
    </template>

    <!-- REQUIREMENT PAGES -->
    <template v-for="(reqChunk, pageIndex) in requirementPages" :key="'req-page-' + pageIndex">
    <div
          :id="`page-req-${pageIndex + 1}`"
          v-if="showThisPage(chronologyOverflowPages.length + pageIndex + 2)"
          class="bg-white border-t flex flex-col h-[297mm]"
          style="width: 100%; max-width: 816px; position: relative; overflow: hidden;"
        >
        <img src="../../assets/icons/Header.png" class="flex" style="padding: 0px 20px" />

    <div class="flex flex-col flex-1 ml-16 mt-8">
      <div>
        <p class="font-bold text-left text-xs mt-8 mb-4" style="letter-spacing: 3px;">
          IV.  MANDATORY REQUIREMENTS
        </p>

        <table class="w-11/12 border border-gray-300 table-fixed" style="font-size: 10px;">
          <thead>
            <tr class="text-center">
              <th class="border px-2 py-1 align-middle font-bold" style="width: 40%;">Requirement</th>
              <th v-if="!viewMode" class="border px-2 py-1 align-middle font-bold" style="width: 18%;">Uploads</th>
              <th class="border px-2 py-1 align-middle font-bold" :style="viewMode ? 'width: 30%;' : 'width: 21%;'">Remarks / Status</th>
              <th class="border px-2 py-1 align-middle font-bold" :style="viewMode ? 'width: 30%;' : 'width: 21%;'">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(req, index) in reqChunk" :key="req.id || `req-${pageIndex}-${index}`">
              <td class="px-2 py-2 border border-gray-300 text-left align-top whitespace-pre-wrap break-words leading-tight">
                {{ getRequirementDisplayNumber(pageIndex, index) }}. {{ req.requirement_text }}
              </td>

              <td v-if="!viewMode" class="px-2 py-2 border border-gray-300 text-left align-top">
                <div v-for="file in (req.uploads || [])" :key="file.id || file.file_name" class="whitespace-pre-wrap break-words leading-tight">
                  *{{ file.file_name }}
                </div>
              </td>

              <td class="px-2 py-2 border border-gray-300 text-left align-top whitespace-pre-wrap break-words leading-tight">
                {{ req.remarks }}
              </td>

              <td class="px-2 py-2 border border-gray-300 text-left align-top whitespace-pre-wrap break-words leading-tight text-red-600">
                {{ req.recommendation }}
              </td>
            </tr>
            <tr v-if="reqChunk.length === 0">
              <td :colspan="viewMode ? 3 : 4" class="px-2 py-2 border border-gray-300 text-center text-gray-500">
                  No requirements
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex justify-center mt-auto pt-6 pb-4">
      <img src="../../assets/icons/Footer.png" style="width: 80%;" />
      </div>
    </div>
  </template>


      

    <!-- SUMMARY PAGES -->
    <template v-for="(sumChunk, pageIndex) in summaryPages" :key="'sum-page-' + pageIndex">
      <div
        :id="`page-sum-${pageIndex + 1}`"
        v-if="showThisPage(chronologyOverflowPages.length + requirementPages.length + pageIndex + 2)"
        class="bg-white border-t flex flex-col h-[297mm]"
        style="width: 100%; max-width: 816px; position: relative; overflow: hidden;"
      >
      <img src="../../assets/icons/Header.png" class="flex" style="padding: 0px 20px" />

<div class="flex flex-col flex-1 ml-16">
  <div>
    <p class="font-bold text-left text-xs mt-8 mb-4" style="letter-spacing: 3px;">
      V.  SUMMARY OF LACKING REQUIREMENTS
    </p>

    <table class="w-11/12 border border-gray-300 table-fixed" style="font-size: 10px;">
      <thead>
        <tr class="text-center">
          <th class="border px-2 py-1 align-middle font-bold" style="width: 50%;">Requirement</th>
          <th class="border px-2 py-1 align-middle font-bold" style="width: 50%;">Recommendation or Lacking Submission</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(req, index) in sumChunk" :key="'summary-' + pageIndex + '-' + index">
          <td class="px-2 py-2 border border-gray-300 text-left align-top whitespace-pre-wrap break-words leading-tight">
            {{ getSummaryDisplayNumber(pageIndex, index) }}. {{ req.requirement_text }}
          </td>
          <td class="px-2 py-2 border border-gray-300 text-left align-top whitespace-pre-wrap break-words leading-tight text-red-600">
            {{ req.recommendation }}
          </td>
        </tr>

        <tr v-if="sumChunk.length === 0">
          <td colspan="2" class="px-2 py-2 border border-gray-300 text-center text-gray-500">
            No summary items
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="flex justify-center mt-auto pt-6 pb-4">
<img src="../../assets/icons/Footer.png" style="width: 80%;" />
</div>
</div>
    </template>


      

    <!-- STATUS / OVERALL / SIGNATURE PAGES -->
    <template v-for="(sigPage, pageIndex) in statusSignaturePages" :key="'status-page-' + pageIndex">
  <div
    :id="pageIndex === 0 ? 'page-status' : `page-status-${pageIndex + 1}`"
    v-if="showThisPage(chronologyOverflowPages.length + requirementPages.length + summaryPages.length + pageIndex + 2)"
    class="bg-white border-t flex flex-col h-[297mm]"
    style="width: 100%; max-width: 816px; position: relative; overflow: hidden;"
  >
  <img src="../../assets/icons/Header.png" class="flex" style="padding: 0px 20px" />

<div class="flex flex-col flex-1 ml-16">
  <!-- Only first status/signature page shows status + overall -->
  <template v-if="pageIndex === 0">
    <div>
      <p class="font-bold text-left text-xs mt-8 mb-4" style="letter-spacing: 3px;">
        VI.  STATUS OF THE APPLICATION
      </p>

      <table class="w-11/12 border border-gray-300 table-fixed" style="font-size: 10px;">
        <thead>
          <tr class="text-center">
            <th class="border px-2 py-1 font-bold w-1/2">Field</th>
            <th class="border px-2 py-1 font-bold w-1/2">Remarks / Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-2 py-1 border border-gray-300 text-left align-top">Status</td>
            <td class="px-2 py-1 border border-gray-300 text-left align-top whitespace-pre-wrap break-words">
              <span>{{ detail.status }}</span>
              <span v-if="detail.status === 'On-going Process'" class="italic block mt-1">
                {{ detail.stage_of_processing }}
              </span>
            </td>
          </tr>
          <tr v-if="detail.status === 'Issued' && detail.expiration_date">
            <td class="px-2 py-1 border border-gray-300 text-left align-top">Expiration Date</td>
            <td class="px-2 py-1 border border-gray-300 text-left align-top whitespace-pre-wrap break-words">
              {{ detail.expiration_date }}
            </td>
          </tr>
          <tr v-if="detail.status === 'Issued' && detail.renewal">
            <td class="px-2 py-1 border border-gray-300 text-left align-top">Renewal</td>
            <td class="px-2 py-1 border border-gray-300 text-left align-top whitespace-pre-wrap break-words">
              {{ detail.renewal }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <p class="font-bold text-left text-xs mt-8 mb-4" style="letter-spacing: 3px;">
        VII.  OVERALL REMARKS/ RECOMMENDATIONS
      </p>

      <table class="w-11/12 border border-gray-300 table-fixed" style="font-size: 10px;">
        <thead>
          <tr class="text-center">
            <th class="border px-2 py-1 align-middle font-bold" style="width: 40%;">Field</th>
            <th class="border px-2 py-1 align-middle font-bold" style="width: 60%;">Remarks / Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-2 py-2 border border-gray-300 text-left align-top">
              Overall Remarks / Status / Recommendation
            </td>
            <td class="px-2 py-2 border border-gray-300 text-left align-top whitespace-pre-wrap break-words">
              {{ overallvalue }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <!-- Signatures -->
  <div :class="pageIndex === 0 ? 'mt-8' : 'mt-12'">
    <p class="font-bold text-left text-xs mb-4" style="letter-spacing: 3px;">
      <span v-if="pageIndex === 0">VIII.  </span>SIGNATURES
      <span v-if="statusSignaturePages.length > 1">
        ({{ pageIndex + 1 }} of {{ statusSignaturePages.length }})
      </span>
    </p>

    <!-- Prepared by -->
    <div class="signature-block" v-if="sigPage.prepared.length">
      <p class="signature-title text-left">Prepared by:</p>
      <div class="signature-grid">
        <div
          v-for="(p, i) in sigPage.prepared"
          :key="'prep-' + pageIndex + '-' + i"
          class="signature-item"
        >
          <p class="signature-name with-line">{{ p.name }}</p>
          <p class="signature-role">{{ p.designation }}</p>
        </div>
      </div>
    </div>

    <!-- Received by -->
    <div class="signature-block" v-if="sigPage.received.length">
      <p class="signature-title text-left">Received by:</p>
      <div class="signature-grid">
        <div
          v-for="(p, i) in sigPage.received"
          :key="'rec-' + pageIndex + '-' + i"
          class="signature-item"
        >
          <p class="signature-name with-line">{{ p.name }}</p>
          <p class="signature-role">{{ p.designation }}</p>
        </div>
      </div>
    </div>

    <!-- Received / Noted by -->
    <div class="signature-block" v-if="sigPage.receivedNoted.length">
      <p class="signature-title text-left">Received / Noted by:</p>
      <div class="signature-grid">
        <div
          v-for="(p, i) in sigPage.receivedNoted"
          :key="'note-' + pageIndex + '-' + i"
          class="signature-item"
        >
          <p class="signature-name with-line">{{ p.name }}</p>
          <p class="signature-role">{{ p.designation }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="!sigPage.prepared.length && !sigPage.received.length && !sigPage.receivedNoted.length"
      class="text-xs text-gray-500"
    >
      No signatures
    </div>
  </div>
</div>

<div class="flex justify-center mt-auto pt-6 pb-4">
<img src="../../assets/icons/Footer.png" style="width: 80%;" />
</div>
</div>

</template>

 

    <!-- PAGE CONTROLS -->
    <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-xl border z-50 flex items-center gap-4 max-w-md">
      <div class="flex items-center gap-2 text-xs">
        <label class="font-medium">Preview:</label>
        <select v-model="previewMode" @change="onPreviewModeChange" class="border px-2 py-1 rounded text-xs">
          <option value="single">Single Page</option>
        </select>
      </div>
  
      <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-xl border z-50 flex items-center gap-4 max-w-md">
        <div class="flex items-center gap-2 text-sm font-medium">
        <span>Page</span>
        <input
          v-model.number="currentPage"
          @change="goToPage(currentPage)"
          type="number"
          :min="1"
          :max="totalPages"
          class="w-16 border px-2 py-1 rounded text-center"
        />
        <span>of {{ totalPages }}</span>
        <button
          @click="goBack"
          :disabled="currentPage <= 1"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          ←
        </button>
        <button
          @click="goNext"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          →
        </button>
      </div>

      <button @click="downloadAllPDFs" class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium ml-auto">
        📄 Download PDF
      </button>
    </div>
    </div>
  </template>

  <script>
  import html2pdf from 'html2pdf.js';
  import jsPDF from 'jspdf';
  import axios from 'axios';
  import { API_BASE_URL } from '../../config';

  export default {
    props: {
      detail_id: String,
    },

    data() {
      return {
        preparedBy: [],
        receivedBy: [],
        receivedNotedBy: [],
        details: [],
        overallvalue: '',
        requirements: [],
        chronology: [],
        currentPage: 1,
        forceRenderPages: false,
        viewMode: true,
        previewMode: 'single',  // New: 'all' | 'single'
      };
    },

    computed: {
      
      showAllPages() {
        return this.previewMode === 'all' || this.forceRenderPages;
      },
      chronologyItems() {
      return (this.chronology || [])
        .map((item, index) => ({
          id: item.id || index + 1,
          date: item.date || item.chronology_date || '',
          remarks: item.remarks || item.chronology_remarks || ''
        }))
        .filter(item => {
          const hasDate = String(item.date || '').trim() !== ''
          const hasRemarks = String(item.remarks || '').trim() !== ''
          return hasDate || hasRemarks
        })
    },
      allPages() {
        const pages = [];

        pages.push({
          id: 'page-001',
          type: 'main'
        });

        this.chronologyOverflowPages.forEach((chunk, index) => {
          pages.push({
            id: `page-chron-${index + 1}`,
            type: 'chronology',
            chunk,
            index
          });
        });

        this.requirementPages.forEach((chunk, index) => {
          pages.push({
            id: `page-req-${index + 1}`,
            type: 'requirement',
            chunk,
            index
          });
        });

        this.summaryPages.forEach((chunk, index) => {
          pages.push({
            id: `page-sum-${index + 1}`,
            type: 'summary',
            chunk,
            index
          });
        });

        this.statusSignaturePages.forEach((chunk, index) => {
          pages.push({
            id: index === 0 ? 'page-status' : `page-status-${index + 1}`,
            type: 'status',
            chunk,
            index
          });
        });

        return pages;
      },

      detail() {
        return this.details[0] || {};
      },

      chronologyPage1() {
        return this.firstChronologyChunk;
      },

      chronologyOverflowPages() {
        return this.remainingChronologyChunks;
      },

firstChronologyChunk() {
        const firstPageMax = 12; // Conservative for page 1 space after headers
        let chunk = [];
        let weight = 0;

        for (const item of this.chronologyItems) {
          const itemWeight = this.estimateChronologyWeight(item);

          if (weight + itemWeight > firstPageMax) break;

          chunk.push(item);
          weight += itemWeight;
        }

        console.log(`Page 1 chronology: ${chunk.length} items, weight: ${weight}/${firstPageMax}`);
        return chunk;
      },

      remainingChronologyChunks() {
        const remaining = this.chronologyItems.slice(this.firstChronologyChunk.length);
        return this.chunkChronologyByWeight(remaining, 42);
      },

      requirementPages() {
        const chunks = this.chunkRequirementsByWeight(this.requirements, 2600);
        return chunks.length ? chunks : [[]];
      },
      summaryPages() {
        const summaryItems = this.requirements.map((req) => ({
            id: req.id,
            requirement_text: req.requirement_text || '',
            recommendation: req.recommendation || '',
        }));

        const chunks = this.chunkSummaryByWeight(summaryItems, 20);
        return chunks.length ? chunks : [[]];
        },

      statusSignaturePages() {
        const pages = this.buildStatusSignaturePages();
        return pages.length ? pages : [{ prepared: [], received: [], receivedNoted: [] }];
      },

      allPageIds() {
        return this.allPages.map(page => page.id);
      },

      totalPages() {
        return this.allPages.length;
      },
    },

    methods: {
      showThisPage(pageNum) {
        if (this.forceRenderPages) return true; // for PDF only
        return this.currentPage === pageNum;
      },

      onPreviewModeChange() {
        if (this.previewMode === 'all') {
          this.currentPage = 1; // Reset when showing all
        }
      },

      goNext() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.scrollToTop();
        }
      },

      goBack() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.scrollToTop();
        }
      },

      goToPage(pageNum) {
        pageNum = Math.max(1, Math.min(this.totalPages, pageNum || 1));
        this.currentPage = pageNum;
        this.scrollToTop();
      },

      scrollToTop() {
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      },

      formatApplication(app) {
        const map = {
          ftta: 'Financial or Technical Assistance Agreement',
          mpsa: 'Mineral Production Sharing Agreement',
          ep: 'Exploration Permit',
          mpp: 'Mineral Processing Permit',
          isg: 'Industrial Sand and Gravel',
          otp: 'Ore Transportation Permit',
          dmb: 'Declaration of Minahang Bayan',
          ssmc: 'Small-Scale Mining Contracts',
          mpl: 'Mineral Processors License',
          amtrd: 'Accreditation as Mineral Trader, Retailer, and Dealer',
          moep: 'Mineral Ore Export Permit',
        };
        return map[app] || app;
      },

      formatLocation(detail) {
        const locations = [
          [detail.barangay, detail.city, detail.province, detail.area_hectares],
          [detail.barangay1, detail.city1, detail.province1, detail.area_hectares1],
          [detail.barangay2, detail.city2, detail.province2, detail.area_hectares2],
          [detail.barangay3, detail.city3, detail.province3, detail.area_hectares3],
        ];

        return locations
          .filter(([barangay, city, province]) => {
            return [barangay, city, province].some(
              (value) => value !== null && value !== undefined && String(value).trim() !== '' && String(value) !== 'null'
            );
          })
          .map(([barangay, city, province, hectares]) => {
            const location = [barangay, city, province]
              .filter((value) => value !== null && value !== undefined && String(value).trim() !== '' && String(value) !== 'null')
              .join(', ');

            return hectares ? `${location} (${hectares} hectare/s)` : location;
          })
          .join('\n');
      },

      estimateRequirementWeight(req) {
        const text1Lines = (req.requirement_text || '').split(/\n|(?<=.{50}) /g).length;
        const text2Lines = (req.remarks || '').split(/\n|(?<=.{40}) /g).length;
        const text3Lines = (req.recommendation || '').split(/\n|(?<=.{40}) /g).length;
        const uploadLines = (req.uploads || []).length;
        return Math.max(3, text1Lines + text2Lines + text3Lines + uploadLines);
        },

        estimateSummaryWeight(req) {
        const text = (req.requirement_text || '') + (req.recommendation || '');
        const len = text.length;

        if (len < 180) return 1;   // normal rows
        if (len < 350) return 2;   // medium rows
        return 3;                  // very long rows
        },

        estimateChronologyWeight(item) {
          const remarks = item.remarks || '';
          const explicitLines = remarks.split('\n').length;
          const wrappedLines = Math.ceil(remarks.length / 110);
          return Math.max(2, Math.max(explicitLines, wrappedLines));
        },

chunkRequirementsByWeight(items, maxRowsPerPage = 6) {
  const chunks = [];
  let currentChunk = [];
  let currentRows = 0;

  for (const item of items) {
    const rows = this.estimateRequirementWeight(item);

    if (currentChunk.length > 0 && (currentRows + rows > maxRowsPerPage || currentChunk.length >= 8)) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentRows = 0;
    }

    currentChunk.push(item);
    currentRows += rows;
  }

  if (currentChunk.length) {
    chunks.push(currentChunk);
  }

  console.log(`Requirements chunked: ${chunks.length} pages for ${items.length} items`);
  return chunks.length ? chunks : [[]];
},

chunkSummaryByWeight(items, maxRowsPerPage = 22) {
  const chunks = [];
  let currentChunk = [];
  let currentRows = 0;

  for (const item of items) {
    const rows = this.estimateSummaryWeight(item);

    if (currentChunk.length > 0 && currentRows + rows > maxRowsPerPage) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentRows = 0;
    }

    currentChunk.push(item);
    currentRows += rows;
  }

  if (currentChunk.length) {
    chunks.push(currentChunk);
  }

  // Simple rebalance
  if (chunks.length >= 2) {
    const lastChunk = chunks[chunks.length - 1];
    const prevChunk = chunks[chunks.length - 2];

    if (lastChunk.length <= 2 && prevChunk.length > 2) {
      lastChunk.unshift(prevChunk.pop());
    }
  }

  return chunks.length ? chunks : [[]];
},
    chunkChronologyByWeight(items, maxWeight = 42) {
      if (!items.length) return [];

      const chunks = [];
      let currentChunk = [];
      let currentWeight = 0;

      for (const item of items) {
        const weight = this.estimateChronologyWeight(item);

        if (currentChunk.length > 0 && currentWeight + weight > maxWeight) {
          chunks.push(currentChunk);
          currentChunk = [];
          currentWeight = 0;
        }

        currentChunk.push(item);
        currentWeight += weight;
      }

      if (currentChunk.length) {
        chunks.push(currentChunk);
      }

      // Rebalance: move first row of next page back if previous page still has room
      for (let i = 0; i < chunks.length - 1; i++) {
        const current = chunks[i];
        const next = chunks[i + 1];

        if (!next.length) continue;

        const currentWeightSum = current.reduce(
          (sum, row) => sum + this.estimateChronologyWeight(row),
          0
        );

        const nextFirstWeight = this.estimateChronologyWeight(next[0]);

        if (currentWeightSum + nextFirstWeight <= maxWeight) {
          current.push(next.shift());
        }
      }

      return chunks.filter(chunk => chunk.length > 0);
    },

      chunkArrayBySize(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size));
        }
        return chunks;
      },

      buildStatusSignaturePages() {
        const preparedChunks = this.chunkArrayBySize(this.preparedBy, 4);
        const receivedChunks = this.chunkArrayBySize(this.receivedBy, 4);
        const receivedNotedChunks = this.chunkArrayBySize(this.receivedNotedBy, 4);

        const maxLen = Math.max(preparedChunks.length, receivedChunks.length, receivedNotedChunks.length, 1);

        const pages = [];

        for (let i = 0; i < maxLen; i++) {
          pages.push({
            prepared: preparedChunks[i] || [],
            received: receivedChunks[i] || [],
            receivedNoted: receivedNotedChunks[i] || [],
          });
        }

        return pages;
      },

      getRequirementDisplayNumber(pageIndex, rowIndex) {
        let count = 0;
        for (let i = 0; i < pageIndex; i++) {
          count += this.requirementPages[i].length;
        }
        return count + rowIndex + 1;
      },

      getSummaryDisplayNumber(pageIndex, rowIndex) {
        let count = 0;
        for (let i = 0; i < pageIndex; i++) {
          count += this.summaryPages[i].length;
        }
        return count + rowIndex + 1;
      },

      async downloadAllPDFs() {
        this.forceRenderPages = true;
        await this.$nextTick();

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = 210;
        const folioIds = this.allPageIds;

        for (let i = 0; i < folioIds.length; i++) {
          const element = document.getElementById(folioIds[i]);
          if (!element) continue;

          const canvas = await html2pdf()
            .from(element)
            .set({
              html2canvas: {
                scale: 2,
                useCORS: true,
              },
            })
            .toCanvas()
            .get('canvas');

          const imgData = canvas.toDataURL('image/png');
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;

          if (i !== 0) {
            pdf.addPage('a4', 'portrait');
          }

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        }

        pdf.save('evaluation-sheet.pdf');
        this.forceRenderPages = false;
      },

      async fetchDetails() {
        const detailId = this.$route.params.detail_id;

        try {
          const detailsResponse = await axios.get(`${API_BASE_URL}/get_details/${detailId}`);
          this.details = detailsResponse.data ? [detailsResponse.data] : [];
        } catch (error) {
          console.error('Error fetching details:', error);
          this.details = [];
        }

        try {
          const requirementsResponse = await axios.get(`${API_BASE_URL}/api/mandatory_requirements/${detailId}`);

          const rawRequirements = Array.isArray(requirementsResponse.data)
            ? requirementsResponse.data
            : Array.isArray(requirementsResponse.data?.data)
              ? requirementsResponse.data.data
              : [];

          this.requirements = rawRequirements.map((req) => ({
            id: req.id,
            requirement_no: req.requirement_no,
            requirement_text: req.requirement_text || '',
            remarks: req.remarks || '',
            recommendation: req.recommendation || '',
            uploads: Array.isArray(req.uploads) ? req.uploads : [],
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

          this.chronology = rawChronology.map((item) => ({
            id: item.id,
            date: item.chronology_date || '',
            remarks: item.chronology_remarks || '',
          }));
        } catch (error) {
          console.error('Error fetching chronology:', error);
          this.chronology = [];
        }

        try {
          const overallstatus = await axios.get(`${API_BASE_URL}/api/get_mtsrstatus`);
          const filteredoverall = overallstatus.data.find(
            (req) => req.id_reference === parseInt(detailId)
          );
          this.overallvalue = filteredoverall?.overallstatus || '';
        } catch (error) {
          console.error('Error fetching overall status:', error);
          this.overallvalue = '';
        }

        try {
          const signaturesResponse = await axios.get(`${API_BASE_URL}/api/signatures/${detailId}`);
          const rawSignatures = Array.isArray(signaturesResponse.data)
            ? signaturesResponse.data
            : Array.isArray(signaturesResponse.data?.data)
              ? signaturesResponse.data.data
              : [];

          this.preparedBy = rawSignatures
            .filter((item) => item.signature_type === 'prepared')
            .map((item) => ({
              id: item.id,
              name: item.name || '',
              designation: item.designation || '',
            }));

          this.receivedBy = rawSignatures
            .filter((item) => item.signature_type === 'received')
            .map((item) => ({
              id: item.id,
              name: item.name || '',
              designation: item.designation || '',
            }));

          this.receivedNotedBy = rawSignatures
            .filter((item) => item.signature_type === 'received_noted')
            .map((item) => ({
              id: item.id,
              name: item.name || '',
              designation: item.designation || '',
            }));
        } catch (error) {
          console.error('Error fetching signatures:', error);
          this.preparedBy = [];
          this.receivedBy = [];
          this.receivedNotedBy = [];
        }

        // Auto-adjust current page if out of bounds
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      },
    },

    mounted() {
      this.fetchDetails();
      this.viewMode = true;
      this.previewMode = 'all'; // Default to show all pages
    },

    watch: {
      totalPages(newTotal) {
        if (this.currentPage > newTotal) {
          this.currentPage = newTotal || 1;
        }
      }
    }
  };
  </script>

  <style scoped>
  .signature-block {
    margin-bottom: 24px;
  }

  .signature-title {
    font-size: 10px;
    font-weight: bold;
    margin-bottom: 12px;
  }

  .signature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 60px;
    row-gap: 28px;
  }

  .signature-item {
    text-align: center;
  }

  .signature-name.with-line {
    display: inline-block;
    font-size: 10px;
    font-weight: bold;
    padding: 0 8px 2px;
    border-bottom: 1px solid #000;
    margin-bottom: 4px;
    max-width: 100%;
    word-break: break-word;
  }

  .signature-role {
    font-size: 9px;
    font-style: italic;
    word-break: break-word;
  }

  table {
    border-collapse: collapse;
  }

  td,
  th {
    word-break: break-word;
  }

  /* Page controls styling */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Print/PDF pagination fixes */
  @media print {
    .page1-chronology-table {
      page-break-inside: avoid !important;
      max-height: 140mm !important;
      overflow: hidden !important;
    }
    
    .page1-chronology-table tbody tr {
      page-break-inside: avoid !important;
      page-break-after: auto !important;
    }
    
    #page-001 {
      page-break-after: always !important;
      overflow: hidden !important;
    }
    
    /* Ensure flex footer stays at bottom */
    #page-001 > div:last-child {
      flex-shrink: 0 !important;
      position: sticky !important;
      bottom: 0 !important;
    }
  }
  </style>

