
  var data = ["a.x", "b.c", "b.d", "b.f.g", "b.h", "i.j", "k.h.l", "m.n"];

  var prevItem = "";
  var query = "";

  var formatData = function(data){
      query = query.concat("{\n");
      for(var i in data){
        query = inclusive(data[i]);
      }
      if(prevItem.includes(".")){
        var lvNum = (prevItem.match(/\./g) || []).length;
        closeMultipleBrackets(0, lvNum + 1);
      }
      query = query.concat("}");
      alert(query);
  }

  var inclusive = function(item){
      if(item.includes(".")){
        var currElems = item.split('.');
        if(prevItem.includes(".")){
          var prevElems = prevItem.split('.');
            for(var i in prevElems){
              if(prevElems[i] != currElems[i]){
                closeMultipleBrackets(parseInt(i), prevElems.length);
                for(var j = i; j < currElems.length; j++){
                  computeSpace(parseInt(j) + 1);
                  query = query.concat(currElems[j]);
                  if(j < currElems.length - 1){
                      query = query.concat("{");
                  }
                  query = query.concat("\n");
                }
                break;
              }
            }
          }
        else{
          for(var i in currElems){
            computeSpace(parseInt(i) + 1);
            query = query.concat(currElems[i]);
            if(i < currElems.length -1){
                query = query.concat("{");
            }
            query = query.concat("\n");
          }
        }
      }else{
          if(prevItem.includes(".")){
            var lvNum = (prevItem.match(/\./g) || []).length;
            closeMultipleBrackets(0, lvNum + 1);
          }
          query = query.concat("     ").concat(item).concat("\n");
        }
        prevItem = item;
        return query;
  }
  var closeMultipleBrackets = function(index, length){
    var spaceNum = 0;
    while(index  < length - 1){
      spaceNum = length - 1;
      computeCloseBracket(spaceNum);
      length--;
    }
  }
  var computeSpace = function(spaceNum){
    while(spaceNum > 0){
      query = query.concat("     ");
      spaceNum--;
    }
  }
  var computeCloseBracket = function(spaceNum){
    computeSpace(spaceNum);
    query = query.concat("}\n");
  }
