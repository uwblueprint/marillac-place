#!/bin/bash
# Generate ESLint warnings and errors breakdown by rule with files listed under each rule
# Output saved to: eslint-warnings-by-rule-frontend.txt and eslint-warnings-by-rule-backend.txt

# Function to process ESLint output and generate breakdown
generate_breakdown() {
  local dir=$1
  local output_file=$2
  local extensions=$3

  echo "Processing ${dir}..."
  
  cd "${dir}" || exit 1

  npx eslint . --ext "${extensions}" --format=json | \
    jq -r '.[] | 
      select(.messages | length > 0) | 
      .filePath as $file | 
      .messages[] | 
      "\(.ruleId)|\($file)"' | \
    sort | \
    awk -F'|' '
      BEGIN {
        prev=""
        prev_file=""
        file_count=0
        total=0
      }
      {
        if ($1 != prev) {
          if (prev != "") {
            print "  (" total " issues in " file_count " files)\n"
          }
          print $1 ":"
          prev=$1
          prev_file=""
          file_count=0
          total=0
        }
        if ($2 != prev_file) {
          print "  " $2
          prev_file=$2
          file_count++
        }
        total++
      }
      END {
        if (prev != "") {
          print "  (" total " issues in " file_count " files)"
        }
      }' > "${output_file}"

  cd .. || exit 1
}

# Process frontend
generate_breakdown "frontend" "../eslint-warnings-by-rule-frontend.txt" ".ts,.tsx"

# Process backend
generate_breakdown "backend" "../eslint-warnings-by-rule-backend.txt" ".ts"

echo ""
echo "✅ ESLint breakdowns generated:"
echo "   - eslint-warnings-by-rule-frontend.txt"
echo "   - eslint-warnings-by-rule-backend.txt"
