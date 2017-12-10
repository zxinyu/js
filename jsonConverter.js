function test(){
    var str = "# timestamp: Thu Dec 07 2017 23:38:35 GMT+0900 (JST)\n" +
        "\n" +
        "type Query {\n" +
        "  user(id: String): User\n" +
        "}\n" +
        "\n" +
        "type User {\n" +
        "  id: String\n" +
        "  name: String\n" +
        "}";

    var strArr = str.split("\n");
    var schema = {};
    var commentRegex = /^#/;
    var requestRegex = /^type Query {/;
    var endRegex = /^}/;
    var apiNameRegex = /^([^]+)\(/;
    var apiRequestRegex = /\(([^)]+)\)/;
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
                    schema[apiName] = {"request": apiRequest};
                    i++;
                    val = strArr[i];

                }

            }
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
