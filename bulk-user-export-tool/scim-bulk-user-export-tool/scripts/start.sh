#!/usr/bin/env bash

read -p "Enter host address of WSO2 IS (Required) [https://localhost:9443] : " host
[ -z "$host" ] && { host="https://localhost:9443"; }
read -p "Enter username (Required) : " username
[ -z "$username" ] && { echo "Error: username can't be empty!"; exit 1; }
stty -echo
read -p "Enter password (Required) : " password
[ -z "$password" ] && { password=none; }
stty echo
echo
read -p "CSV file location (Optional) (ex: path/to/users.csv): " csv
[ -z "$csv" ] && { csv=none; }
read -p "Attributes to filter (Optional) (ex: id,username,emails) : " attributes
[ -z "$attributes" ] && { attributes=none; }
read -p "Attributes to exclude (Optional) (ex:groups,emails,name.givenName) : " excludedAttributes
[ -z "$excludedAttributes" ] && { excludedAttributes=none; }
read -p "Userstore domain to filteer (Optional) (ex:PRIMARY) : " userstoreDomain
[ -z "$userstoreDomain" ] && { userstoreDomain=none; }
read -p "Start Index (Optional) [1]: " startIndex
[ -z "$startIndex" ] && { startIndex=none; }
read -p "Batch Count (Optional) [100]: " batchCount
[ -z "$batchCount" ] && { batchCount=none; }
read -p "Maximum Count (Optional) [-1]: " maxCount
[ -z "$maxCount" ] && { maxCount=none; }

java -jar $(find . -name "*scim.bulk.user.export.tool*") $host $username $password $csv $attributes $excludedAttributes $userstoreDomain $startIndex $batchCount $maxCount
