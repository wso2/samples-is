## Purpose
This siddhi-execution-geovelocity extension is an IS Analytics solution for Geo-velocity based adaptive authentication. This extension adds two functions which are "restrictedareabasedrisk" and "loginbehaviourbasedrisk". This adds siddhi file called "IS_ANALYTICS_GEOVELOCITY" which is capable of authenticating the user based on geovelocity.

## Goals
The function of "restrictedareabasedrisk" is capable of getting the risk value of the user's login based on the restricted location combinations. Such as Location A to Location B is marked as restricted location combination,  and user's current login attempt is from Location B and the previous login is from Location A, then this function gives the risk value of that login.

The function of "loginbehaviourbasedrisk" is to get the risk value of the user's login based on the user 's login behaviour by considering the location of login and the history of login time on that login location. 

Added siddhi file of "IS_ANALYTICS_GEOVELOCITY" is capable of calculating the risk based on user's login geovelocity. 

## Documentation

Please find the additional information related to this feature.

This will return the risk score based on the restricted area combinations considering the previous login and the current login attempt
```
define stream GeovelocityStream(currentLoginCity string, previousLoginCity string, currentLoginCountry string, previousLoginCountry string);  
from GeovelocityStream 
select geo:restrictedareabasedrisk(currentLoginCity, previousLoginCity, currentLoginCountry, previousLoginCountry) as restrictedareabasedrisk 
insert into outputStream;
```
This will return the login behaviour based risk considering the location and the time of the login
```
define stream GeovelocityStream(username string, city string,currentlogintime string);
from GeovelocityStream
select geo:loginbehaviourrisk(username, city, currentlogintime) as loginbehaviourbasedrisk
insert into outputStream
```

## Related PRs
https://github.com/wso2-extensions/siddhi-execution-geo/pull/49
