// Import Vue Router components
import { createRouter, createWebHistory } from "vue-router";
// import home from "../views/home.vue";

// MTSS Views
import login from "../views/Login.vue";
import dashboard from "../views/mtss/dashboard.vue";
import ostc from "../views/mtss/ostc.vue";
import inventory from "../views/mtss/inventory.vue";
import wpm from "../views/mtss/wpm.vue";
import mbm from "../views/mtss/mbm.vue";
import investigation from "../views/mtss/investigation.vue";
import antiillegal from "../views/mtss/anti-illegal.vue";
import dmpf from "../views/mtss/dmpf.vue";
import pcmrb from "../views/mtss/pcmrb.vue";
import mpsa from "../views/mtss/mpsa.vue";
import isag from "../views/mtss/isag.vue";
import ep from "../views/mtss/ep.vue";
import mpp from "../views/mtss/mpp.vue";

// MLSS Views
import mlssdashboard from "../views/mlss/mlssdashboard.vue";
import CSAG from "../views/mlss/CSAG.vue";
import ISAG from "../views/mlss/ISAG.vue";
import MQUARRY from "../views/mlss/MQUARRY.vue";
import MiningTenementMaps from "../views/mlss/dbMTM.vue";
import MineralOreExportPermit from "../views/mlss/dbMOEPV.vue";
import PDFcontent from "../components/MLSS/pdf-content.vue";

// MTES Views
import firstpage from "../views/mtes/dashboard.vue";  
import applicationpage from "../views/mtes/new-application.vue";
import permitpage from "../views/mtes/permit.vue";
import renewalpage from "../views/mtes/renewal.vue";


// MTES Dashboards
import fttadashboard from "../views/mtes/dashboards/FTAA-dashboard.vue";
import epdashboard from "../views/mtes/dashboards/EP-dashboard.vue";
import mpsadashboard from "../views/mtes/dashboards/MPSA-dashboard.vue";
import isagdashboard from "../views/mtes/dashboards/ISAG-dashboard.vue";
import mbdashboard from "../views/mtes/dashboards/MB-dashboard.vue";
import mpldashboard from "../views/mtes/dashboards/MPL-dashboard.vue";
import mppdashboard from "../views/mtes/dashboards/MPP-dashboard.vue";
import otpdashboard from "../views/mtes/dashboards/OTP-dashboard.vue";
import ssmcdashboard from "../views/mtes/dashboards/SSMC-dashboard.vue";
import amtrddashboard from "../views/mtes/dashboards/AMTRD-dashboard.vue";
import moepddashboard from "../views/mtes/dashboards/MOEP-dashboard.vue";

  // MTES Mandatory Requirements
  import MandatoryRequirements from "../views/mtes/mandatoryReq.vue";

  // MTES Fax Sheets
  import Factsheet from "../views/mtes/factsheet.vue";

// Components (modals, charts, etc.)
import demo from "../components/MTES/modals/uploaad.vue";
import pie from "../components/MTES/charts/Pie.vue";

//asViewer
import asViewer_landing_page from "../views/asViewer/asViewer_landing_page.vue";  
import asViewer_dashboard from "../views/asViewer/v-dashboard.vue";  
import asViewer_newapplication from "../views/asViewer/v-new-application.vue";

import asViewer_amtrd from "../views/asViewer/dashboards/v-AMTRD-dashboard.vue";
import asViewer_ftta from "../views/asViewer/dashboards/v-FTAA-dashboard.vue";
import asViewer_ep from "../views/asViewer/dashboards/v-EP-dashboard.vue";
import asViewer_mpsa from "../views/asViewer/dashboards/v-MPSA-dashboard.vue";
import asViewer_isag from "../views/asViewer/dashboards/v-ISAG-dashboard.vue";
import asViewer_mb from "../views/asViewer/dashboards/v-MB-dashboard.vue";
import asViewer_mpl from "../views/asViewer/dashboards/v-MPL-dashboard.vue";
import asViewer_mpp from "../views/asViewer/dashboards/v-MPP-dashboard.vue";
import asViewer_otp from "../views/asViewer/dashboards/v-OTP-dashboard.vue";
import asViewer_ssmc from "../views/asViewer/dashboards/v-SSMC-dashboard.vue";
import asViewer_moep from "../views/asViewer/dashboards/v-MOEP-dashboard.vue";

//asChief
import asChief_landing_page from "../views/asChief/asChief_landing_page.vue";  
import asChief_dashboard from "../views/asChief/dashboard.vue";  
import asChief_newapplication from "../views/asChief/new-application.vue";
import asChief_amtrd from "../views/asChief/dashboards/v-AMTRD-dashboard.vue";
import asChief_ftta from "../views/asChief/dashboards/v-FTAA-dashboard.vue";
import asChief_ep from "../views/asChief/dashboards/v-EP-dashboard.vue";
import asChief_mpsa from "../views/asChief/dashboards/v-MPSA-dashboard.vue";
import asChief_isag from "../views/asChief/dashboards/v-ISAG-dashboard.vue";
import asChief_mb from "../views/asChief/dashboards/v-MB-dashboard.vue";
import asChief_mpl from "../views/asChief/dashboards/v-MPL-dashboard.vue";
import asChief_mpp from "../views/asChief/dashboards/v-MPP-dashboard.vue";
import asChief_otp from "../views/asChief/dashboards/v-OTP-dashboard.vue";
import asChief_ssmc from "../views/asChief/dashboards/v-SSMC-dashboard.vue";
import asChief_moep from "../views/asChief/dashboards/v-MOEP-dashboard.vue";

// Mock function to check if user is authenticated
function isAuthenticated() {
  return !!localStorage.getItem('authToken'); // You can customize this auth method as needed
}

// Define route configurations
const routes = [
  { path: "/", component: login },
  { path: "/demo_upload", component: demo },
  { path: "/pie", component: pie },

  //Login Page
  { path: "/login", component: login },
  
  // MTSS routes
  { path: "/mmd/mtss", component: dashboard, meta: { requiresAuth: true }},
  { path: "/mtss/ostc", component: ostc, meta: { requiresAuth: true } },
  { path: "/mtss/inventory", component: inventory, meta: { requiresAuth: true } },
  { path: "/mtss/wpm", component: wpm, meta: { requiresAuth: true } },
  { path: "/mtss/mbm", component: mbm, meta: { requiresAuth: true } },
  { path: "/mtss/investigation", component: investigation, meta: { requiresAuth: true } },
  { path: "/mtss/anti-illegal", component: antiillegal, meta: { requiresAuth: true } },
  { path: "/mtss/dmpf", component: dmpf, meta: { requiresAuth: true } },
  { path: "/mtss/pcmrb", component: pcmrb, meta: { requiresAuth: true } },
  { path: "/mtss/mpsa", component: mpsa, meta: { requiresAuth: true } },
  { path: "/mtss/isag", component: isag, meta: { requiresAuth: true } },
  { path: "/mtss/ep", component: ep, meta: { requiresAuth: true } },
  { path: "/mtss/mpp", component: mpp, meta: { requiresAuth: true } },

  // MLSS routes
  { path: "/mmd/mlss", component: mlssdashboard, meta: { requiresAuth: true } },
  { path: "/mlss/CSAG", component: CSAG, meta: { requiresAuth: true } },
  { path: "/mlss/ISAG", component: ISAG, meta: { requiresAuth: true } },
  { path: "/mlss/MQUARRY", component: MQUARRY, meta: { requiresAuth: true } },
  { path: "/mlss/MTM", component: MiningTenementMaps, meta: { requiresAuth: true } },
  { path: "/mlss/MOEPV", component: MineralOreExportPermit, meta: { requiresAuth: true } },
  { path: "/mlss/pdf-content", component: PDFcontent, meta: { requiresAuth: true } },

  // MTES routes
  { path: "/mtes", component: firstpage, meta: { requiresAuth: true } },
  { path: "/new-application", component: applicationpage, meta: { requiresAuth: true } },
  { path: "/permit", component: permitpage, meta: { requiresAuth: true } },
  { path: "/ftta", component: fttadashboard, meta: { requiresAuth: true } },
  { path: "/ep", component: epdashboard, meta: { requiresAuth: true } },
  { path: "/mpsa", component: mpsadashboard, meta: { requiresAuth: true } },
  { path: "/isag", component: isagdashboard, meta: { requiresAuth: true } },
  { path: "/mb", component: mbdashboard, meta: { requiresAuth: true } },
  { path: "/mpl", component: mpldashboard, meta: { requiresAuth: true } },
  { path: "/mpp", component: mppdashboard, meta: { requiresAuth: true } },
  { path: "/otp", component: otpdashboard, meta: { requiresAuth: true } },
  { path: "/ssmc", component: ssmcdashboard, meta: { requiresAuth: true } },
  { path: "/amtrd", component: amtrddashboard, meta: { requiresAuth: true } },
  { path: "/moep", component: moepddashboard, meta: { requiresAuth: true } },
  { path: "/factsheet", component: Factsheet, meta: { requiresAuth: true } },
  { path: "/MandatoryRequirements/:detail_id", component: MandatoryRequirements },
{ path: "/Renewal/:detail_id", component: renewalpage },
  //MTES_asViewer
  { path: "/asViewer", component: asViewer_landing_page, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes", component: asViewer_dashboard, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application", component: asViewer_newapplication, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/amtrd", component: asViewer_amtrd, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/ftta", component: asViewer_ftta, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/ep", component: asViewer_ep, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/mpsa", component: asViewer_mpsa, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/isag", component: asViewer_isag, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/mb", component: asViewer_mb, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/mpl", component: asViewer_mpl, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/mpp", component: asViewer_mpp, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/otp", component: asViewer_otp, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/ssmc", component: asViewer_ssmc, meta: { requiresAuth: true } },
  { path: "/asViewer/mtes/new-application/moep", component: asViewer_moep, meta: { requiresAuth: true } },
   //MTES_asChief
   { path: "/mmd", component: asChief_landing_page, meta: { requiresAuth: true } },
   { path: "/mmd/mtes", component: asChief_dashboard, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application", component: asChief_newapplication, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/amtrd", component: asChief_amtrd, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/ftta", component: asChief_ftta, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/ep", component: asChief_ep, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/mpsa", component: asChief_mpsa, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/isag", component: asChief_isag, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/mb", component: asChief_mb, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/mpl", component: asChief_mpl, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/mpp", component: asChief_mpp, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/otp", component: asChief_otp, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/ssmc", component: asChief_ssmc, meta: { requiresAuth: true } },
   { path: "/mmd/mtes/new-application/moep", component: asChief_moep, meta: { requiresAuth: true } },
   { path: "/mmd/MandatoryRequirements/:detail_id", component: MandatoryRequirements },
{ path: "/mmd/Renewal/:detail_id", component: renewalpage },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    console.log("Navigating to:", to.path);
    // Clear auth token when navigating to login or root to force re-authentication
    if (to.path === '/login' || to.path === '/') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated()) {
        console.log("Not authenticated. Redirecting to login.");
        next('/login'); // Redirect to login if not authenticated
      } else {
        console.log("Authenticated. Proceeding to:", to.path);
        next(); // Proceed to the route
      }
    } else {
      next(); // Proceed to the route
    }
  });

export default router;