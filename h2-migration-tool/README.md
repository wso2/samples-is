Applies To       : IS - 5.11.0


DESCRIPTION
--------------------
This migration tool can be used to migrate H2 database files from H2 1.4.199 version to 2.1.210 version.


PREREQUISITES
----------------------
For Mac OS:

Install wget using `brew install wget`.


INSTRUCTIONS
-----------------------
1. Download the `migration.sh` script.

2. Run the migration script using `bash migration.sh`.

3. Provide the paths to the older db files and to the directory to store the newly created db files.

   1. Provide the path to the directory where the db files that need to be migrated are located.
   The older database files are available by default at the backup IS pack inside the `.wso2-updates` directory. The exact location of your backup IS is available at the product.backup field of <IS-HOME>/updates/config.json file inside your updated IS pack.
   
      Eg. /User/.wso2-updates/backup/wso2is-5.11.0-30de1a18-f60f-4bb7-8832-c84d7f244d85/repository/database
   
   2. Provide the path to a directory where the new db files will be created and stored
   
      Eg. < path>/new-databases
   
5. Copy the database files from the created location and replace the files inside the <IS-HOME>/repository/database directory.
