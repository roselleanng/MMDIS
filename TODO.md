# MMDIS Factsheet Chronology Pagination Fix

## TODO Steps:
- [x] Step 1: Adjust `firstChronologyChunk` maxWeight to 12-15 for safe page 1 fit.
- [x] Step 2: Add print CSS rules (@media print) for page-break-inside: avoid on table/tbody/tr.
- [x] Step 3: Add max-height class to page 1 chronology table (reserve footer space).
- [x] Step 4: Wrap page 1 chronology table in break-avoid div.
- [x] Step 5: Recalibrate estimateChronologyWeight for accuracy (consider wrap/85 chars).
- [x] Step 6: Test PDF generation with long chronology data.
- [x] Step 7: Verify page breaks and mark complete.

## COMPLETED

All steps implemented:
- Reduced page 1 chronology to safe weight (12).
- Added CSS class, max-height:140mm, break-inside-avoid.
- Print media query prevents row breaks, protects footer.

**Test:** Load factsheet with long chronology, download PDF - page 1 table fits above footer, excess on page 2+.

Fix complete.

