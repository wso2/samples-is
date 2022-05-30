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
echo "Provide a directory path for the old db files and a directory path to store the new files."
echo
echo "Enter the path to the previous database files: eg. <file-path>/old-databases, <OLD_IS_HOME>/repository/database "
read src_dir
echo
echo "Enter the path to store the newly created files: eg. <file-path>/new-databases "
read dest_dir

wget -c https://repo1.maven.org/maven2/com/h2database/h2/2.1.210/h2-2.1.210.jar || exit 1
wget -c https://repo1.maven.org/maven2/com/h2database/h2/1.4.199/h2-1.4.199.jar || exit 1

db_files=("$src_dir"/*.mv.db)
for filepath in "${db_files[@]}"; do
    dbname=$(basename "$filepath" .mv.db)

    # Export data from old db file to backup.zip
    echo "Exporting database..."
    java -cp h2-1.4.199.jar org.h2.tools.Script -url "jdbc:h2:$src_dir/$dbname" -user wso2carbon -password wso2carbon -script backup.zip -options compression zip || exit 1
    rm -f $dest_dir/$dbname.mv.db

    # Import data from the backup.zip to the new db file
    echo "Importing data..."
    java -cp h2-2.1.210.jar org.h2.tools.RunScript -url "jdbc:h2:$dest_dir/$dbname" -user wso2carbon -password wso2carbon -script ./backup.zip -options compression zip FROM_1X || exit 1
    rm -f backup.zip

    echo "$dbname migrated successfully"
done

rm -f h2-1.4.199.jar
rm -f h2-2.1.210.jar

echo
echo "Database files are created at $dest_dir."
echo
echo "You can copy these files and replace the files inside the <IS-HOME>/repository/database folder."
echo
