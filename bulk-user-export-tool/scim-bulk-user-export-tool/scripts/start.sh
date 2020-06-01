#!/usr/bin/env bash

read -p "Enter host address of WSO2 IS (Required) (ex: https://localhost/9443) : " host
[ -z "$host" ] && { echo "Error: Host address can't be empty!"; exit 1; }
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
read -p "Attributes to exclude (Optional) (ex:groups, name_givenName) : " excludedAttributes
[ -z "$excludedAttributes" ] && { excludedAttributes=none; }

java -jar $(find . -name "*scim.bulk.user.export.tool*") $host $username $password $csv $attributes $excludedAttributes
