function test(){
    var str = "# timestamp: Thu Dec 07 2017 23:38:35 GMT+0900 (JST)\n" +
        "\n" +
        "type Query {\n" +
        "  user(id: String): User\n" +
        "  userA: User\n" +
        "  userB(\n" +
        "    id: String\n" +
        "\n" +
        "#######\n" +
        "    company: String\n"+
        "  ): User\n" +
        "}\n" +
        "\n" +
        "type User {\n" +
        "  id: String\n" +
        "  name: [Name]\n" +
        "}\n" +
        "type Name {\n" +
        "  text: String\n" +
        "}";

    var strArr = makeArr(str);
    var schema = {};
    var responseJson = {};
    var requestRegex = /^type Query {/;
    var endRegex = /^}/;
    var apiNameRegex = /^([^]+)\(/;
    var apiRequestRegex = /\(([^)]+)\)/;
    var moduleNameRegex = /^type ([^]+) {/;
    var responseNameRegex = /\):([^]+)$/;
    var subModuleNameRegex = /\[([^)]+)\]/;
    for(var i = 0; i < strArr.length; i++){
        var val = strArr[i];
          if(requestRegex.exec(val) !== null){
              i++;
              val = strArr[i];
              while(endRegex.exec(val) === null){
                  val = val.trim();
                  var apiName = "";
                  var apiRequest = "";
                  var json = {};
                  if(apiNameRegex.exec(val) !== null){
                    var matches = apiNameRegex.exec(val);
                    apiName = matches[1];
                    while(responseNameRegex.exec(val) === null){
                      i++;
                      val = val.concat(strArr[i].trim());
                      if(strArr[i].includes(':') && !strArr[i].includes(")")){
                        val = val.concat(',');
                      }
                    }
                    if(apiRequestRegex.exec(val) !== null){
                      matches = apiRequestRegex.exec(val);
                      var apiRequest = makeJson(matches[1]);
                    }
                    matches = responseNameRegex.exec(val);
                    json.response = matches[1].trim();
                  }
                  else {
                    var arr = val.split(':');
                    apiName = arr[0];
                    apiRequest = "";
                    json.response = arr[1].trim();;
                  }

                  json.request = apiRequest;
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
    for (var key in responseJson) {
      if (responseJson.hasOwnProperty(key)){
        var moduleName = responseJson[key];
        for(var prop in moduleName){
          var value = moduleName[prop];
          if(subModuleNameRegex.exec(value) !== null){
              matches = subModuleNameRegex.exec(value);
              if(responseJson.hasOwnProperty(matches[1])){
                responseJson[key][prop] = responseJson[matches[1]];
              }
          }
        }
      }
    }
    for (var key in schema) {
      if (schema.hasOwnProperty(key)) {
          schema[key].response = responseJson[schema[key].response];
      }
    }
    return schema;
}

function makeJson(jsonStr){
    var jsonArr = jsonStr.split(',');
    var request = {};
    for(var i in jsonArr){
      if(jsonArr[i] !== ""){
        var arr = jsonArr[i].split(':');
        request[arr[0]] = arr[1].trim();
      }
    }
    return request;
}

function makeArr(str){
  var arr = str.split("\n");
  var commentRegex = /^#/;
  var newArr = [];
  for(var i = 0; i < arr.length; i++){
    var val = arr[i];
    while((commentRegex.exec(val) !== null) || (val === "")){
      i++;
      val = arr[i];
    }
    newArr.push(val);
  }
  return newArr;
}
