# Application Modal Fixes Progress

## Completed ✅
1. ftta-newapplication.vue ✅
2. ep-newapplication.vue ✅
3. amtrd-newapplication.vue ✅

## Remaining
4. isag-newapplication.vue
5. mb-newapplication.vue
6. moep-newapplication.vue
7. mpl-newapplication.vue
8. mpp-newapplication.vue
9. mpsa-newapplication.vue
10. otp-newapplication.vue
11. ssmc-newapplication.vue

## Fixes Applied to Each File:
1. Remove v-model from province, city, barangay dropdowns (first location)
2. Update handleProvince() to use conditional logic for index 0
3. Update handleCity() to use conditional logic for index 0
4. Update handleBarangay() to use conditional logic for index 0
5. Add authorized_rep validation
6. Add email format validation
7. Fix null handling in submit() for optional fields
