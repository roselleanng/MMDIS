import re
import os

# List of files to fix
files_to_fix = [
    'src/components/MTES/modals/add/isag-newapplication.vue',
    'src/components/MTES/modals/add/mb-newapplication.vue',
    'src/components/MTES/modals/add/moep-newapplication.vue',
    'src/components/MTES/modals/add/mpl-newapplication.vue',
    'src/components/MTES/modals/add/mpp-newapplication.vue',
    'src/components/MTES/modals/add/mpsa-newapplication.vue',
    'src/components/MTES/modals/add/otp-newapplication.vue',
    'src/components/MTES/modals/add/ssmc-newapplication.vue',
]

def apply_fixes(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Remove v-model from province, city, barangay dropdowns
    content = re.sub(
        r'<select v-model="detailstoadd\.province" @change="handleProvince\(0, \$event\)"',
        r'<select @change="handleProvince(0, $event)"',
        content
    )
    content = re.sub(
        r'<select v-model="detailstoadd\.city" @change="handleCity\(0, \$event\)"',
        r'<select @change="handleCity(0, $event)"',
        content
    )
    content = re.sub(
        r'<select v-model="detailstoadd\.barangay" @change="handleBarangay\(0, \$event\)"',
        r'<select @change="handleBarangay(0, $event)"',
        content
    )
    
    # Fix 2: Update handleProvince method
    old_handle_province = r'''    handleProvince\(index, event\) \{
      const selectedProvince = event\.target\.selectedOptions\[0\]\.text; // Get the province name
      this\.detailstoadd\[`province\$\{index > 0 \? index - 0 : ''\}`\] = selectedProvince; // Store name

      cities\(event\.target\.value\)\.then\(response => \{
        this\.locations\[index\]\.cities = response;
        this\.locations\[index\]\.barangays = \[\];
      \}\);
    \},'''
    
    new_handle_province = '''    handleProvince(index, event) {
      const selectedProvince = event.target.selectedOptions[0].text; // Get the province name
      
      if (index === 0) {
        this.detailstoadd.province = selectedProvince; // Store directly for first location
      } else {
        this.detailstoadd[`province${index}`] = selectedProvince; // Store with index for additional locations
      }

      cities(event.target.value).then(response => {
        this.locations[index].cities = response;
        this.locations[index].barangays = [];
      });
    },'''
    
    content = re.sub(old_handle_province, new_handle_province, content)
    
    # Fix 3: Update handleCity method
    old_handle_city = r'''    handleCity\(index, event\) \{
      const selectedCity = event\.target\.selectedOptions\[0\]\.text; // Get the city name
      this\.detailstoadd\[`city\$\{index > 0 \?  index - 0 : ''\}`\] = selectedCity; // Store name
      barangays\(event\.target\.value\)\.then\(response => \{
        this\.locations\[index\]\.barangays = response;
      \}\);
    \},'''
    
    new_handle_city = '''    handleCity(index, event) {
      const selectedCity = event.target.selectedOptions[0].text; // Get the city name
      
      if (index === 0) {
        this.detailstoadd.city = selectedCity; // Store directly for first location
      } else {
        this.detailstoadd[`city${index}`] = selectedCity; // Store with index for additional locations
      }
      
      barangays(event.target.value).then(response => {
        this.locations[index].barangays = response;
      });
    },'''
    
    content = re.sub(old_handle_city, new_handle_city, content)
    
    # Fix 4: Update handleBarangay method
    old_handle_barangay = r'''    handleBarangay\(index, event\) \{
      const selectedBarangay = event\.target\.selectedOptions\[0\]\.text; // Get barangay name
      this\.detailstoadd\[`barangay\$\{index > 0 \?  index - 0 : '' \}`\] = selectedBarangay; // Store dynamically
      console\.log\(index\)
      console\.log\(selectedBarangay\)
    \},'''
    
    new_handle_barangay = '''    handleBarangay(index, event) {
      const selectedBarangay = event.target.selectedOptions[0].text; // Get barangay name
      
      if (index === 0) {
        this.detailstoadd.barangay = selectedBarangay; // Store directly for first location
      } else {
        this.detailstoadd[`barangay${index}`] = selectedBarangay; // Store with index for additional locations
      }
      
      console.log(index)
      console.log(selectedBarangay)
    },'''
    
    content = re.sub(old_handle_barangay, new_handle_barangay, content)
    
    # Fix 5: Add authorized_rep validation
    old_validation = r'''      if \(!this\.selectedCategory\) \{
        missingFields\.push\('Category'\);
      \} else if \(this\.selectedCategory === 'Other' && !this\.otherCategory\.trim\(\)\) \{
        missingFields\.push\('Other Category'\);
      \}

      if \(!this\.contactnum \|\| this\.contactnum\.length !== 11\) \{
        missingFields\.push\('Valid Contact Number \(11 digits\)'\);
      \}

      if \(!this\.detailstoadd\.email\.trim\(\)\) \{
        missingFields\.push\('Email Address'\);
      \}'''
    
    new_validation = '''      if (!this.selectedCategory) {
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.detailstoadd.email)) {
          missingFields.push('Valid Email Address (e.g., user@example.com)');
        }
      }'''
    
    content = re.sub(old_validation, new_validation, content, flags=re.DOTALL)
    
    # Fix 6: Update submit method
    old_submit_start = r'''    submit\(\) \{
        if \(!this\.validateForm\(\)\) \{
            return;
        \}

        const formData = new FormData\(\);

        for \(const \[key, value\] of Object\.entries\(this\.detailstoadd\)\) \{
            formData\.append\(key, value\);
        \}'''
    
    new_submit_start = '''    submit() {
        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData();

        // Append all fields, converting empty strings to null for optional fields
        for (const [key, value] of Object.entries(this.detailstoadd)) {
            // For optional fields, send null instead of empty string
            if (key === 'others' || key === 'oth_rs' || key === 'tenement_number') {
                formData.append(key, value.trim() || null);
            } else {
                formData.append(key, value);
            }
        }'''
    
    content = re.sub(old_submit_start, new_submit_start, content)
    
    # Fix 7: Update additional locations handling
    old_locations_loop = r'''        this\.visibleLocations\.forEach\(\(_, index\) => \{
            formData\.append\(`barangay\$\{index \+ 1\}`, this\.detailstoadd\[`barangay\$\{index \+ 1\}`\]\);
            formData\.append\(`city\$\{index \+ 1\}`, this\.detailstoadd\[`city\$\{index \+ 1\}`\]\);
            formData\.append\(`province\$\{index \+ 1\}`, this\.detailstoadd\[`province\$\{index \+ 1\}`\]\);
            formData\.append\(`area_hectares\$\{index \+ 1\}`, this\.detailstoadd\[`area_hectares\$\{index \+ 1\}`\]\);
        \}\);'''
    
    new_locations_loop = '''        // Append additional locations data, converting empty/undefined to null
        this.visibleLocations.forEach((_, index) => {
            formData.append(`barangay${index + 1}`, this.detailstoadd[`barangay${index + 1}`] || null);
            formData.append(`city${index + 1}`, this.detailstoadd[`city${index + 1}`] || null);
            formData.append(`province${index + 1}`, this.detailstoadd[`province${index + 1}`] || null);
            formData.append(`area_hectares${index + 1}`, this.detailstoadd[`area_hectares${index + 1}`] || null);
        });'''
    
    content = re.sub(old_locations_loop, new_locations_loop, content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed: {filepath}")

# Apply fixes to all files
for filepath in files_to_fix:
    if os.path.exists(filepath):
        try:
            apply_fixes(filepath)
        except Exception as e:
            print(f"❌ Error fixing {filepath}: {e}")
    else:
        print(f"⚠️  File not found: {filepath}")

print("\n✅ All fixes applied successfully!")
