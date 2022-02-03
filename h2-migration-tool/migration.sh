echo
echo "Welcome to the H2 DB Migration Tool!"
echo
echo "Provide a directory path for the old db files and a directory path to store the new files."
echo
echo "Enter the path to the previous database files: eg. <file-path>/old-databases "
read src_dir
echo
echo "Enter the path to store the newly created files: eg. <file-path>/new-databases "
read dest_dir

wget https://repo1.maven.org/maven2/com/h2database/h2/2.1.210/h2-2.1.210.jar
wget https://repo1.maven.org/maven2/com/h2database/h2/1.4.199/h2-1.4.199.jar

for filepath in $src_dir/*.mv.db; do
    dbname=$(basename "$filepath" .mv.db)

    # Export data from old db file to backup.zip
    echo "Exporting database..."
    java -cp h2-1.4.199.jar org.h2.tools.Script -url jdbc:h2:$src_dir/$dbname -user wso2carbon -password wso2carbon -script backup.zip -options compression zip
    rm -f $dest_dir/$dbname.mv.db

    # Import data from the backup.zip to the new db file
    echo "Importing data..."
    java -cp h2-2.1.210.jar org.h2.tools.RunScript -url jdbc:h2:$dest_dir/$dbname -user wso2carbon -password wso2carbon -script ./backup.zip -options compression zip
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