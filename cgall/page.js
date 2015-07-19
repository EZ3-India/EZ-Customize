document.write('<link rel="icon" type="image/png" href="../../icons/3dd.png">');




function OpenScene(typ) {
  document.write('<div id="MenuBG"></div><div id="topWrapper">');
  document.write('<div id="topMain">');
  menuline();
 // document.write('<span style="float:right;"><a href="javascript:showpopup()"><img src="..\/icons\/share.png" height=30></a></span>');


  document.write('</div><div id="topLeft" style="padding: 9px 0px 0px 0px;"><a href="http:\/\/www.ez3.in"><img src="');
  if (typ=='template') document.write('../../');
  document.write('icons/logo4.png" width=200 height=32></a></div>');
  document.write('<div id="topRight"> </div>');

  document.write('</div><div id="pgWrapper">');

  document.write('<div id="pgLeft" style="padding: 0px 5px 0px 0px;">');
  // --------------------- LEFT  OPTIONS
  if (typ=='aboutus') document.write('<iframe src="usleft.html" width="100%" height="1000"  scrolling="no" seamless border=0 frameborder=0></iframe>');

  // document.write('</div><div id="pgRight" style="padding: 0px 0px 0px 10px;">');
  // --------------------- RIGHT OPTIONS
  if (typ=='template') document.write('<iframe src="../right.html" width="100%" height="1000"  scrolling="no" seamless border=0 frameborder=0></iframe>');
  if (typ=='index')   document.write('<iframe src="news.html" width="100%" height="600"  scrolling="no" seamless border=0 frameborder=0></iframe>');

  document.write('</div><div id="pgMain">');  //  after the page you need to put </div></div> (just before the </body>)

}

function PutExamples(srclink,howmany,cols,wid) {
	for(var N=1;N<=howmany;N++) {
		document.write('<a href="#"><img src="'+srclink+N.toString()+'.png" width='+wid.toString()+' onclick="parametersLoader(ExamplesLinks['+(N-1).toString()+'])"></a>');
	    if (N%cols==0) document.write('<BR>');
    }
}

function HiddenLink() {
document.write('<div id="PP" style="word-wrap: break-word;word-break: break-all;visibility:hidden;z-index:10;position: absolute;  left: 25%;  width:50%; border: dotted blue 1px;">');
document.write('<table width=100% bordercolor=0 border=0 bgcolor=000000 cellpadding=5><td bgcolor=dddddd><div ID="CLO"><b>');
document.write('Direct link to your model: <span style="float:right;" ></font><a href="javascript:hidepopup()">Close</a></span></b></div>');
document.write('<div ID="LIN"><font size=1><a href="d" ID="LINK">d</a></div></td></table></div>');
}


function showpopup() {
  var url = document.URL
  var newAdditionalURL = "";
  var tempArray = url.split("?");
  var tempArray=tempArray[0].split("#");
  var baseURL = tempArray[0];
  var stateObject = {};
  var title = "";
  var newUrl = baseURL.match(/(^[^#]*)/)[0];
  var cells = document.getElementsByTagName("input");
  for (var i = 0; i < cells.length; i++) {
	if (i!=0) {newUrl+="&";} else {newUrl+="?";}


   if (cells[i].getAttribute('ID')!=null)
	{
		if (cells[i].getAttribute('type') === 'checkbox')
	    	  {
		    	    newUrl=newUrl+cells[i].getAttribute('ID')+"="+cells[i].checked;
	    	  }

	    else
	   {
		    newUrl=newUrl+cells[i].getAttribute('ID')+"="+cells[i].value;
	    }
    }

  }

  var cells = document.getElementsByTagName("textarea");
  for (var i = 0; i < cells.length; i++) {
	newUrl+="&";
    newUrl=newUrl+cells[i].getAttribute('ID')+"="+cells[i].value.replace(/(?:\r\n|\r|\n)/g, '|');
  }

  var cells = document.getElementsByTagName("select");
  for (var i = 0; i < cells.length; i++) {

	if (cells[i].getAttribute('ID')!=null) {newUrl+="&";     newUrl=newUrl+cells[i].getAttribute('ID')+"="+cells[i].value; }
  }

    document.getElementById('PP').style.visibility="visible";
	document.getElementById("LINK").innerHTML=newUrl;
	document.getElementById("LINK").setAttribute("href", newUrl);
}

function hidepopup() {
	document.getElementById('PP').style.visibility="hidden";
	document.getElementById("LINK").innerHTML=""
}


function parametersLoader(url) {
	if(typeof url === "undefined") {  // for examples

    (window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
    })();
  }
    else {  // for parameters in the real URL
	  var urlParams = {};
	  var tempArray = url.substring(url.indexOf('?')+1);
	  var tempArray = tempArray.split('&');
      for (var i = 0; i < tempArray.length; i++){
	    var g=tempArray[i].split('=');
	    urlParams[g[0]] = g[1];
      }
   }

  var withparam=false;
  for (var key in urlParams) {

    if (urlParams.hasOwnProperty(key)) {
    	if(document.getElementById(key) != null )
    	{
	    	withparam=true;
	    	if (document.getElementById(key).getAttribute('type') === 'checkbox')
	    	  {

		    	  if (urlParams[key]=='true') {document.getElementById(key).checked=true; }
		    	  if (urlParams[key]=='false') {document.getElementById(key).checked=false; }

	    	  }
	    	  else
	    	  {
		    	  document.getElementById(key).value= urlParams[key].replace('|', '\n');
		    	  if (document.getElementById(key).tagName=='SELECT') {document.getElementById(key).onchange();}
	    	  }


	    }
    }
  }

  updateSolid();
}


function parametersLoaderText(url) {
	var urlParams;
	if(typeof url === "undefined") {

  (window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
  })();
  }
  else {
	  var urlParams = {};
	  var tempArray = url.substring(url.indexOf('?')+1);
	  var tempArray = tempArray.split('&');
      for (var i = 0; i < tempArray.length; i++){
	    var g=tempArray[i].split('=');
	    urlParams[g[0]] = g[1];
      }
   }

  var withparam=false;
  for (var key in urlParams) {
    if (urlParams.hasOwnProperty(key)) {
    	if(document.getElementById(key) != null )
    	{
	    	withparam=true;
	        if (document.getElementById(key).getAttribute('type') === 'checkbox')
	    	  {

		    	  if (urlParams[key]=='true') {document.getElementById(key).checked=true; }
		    	  if (urlParams[key]=='false') {document.getElementById(key).checked=false; }
	    	  }
	    	  else
	    	  {
		    	  document.getElementById(key).value= urlParams[key].replace('|', '\n');
		    	  if (document.getElementById(key).tagName=='SELECT') {if (key!='SelectFont') {document.getElementById(key).onchange();}}
	    	  }
        }
    }
  }

	  UpdateFontList('SelectFont',document.getElementById('SelectLang').value);
	  LoadFontUpdateSolid('../../openJScad/fonts/'+document.getElementById('SelectFont').value,document.getElementById('textField').value.replace(/(\r\n|\n|\r)/gm,'|'),document.getElementById('Fnarrowing').value*0.01,document.getElementById('Fitalic').value*0.01);
}
