var userInfo="";
var loginurl='http://27.155.120.108/store/';

  function queryURLParams () {
		let url = window.location.href.split("?")[1];
		const urlSearchParams = new URLSearchParams(url);
		const params = Object.fromEntries(urlSearchParams.entries());
		return params
   }
 function  geri() {
	   if(queryURLParams().userInfo){
		   $.ajax({
		           url: loginurl + "user/uuid?uuid=" + this.queryURLParams(window.location.href).userInfo,
		           type: "get",
		           contentType: "application/json;charset-UTF-8",
		           dataType: "json"
		       }).done(function(data) {
		           if (data.code == 200) {
		              	localStorage.setItem("userInfo",JSON.stringify(data.data))
		           } else {
		               fn.showTip(data.message);
		           }
		       })
	   }
	   userInfo = JSON.parse(localStorage.getItem("userInfo"));
   }
geri()
