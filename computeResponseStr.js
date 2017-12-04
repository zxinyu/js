
  var data = ["a.x", "b.c", "b.d", "b.f.g", "b.f.k", "b.h", "k.h.l", "m.n"];

  var prevItem = "";
  var query = "";

  var formatData = function(data){
      query = query.concat("{\n");
      for(var i in data){
        query = inclusive(data[i]);
      }
      endPrevItem(prevItem);
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
                  addItem(j, currElems);
                }
                break;
              }
            }
          }
        else{
          for(var i in currElems){
            addItem(i, currElems);
          }
        }
      }else{
          endPrevItem(prevItem);
          prependSpace(item.split('.').length);
          query = query.concat(item).concat("\n");
        }
        prevItem = item;
        return query;
  }
  var addItem = function(i, currElems){
    prependSpace(parseInt(i) + 1);
    query = query.concat(currElems[i]);
    if(i < currElems.length -1){
        query = query.concat("{");
    }
    query = query.concat("\n");
  }
  var endPrevItem = function(item){
    if(item.includes(".")){
      var lvNum = (item.match(/\./g) || []).length;
      closeMultipleBrackets(0, lvNum + 1);
    }
  }
  var closeMultipleBrackets = function(index, length){
    var spaceNum = 0;
    while(index  < length - 1){
      spaceNum = length - 1;
      computeCloseBracket(spaceNum);
      length--;
    }
  }
  var prependSpace = function(spaceNum){
    while(spaceNum > 0){
      query = query.concat("     ");
      spaceNum--;
    }
  }
  var computeCloseBracket = function(spaceNum){
    prependSpace(spaceNum);
    query = query.concat("}\n");
  }
