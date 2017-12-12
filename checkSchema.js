var checkSchema = function(json){
  var response = json.user.response;
  console.log(replaceCheck(response));
}

var replaceCheck = function(json){
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
        switch(json[key]){
          case "String":
            json[key] = '#string';
            break;
          case "Int":
            json[key] = '#number';
            break;
          default:
            replaceCheck(json[key]);
            break;
        }
     }
   }
   return json;
}
