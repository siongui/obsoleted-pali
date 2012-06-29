$(document).ready(function() {
  document.getElementById('PaliInput').focus();

  // <!-- make keypad draggable -->
  $("#keyboard").draggable();

  // <!-- bind the click function of input element inside keypad -->
  $("#keyboard input").bind("click", function(e) {
    document.getElementById("PaliInput").value += this.value;
    document.getElementById("PaliInput").focus();
  });
});


//<!-- make keypad show if hidden, hide if shown -->
function toggle() {
  var kb = document.getElementById("keyboard");
  var dt = document.getElementById("displayText");
  if(kb.style.display == "inline") {
    kb.style.display = "none";
    dt.innerHTML = getStringShowKeypad();
  }
  else {
    kb.style.display = "inline";
    dt.innerHTML = getStringHideKeypad();
    kb.style.left = getOffset(dt).left + "px";
  }
}

// http://www.web-code.org/coding-tools/javascript-escape-unescape-converter-tool.html
function showAbout(){document.getElementById("result").innerHTML = document.getElementById("about").innerHTML;}
function showLink(){document.getElementById("result").innerHTML = document.getElementById("link").innerHTML;}

function onPaliInputSubmit() {
  if (queryURL.jsonp == "no") {lookup();}
  else {JSONPlookup(document.getElementById('PaliInput').value);}
}

function lookup() {
  var xmlhttp;
  if (window.XMLHttpRequest) {xmlhttp=new XMLHttpRequest();}
  else {xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        //document.getElementById('').innerHTML=xmlhttp.status;
        //document.getElementById('').innerHTML=xmlhttp.statusText;
        document.getElementById('result').innerHTML=xmlhttp.responseText;
      } else {
        document.getElementById('result').innerHTML='XMLHttpRequest error!';
      }
    }
  }
  document.getElementById('result').innerHTML = getStringLookingUp();
  if (queryURL.lookup == "gae") {xmlhttp.open("POST","http://palidictionary.appspot.com/lookup",true);}
  else if (queryURL.lookup == "paw") {xmlhttp.open("POST","http://siongui.pythonanywhere.com/lookup",true);}
  else if (queryURL.lookup == "wfn") {xmlhttp.open("POST","http://siongui.webfactional.com/lookup",true);}
  else {xmlhttp.open("POST","/lookup",true);}
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("word=" + encodeURI(document.getElementById('PaliInput').value));
}

// http://www.onlinesolutionsdevelopment.com/blog/web-development/javascript/jsonp-example/
// http://www.slideshare.net/andymckay/cross-domain-webmashups-with-jquery-and-google-app-engine
function JSONPlookup(paliword) {
  document.getElementById('result').innerHTML = getStringLookingUp();
  url = "/lookup?callback=JSONPlookupCallback&word=" + encodeURIComponent(paliword);
  if (queryURL.lookup == "gae") {url="http://palidictionary.appspot.com"+url;}
  if (queryURL.lookup == "paw") {url="http://siongui.pythonanywhere.com"+url;}
  if (queryURL.lookup == "wfn") {url="http://siongui.webfactional.com"+url;}
  var ext = document.createElement('script');
  ext.setAttribute('src', url);
  if (typeof ext != "undefined") {document.getElementsByTagName("head")[0].appendChild(ext);}
}

function JSONPlookupCallback(result) {
  // input value is "list of 3-tuple" in Python
  document.getElementById('result').innerHTML = "";
  if (result == null) {
    document.getElementById('result').innerHTML = getStringNoSuchWord();
    return;
  }
  var resultOuterTable = document.createElement("table");
  resultOuterTable.className = "resultCurvedEdges";
  //result = eval(result);
  for (var index1 in result) {
    var dictWordExp = eval(result[index1]);
    var resultInnerTable = document.createElement("table");
    var count = 0;
    resultInnerTable.className = "dicTable";
    for (var index2 in dictWordExp) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      var th = document.createElement("th");
      if (count == 0) {th.innerHTML = getStringDictionary();}
      else if (count == 1) {th.innerHTML = getStringPaliWord();}
      else {th.innerHTML = getStringExplain();}
      td.innerHTML = dictWordExp[index2];
      tr.appendChild(th);
      tr.appendChild(td);
      resultInnerTable.appendChild(tr);
      if (count > 2) {console.log("in JSONPlookupCallback: something strange. count > 2");}
      count += 1;
    }
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.appendChild(resultInnerTable);

    var backToTop = document.createElement("a");
    backToTop.href = '/';
    backToTop.onclick = function(e){window.scrollTo(0,0);return false;};
//    backToTop.href = "javascript:window.scrollTo(0,0);";
    backToTop.style.textDecoration = "none";
    backToTop.style.color = "#00C";
    backToTop.style.fontSize = "small";
    backToTop.style.cursor = "pointer";
    backToTop.innerHTML = '<span style="text-decoration:underline">' + getStringBackToTop() + '</span><span style="font-size:.75em;">&#9650;</span>';
    td.appendChild(backToTop);

    tr.appendChild(td);
    resultOuterTable.appendChild(tr);
  }
  document.getElementById('result').appendChild(resultOuterTable);
}


/* Dynamically retrieve Html element (X,Y) position with JavaScript */
// http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript
/* Window size and scrolling */
// http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
/* scrollLeft property */
// http://help.dottoro.com/ljcjgrml.php
/* jQuery source code: src/offset.js */
// https://github.com/jquery/jquery/blob/master/src/offset.js
/* How to get iframe scroll position in IE using Java Script? */
// http://stackoverflow.com/questions/2347491/how-to-get-iframe-scroll-position-in-ie-using-java-script
function getOffset( el ) {
//  return { top: $(el).position().top, left: $(el).position().left };
  var oriEl = el;
  var _x = 0;
  var _y = 0;
  var offsetX = 0;
  var offsetY = 0;
  var scrollX = 0;
  var scrollY = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
    offsetX += el.offsetLeft;
    offsetY += el.offsetTop;
    scrollX += el.scrollLeft;
    scrollY += el.scrollTop;
    el = el.offsetParent;
  }
  // getBoundingClientRect method - http://help.dottoro.com/ljvmcrrn.php
  if (oriEl.getBoundingClientRect) {
    /* FIXME: should take margin-left and margin-top into consideration */
    var body = document.documentElement || document.body;
    scrollX = window.pageXOffset || body.scrollLeft;
    scrollY = window.pageYOffset || body.scrollTop;
    _x = oriEl.getBoundingClientRect().left + scrollX;
    _y = oriEl.getBoundingClientRect().top + scrollY;
  } else {
    /* FIXME: code in this else clause maybe not correct? */
    _x = offsetX - scrollX;
    _y = offsetY - scrollY;
  }
  return { top: _y, left: _x };
}

// hide popup div when clicking outside the div
// http://www.webdeveloper.com/forum/showthread.php?t=98973
document.onclick = check;
// Event accessing
// http://www.quirksmode.org/js/events_access.html
// Event properties
// http://www.quirksmode.org/js/events_properties.html
function check(e){
  var target = (e && e.target) || (event && event.srcElement); 
  var langDropdownMenuDiv = document.getElementById("menuDiv-lang-dropdown"); 
  var langDropdown = document.getElementById("lang-dropdown"); 

  if (!checkParent(target, "menuDiv-lang-dropdown")) {
    if (checkParent(target, "lang-dropdown")) {
      if (langDropdownMenuDiv.style.display == "none") {
        langDropdownMenuDiv.style.left = getOffset(langDropdown).left +"px";
        langDropdownMenuDiv.style.top = (getOffset(langDropdown).top + langDropdown.offsetHeight +3) +"px";
        langDropdownMenuDiv.style.display = "";
      } else {langDropdownMenuDiv.style.display = "none";}
    } else {
      langDropdownMenuDiv.style.display = "none";
    }
  }
}
function checkParent(t,id) {
  /* Chrome and Firefox use parentNode, while Opera use offsetParent */
  while(t.parentNode) { 
    if( t == document.getElementById(id) ) {return true;} 
    t = t.parentNode;
  } 
  while(t.offsetParent) { 
    if( t == document.getElementById(id) ) {return true;} 
    t = t.offsetParent;
  } 
  return false;
}
