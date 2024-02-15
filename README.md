PORT    SERVER NAME 
--------------------
9200 - api server
9201 - proxy sever
9202 - front end

## Core Services
api-server 
    - to create a deployment request
    - to get the status fo the build and deployement 

build-sever 
    - to clone the source
    - to build the source
    - to deploy the source
proxy-server
    - to redirect the request to the right static path 

autodeploy
    - is a ui to initiate the request 

## tools /  frameworks / libs
    - express for the server
    - redis for async communication between services
    - angular for front end app


## set mandatory enviroment variables
    - REDIS_URL   : in build-server and api-server
    - DEPLOY_PATH : in build-sever ( should be the public folder path of the proxy-server )

## How to run 
 api-server : ```npm start```

 build-sever : ```npm start```

 proxy-sever : ```npm start```

 autodeploy : ```npm start``` 