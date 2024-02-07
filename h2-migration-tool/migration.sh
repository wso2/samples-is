 #  Copyright (c) 2022 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 #
 #  WSO2 Inc. licenses this file to you under the Apache License,
 #  Version 2.0 (the "License"); you may not use this file except
 #  in compliance with the License.
 #  You may obtain a copy of the License at
 #
 #    http://www.apache.org/licenses/LICENSE-2.0
 #
 # Unless required by applicable law or agreed to in writing,
 # software distributed under the License is distributed on an
 # "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 # KIND, either express or implied.  See the License for the
 # specific language governing permissions and limitations
 # under the License.

echo
echo "Welcome to the H2 DB Migration Tool!"
echo
echo "Please select the h2 version you are migrating from:"
echo "h2-2.1.210 - (1)"
echo "h2-1.4.199 - (2)"
echo "h2-1.3.175 - (3)"
read old_h2_version_choice

case $old_h2_version_choice in
    1)
        old_h2_version="h2-2.1.210.jar"
        wget -c https://repo1.maven.org/maven2/com/h2database/h2/2.1.210/h2-2.1.210.jar || exit 1
        ;;
    2)
        old_h2_version="h2-1.4.199.jar"
        wget -c https://repo1.maven.org/maven2/com/h2database/h2/1.4.199/h2-1.4.199.jar || exit 1
        ;;
    3)
        old_h2_version="h2-1.3.175.jar"
        wget -c https://repo1.maven.org/maven2/com/h2database/h2/1.3.175/h2-1.3.175.jar || exit 1
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo
echo "Please select the h2 version you are migrating to:"
echo "h2-2.2.224 - (1)"
echo "h2-2.1.210 - (2)"
read new_h2_version_choice

case $new_h2_version_choice in
    1)
        new_h2_version="h2-2.2.224.jar"
        wget -c https://repo1.maven.org/maven2/com/h2database/h2/2.2.224/h2-2.2.224.jar || exit 1
        ;;
    2)
        new_h2_version="h2-2.1.210.jar"
        wget -c https://repo1.maven.org/maven2/com/h2database/h2/2.1.210/h2-2.1.210.jar || exit 1
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "Provide a directory path for the old db files and a directory path to store the new files."
echo
echo "Enter the path to the previous database files: eg. <file-path>/old-databases, <OLD_IS_HOME>/repository/database "
read src_dir
echo
echo "Enter the path to store the newly created files: eg. <file-path>/new-databases "
read dest_dir

db_files=("$src_dir"/*.mv.db "$src_dir"/*.h2.db)
for filepath in "${db_files[@]}"; do
    if [[ "$filepath" == "$src_dir/*.mv.db" || "$filepath" == "$src_dir/*.h2.db" ]]; then
        # Skip files that don't actually match any existing files (from the wildcards in db_files)
        continue
    fi

    if [[ "$filepath" == *".mv.db" ]]; then
        dbname=$(basename "$filepath" .mv.db)
    elif [[ "$filepath" == *".h2.db" ]]; then
        dbname=$(basename "$filepath" .h2.db)
    else
        continue
    fi

    # Export data from old db file to backup.zip
    echo "Exporting database..."
    java -cp $old_h2_version org.h2.tools.Script -url "jdbc:h2:$src_dir/$dbname" -user wso2carbon -password wso2carbon -script backup.zip -options compression zip || exit 1
    rm -f $dest_dir/$dbname.mv.db

    # Import data from the backup.zip to the new db file
    echo "Importing data..."
        java -cp $new_h2_version org.h2.tools.RunScript -url "jdbc:h2:$dest_dir/$dbname" -user wso2carbon -password wso2carbon -script ./backup.zip -options compression zip FROM_1X || exit 1
    rm -f backup.zip

    echo "$dbname migrated successfully"
done

rm -f $new_h2_version
rm -f $old_h2_version

echo
echo "Database files are created at $dest_dir."
echo
echo "You can copy these files and replace the files inside the <IS-HOME>/repository/database folder."
echo
