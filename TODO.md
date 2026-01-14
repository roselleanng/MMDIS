# Fix New Application Submission Bug

## Issue
The v-model bindings for the first location's province, city, and barangay selects are incorrect, using `detailstoadd[\`province${index}\`]` instead of `detailstoadd.province`. This causes the data not to be set properly, leading to submission failures.

## Files to Fix
- [x] src/components/MTES/modals/add/ep-newapplication.vue
- [x] src/components/MTES/modals/add/ftta-newapplication.vue
- [x] src/components/MTES/modals/add/isag-newapplication.vue
- [x] src/components/MTES/modals/add/mb-newapplication.vue
- [x] src/components/MTES/modals/add/amtrd-newapplication.vue
- [x] src/components/MTES/modals/add/moep-newapplication.vue
- [x] src/components/MTES/modals/add/mpp-newapplication.vue
- [ ] src/components/MTES/modals/add/mpl-newapplication.vue
- [ ] src/components/MTES/modals/add/otp-newapplication.vue
- [ ] src/components/MTES/modals/add/ssmc-newapplication.vue
- [ ] src/components/MTES/modals/add/mpsa-newapplication.vue

## Changes Needed
For each file, in the template for the first location (Location 1):
- Change `v-model="detailstoadd[\`province${index}\`]"` to `v-model="detailstoadd.province"`
- Change `v-model="detailstoadd[\`city${index}\`]"` to `v-model="detailstoadd.city"`
- Change `v-model="detailstoadd[\`barangay${index}\`]"` to `v-model="detailstoadd.barangay"`
