#!/bin/sh

BASEDIR=$(dirname "$0")
cd $BASEDIR
RESULT_CSV_FILE_PREFIX=".result."
REF_CSV="900000rows.csv"
REF_LINES=$(cat ${REF_CSV} | wc -l)
LIB_FILES="a-csv.js
csv-stream.js
csv-streamer.js
csv-string.js
fast-csv.js
nodecsv.js"

yarn

for jsFile in ${LIB_FILES}; do
  resultCsvFile="${RESULT_CSV_FILE_PREFIX}${jsFile%.*}.csv"

  duration=$({ /usr/bin/time -f "%U" node ${jsFile} >${resultCsvFile}; } 2>&1)

  difference=$(diff ${REF_CSV} ${resultCsvFile} | wc -l)

  echo "${jsFile%.*} | ${duration}s | ${difference}/${REF_LINES}"
done
