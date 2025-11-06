<template>
  <!-- drawer init and show -->
  <div class="text-center flex ml-4">
    <button
      v-if="$route.path !== '/login' && $route.path !== '/' && $route.path !== '/asViewer' && $route.path !== '/mmd'"
      class="text-black bg-amber-400 hover:bg-amber-100 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none mr-2"
      type="button"
      @click="goBack"
      aria-label="Back"
    >
      <svg
        class="w-10 h-10"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
    <button
      class="text-black bg-amber-400 hover:bg-amber-100 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
      type="button"
      @click="toggleDrawer"
      aria-controls="drawer-navigation"
    >
      <img src="../assets/icons/arrow-right.png" alt="MGBLogo" style="height: 40px;">
    </button>
  </div>

  <!-- drawer component -->
  <div
    id="drawer-navigation"
    :class="{'-translate-x-full': !isDrawerVisible, 'translate-x-0': isDrawerVisible}"
    class="fixed mt-24 left-0 z-40 w-64 p-4 overflow-y-auto transition-transform bg-green-800"
    style="height: 370px;"
    tabindex="-1"
    aria-labelledby="drawer-navigation-label"
  >
    <h5 id="drawer-navigation-label" class="text-base font-semibold text-gray-100 uppercase">
      Link Directories
    </h5>
    <button
      type="button"
      @click="toggleDrawer"
      aria-controls="drawer-navigation"
      class="text-gray-100 bg-transparent hover:bg-gray-200 hover:text-black rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center"
    >
      <svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <span class="sr-only">Close menu</span>
    </button>
    <div class="py-4 overflow-y-auto">
      <ul class="space-y-2 font-medium">
        <li>
          <a
            href="https://docs.google.com/spreadsheets/d/1Mi4K6Z6piQ7QtYAg6KBHf-OfcDvPKdjjzkUZVdimSIk/edit?gid=0#gid=0"
            target="_blank"
            class="flex items-center p-2 text-gray-100 rounded-lg hover:text-amber-400"
          >
            <svg
              class="w-5 h-5 text-gray-100 transition duration-75 group-hover:text-amber-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span class="ms-3">MMD Directory of Links</span>
          </a>
        </li>

        <li>
          <a
            href="http://202.137.117.84:8010/travelorder"
            target="_blank"
            class="flex items-center p-2 text-gray-100 rounded-lg hover:text-amber-400"
          >
            <svg
              class="w-5 h-5 text-gray-100 transition duration-75 group-hover:text-amber-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span class="ms-3">Travel Order Online Application</span>
          </a>
        </li>

        <li>
          <a
            href="http://202.137.117.84:8001/"
            target="_blank"
            class="flex items-center p-2 text-gray-100 rounded-lg hover:text-amber-400"
          >
            <svg
              class="w-5 h-5 text-gray-100 transition duration-75 group-hover:text-amber-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span class="ms-3">Document Tracking System</span>
          </a>
        </li>

        <li>
          <a
            href="http://172.31.10.35:8007/rso/"
            target="_blank"
            class="flex items-center p-2 text-gray-100 rounded-lg hover:text-amber-400"
          >
            <svg
              class="w-5 h-5 text-gray-100 transition duration-75 group-hover:text-amber-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span class="ms-3">Document Archiving System</span>
          </a>
        </li>
        
        <li>
          <a
            href="http://202.137.117.84:8010/leaveform"
            target="_blank"
            class="flex items-center p-2 text-gray-100 rounded-lg hover:text-amber-400"
          >
            <svg
              class="w-5 h-5 text-gray-100 transition duration-75 group-hover:text-amber-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span class="ms-3">Leave Online Application</span>
          </a>
        </li>

        <li>
          <a
            href="https://www.facebook.com/mgbregionxofficialpage"
            target="_blank"
            class="flex items-center p-2 text-gray-100 rounded-lg hover:text-amber-400"
          >
            <svg
              class="w-5 h-5 text-gray-100 transition duration-75 group-hover:text-amber-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span class="ms-3">MGB - Region X Facebook Page</span>
          </a>
        </li>
        <li>
          <a
            href="https://region10.mgb.gov.ph/"
            target="_blank"
            class="flex items-center p-2 text-gray-100 rounded-lg hover:text-amber-400"
          >
            <svg
              class="w-5 h-5 text-gray-100 transition duration-75 group-hover:text-amber-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span class="ms-3">MGB - Region X Official Website</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDrawerVisible: false,
    };
  },
  methods: {
    toggleDrawer() {
      this.isDrawerVisible = !this.isDrawerVisible;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
/* Add necessary styles */
.transition-transform {
  transition: transform 0.3s ease;
}
.translate-x-0 {
  transform: translateX(0);
}
.-translate-x-full {
  transform: translateX(-100%);
}
</style>
