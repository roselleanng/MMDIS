const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
    'src/components/MTES/modals/add/isag-newapplication.vue',
    'src/components/MTES/modals/add/mb-newapplication.vue',
    'src/components/MTES/modals/add/moep-newapplication.vue',
    'src/components/MTES/modals/add/mpl-newapplication.vue',
    'src/components/MTES/modals/add/mpp-newapplication.vue',
    'src/components/MTES/modals/add/mpsa-newapplication.vue',
    'src/components/MTES/modals/add/otp-newapplication.vue',
    'src/components/MTES/modals/add/ssmc-newapplication.vue',
];

function applyFixes(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Fix 1: Remove v-model from province dropdown
    content = content.replace(
        /<select v-model="detailstoadd\.province" @change="handleProvince\(0, \$event\)"/g,
        '<select @change="handleProvince(0, $event)"'
    );
    
    // Fix 2: Remove v-model from city dropdown
    content = content.replace(
        /<select v-model="detailstoadd\.city" @change="handleCity\(0, \$event\)"/g,
        '<select @change="handleCity(0, $event)"'
    );
    
    // Fix 3: Remove v-model from barangay dropdown
    content = content.replace(
        /<select v-model="detailstoadd\.barangay" @change="handleBarangay\(0, \$event\)"/g,
        '<select @change="handleBarangay(0, $event)"'
    );
    
    // Fix 4: Update handleProvince method
    content = content.replace(
        /handleProvince\(index, event\) \{\n      const selectedProvince = event\.target\.selectedOptions\[0\]\.text; \/\/ Get the province name\n      this\.detailstoadd\[`province\$\{index > 0 \? index - 0 : ''\}`\] = selectedProvince; \/\/ Store name\n\n      cities\(event\.target\.value\)\.then\(response => \{\n        this\.locations\[index\]\.cities = response;\n        this\.locations\[index\]\.barangays = \[\];\n      \}\);\n    \},/,
        `handleProvince(index, event) {
      const selectedProvince = event.target.selectedOptions[0].text; // Get the province name
      
      if (index === 0) {
        this.detailstoadd.province = selectedProvince; // Store directly for first location
      } else {
        this.detailstoadd[\`province\${index}\`] = selectedProvince; // Store with index for additional locations
      }

      cities(event.target.value).then(response => {
        this.locations[index].cities = response;
        this.locations[index].barangays = [];
      });
    },`
    );
    
    // Fix 5: Update handleCity method
    content = content.replace(
        /handleCity\(index, event\) \{\n      const selectedCity = event\.target\.selectedOptions\[0\]\.text; \/\/ Get the city name\n      this\.detailstoadd\[`city\$\{index > 0 \?  index - 0 : ''\}`\] = selectedCity; \/\/ Store name\n      barangays\(event\.target\.value\)\.then\(response => \{\n        this\.locations\[index\]\.barangays = response;\n      \}\);\n    \},/,
        `handleCity(index, event) {
      const selectedCity = event.target.selectedOptions[0].text; // Get the city name
      
      if (index === 0) {
        this.detailstoadd.city = selectedCity; // Store directly for first location
      } else {
        this.detailstoadd[\`city\${index}\`] = selectedCity; // Store with index for additional locations
      }
      
      barangays(event.target.value).then(response => {
        this.locations[index].barangays = response;
      });
    },`
    );
    
    // Fix 6: Update handleBarangay method
    content = content.replace(
        /handleBarangay\(index, event\) \{\n      const selectedBarangay = event\.target\.selectedOptions\[0\]\.text; \/\/ Get barangay name\n      this\.detailstoadd\[`barangay\$\{index > 0 \?  index - 0 : '' \}`\] = selectedBarangay; \/\/ Store dynamically\n      console\.log\(index\)\n      console\.log\(selectedBarangay\)\n    \},/,
        `handleBarangay(index, event) {
      const selectedBarangay = event.target.selectedOptions[0].text; // Get barangay name
      
      if (index === 0) {
        this.detailstoadd.barangay = selectedBarangay; // Store directly for first location
      } else {
        this.detailstoadd[\`barangay\${index}\`] = selectedBarangay; // Store with index for additional locations
      }
      
      console.log(index)
      console.log(selectedBarangay)
    },`
    );
    
    // Fix 7: Add authorized_rep and email validation
    content = content.replace(
        /if \(!this\.selectedCategory\) \{\n        missingFields\.push\('Category'\);\n      \} else if \(this\.selectedCategory === 'Other' && !this\.otherCategory\.trim\(\)\) \{\n        missingFields\.push\('Other Category'\);\n      \}\n\n      if \(!this\.contactnum \|\| this\.contactnum\.length !== 11\) \{\n        missingFields\.push\('Valid Contact Number \(11 digits\)'\);\n      \}\n\n      if \(!this\.detailstoadd\.email\.trim\(\)\) \{\n        missingFields\.push\('Email Address'\);\n      \}/,
        `if (!this.selectedCategory) {
        missingFields.push('Category');
      } else if (this.selectedCategory === 'Other' && !this.otherCategory.trim()) {
        missingFields.push('Other Category');
      }

      if (!this.detailstoadd.authorized_rep.trim()) {
        missingFields.push('Authorized Representative');
      }

      if (!this.contactnum || this.contactnum.length !== 11) {
        missingFields.push('Valid Contact Number (11 digits)');
      }

      if (!this.detailstoadd.email.trim()) {
        missingFields.push('Email Address');
      } else {
        // Validate email format
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(this.detailstoadd.email)) {
          missingFields.push('Valid Email Address (e.g., user@example.com)');
        }
      }`
    );
    
    // Fix 8: Update submit method - FormData handling
    content = content.replace(
        /for \(const \[key, value\] of Object\.entries\(this\.detailstoadd\)\) \{\n            formData\.append\(key, value\);\n        \}/,
        `// Append all fields, converting empty strings to null for optional fields
        for (const [key, value] of Object.entries(this.detailstoadd)) {
            // For optional fields, send null instead of empty string
            if (key === 'others' || key === 'oth_rs' || key === 'tenement_number') {
                formData.append(key, value.trim() || null);
            } else {
                formData.append(key, value);
            }
        }`
    );
    
    // Fix 9: Update additional locations handling
    content = content.replace(
        /this\.visibleLocations\.forEach\(\(_, index\) => \{\n            formData\.append\(`barangay\$\{index \+ 1\}`, this\.detailstoadd\[`barangay\$\{index \+ 1\}`\]\);\n            formData\.append\(`city\$\{index \+ 1\}`, this\.detailstoadd\[`city\$\{index \+ 1\}`\]\);\n            formData\.append\(`province\$\{index \+ 1\}`, this\.detailstoadd\[`province\$\{index \+ 1\}`\]\);\n            formData\.append\(`area_hectares\$\{index \+ 1\}`, this\.detailstoadd\[`area_hectares\$\{index \+ 1\}`\]\);\n        \}\);/,
        `// Append additional locations data, converting empty/undefined to null
        this.visibleLocations.forEach((_, index) => {
            formData.append(\`barangay\${index + 1}\`, this.detailstoadd[\`barangay\${index + 1}\`] || null);
            formData.append(\`city\${index + 1}\`, this.detailstoadd[\`city\${index + 1}\`] || null);
            formData.append(\`province\${index + 1}\`, this.detailstoadd[\`province\${index + 1}\`] || null);
            formData.append(\`area_hectares\${index + 1}\`, this.detailstoadd[\`area_hectares\${index + 1}\`] || null);
        });`
    );
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Fixed: ${filepath}`);
}

// Apply fixes to all files
filesToFix.forEach(filepath => {
    if (fs.existsSync(filepath)) {
        try {
            applyFixes(filepath);
        } catch (error) {
            console.log(`❌ Error fixing ${filepath}:`, error.message);
        }
    } else {
        console.log(`⚠️  File not found: ${filepath}`);
    }
});

console.log('\n✅ All fixes applied successfully!');
