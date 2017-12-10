function test(){
    var str = "# timestamp: Thu Dec 07 2017 23:38:35 GMT+0900 (JST)\n" +
        "\n" +
        "type Query {\n" +
        "  user(id: String): User\n" +
        "}\n" +
        "\n" +
        "type User {\n" +
        "  id: String\n" +
        "  name: [Name]\n" +
        "}\n" +
        "type Name {\n" +
        "  text: String\n" +
        "}";

    var strArr = str.split("\n");
    var schema = {};
    var responseJson = {};
    var commentRegex = /^#/;
    var requestRegex = /^type Query {/;
    var endRegex = /^}/;
    var apiNameRegex = /^([^]+)\(/;
    var apiRequestRegex = /\(([^)]+)\)/;
    var moduleNameRegex = /^type ([^]+) {/;
    var responseNameRegex = /\):([^]+)$/;
    var subModuleNameRegex = /\[([^)]+)\]/;
    for(var i = 0; i < strArr.length; i++){
        var val = strArr[i];
        if((commentRegex.exec(val) === null) && val !== ""){
            if(requestRegex.exec(val) !== null){
                i++;
                val = strArr[i];
                while(endRegex.exec(val) === null){
                    val = val.trim();
                    var matches = apiNameRegex.exec(val);
                    var apiName = matches[1];
                    matches = apiRequestRegex.exec(val);
                    var apiRequest = makeJson(matches[1]);
                    var json = {};
                    json.request = apiRequest;
                    matches = responseNameRegex.exec(val);
                    json.response = matches[1].trim();
                    schema[apiName] = json;
                    i++;
                    val = strArr[i];
                }
            }
            else if(moduleNameRegex.exec(val) !== null){
                var matches = moduleNameRegex.exec(val);
                var moduleName = matches[1];
                i++;
                val = strArr[i];
                var json = {};
                while(endRegex.exec(val) === null){
                    val = val.trim();
                    var arr = val.split(':');
                    if(subModuleNameRegex.exec(arr[1]) !== null){
                        // matches = subModuleNameRegex.exec(arr[1]);
                        json[arr[0]] = arr[1].trim();
                    }
                    else{
                        json[arr[0]] = arr[1].trim();
                    }
                    i++;
                    val = strArr[i];
                }
                responseJson[moduleName] = json;
            }
        }
    }
    for (var key in responseJson) {
      if (responseJson.hasOwnProperty(key)){
        var moduleName = responseJson[key];
        for(var prop in moduleName){
          var value = moduleName[prop];
          if(subModuleNameRegex.exec(value) !== null){
              matches = subModuleNameRegex.exec(value);
              responseJson[key][prop] = responseJson[matches[1]];
          }
        }
      }
    }
    for (var key in schema) {
      if (schema.hasOwnProperty(key)) {
          schema[key].response = responseJson[schema[key].response];
      }
    }
    console.log(schema);
}

function makeJson(jsonStr){
    var jsonArr = jsonStr.split(',');
    var request = {};
    for(var i in jsonArr){
        var arr = jsonArr[i].split(':');
        request[arr[0]] = arr[1].trim();
    }
    return request;
}
