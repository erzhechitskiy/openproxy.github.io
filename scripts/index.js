!function(){$.getWithYQL=function(url,callback){var query;return query=encodeURIComponent('select * from html where url="'+url+'"'),$.getJSON("//query.yahooapis.com/v1/public/yql?q="+query+"&format=xml&callback=?",function(response){var _ref;return callback(null!=(_ref=response.results)?_ref[0]:void 0)})},google.maps.event.addDomListener(window,"load",function(){var doubleClickCatcher,findCountry,geocoder,hidden,infoTemplate,infoWindow,map,mapClickListener,marker,proxySwitchEnabled,veil;return google.maps.visualRefresh=!0,hidden=function(feature){return{featureType:feature,stylers:[{visibility:"off"}]}},map=new google.maps.Map(document.getElementById("map-container"),{zoom:3,center:new google.maps.LatLng(32,0),mapTypeId:google.maps.MapTypeId.ROADMAP,mapTypeControl:!1,panControl:!1,streetViewControl:!1,styles:[hidden("administrative.province"),hidden("administrative.locality"),hidden("administrative.neighborhood"),hidden("road"),hidden("poi"),hidden("transit")]}),google.maps.event.addListener(map,"zoom_changed",function(min,max){return function(){var zoom;return zoom=map.getZoom(),min>zoom?map.setZoom(min):zoom>max?map.setZoom(max):void 0}}(3,6)),veil=function(){var $veil;return $veil=$('<div class="veil" style="display: none"><div class="center"></div></div>').appendTo($(document.body)),new Spinner({lines:13,length:0,radius:60,trail:60}).spin($veil.find(".center")[0]),function(state){return $veil[state?"fadeIn":"fadeOut"]()}}(),geocoder=new google.maps.Geocoder,findCountry=function(latLng){var deferred;return deferred=new $.Deferred,geocoder.geocode({latLng:latLng},function(records,status){var record,_i,_len;if(status===google.maps.GeocoderStatus.OK)for(_i=0,_len=records.length;_len>_i;_i++)if(record=records[_i],-1!==record.types.indexOf("country"))return deferred.resolve(record);return deferred.reject()}),deferred},mapClickListener=function(event){var deferredCountry;return map.setCenter(event.latLng),infoWindow.close(),veil(!0),deferredCountry=findCountry(event.latLng).done(function(country){var countryCode,deferredProxyCollection,url;return countryCode=country.address_components[0].short_name,url="http://www.xroxy.com/proxylist.php?type=transparent&country="+countryCode+"&sort=latency",deferredProxyCollection=$.getWithYQL(url,function(data){var $response,proxyCollection;return proxyCollection=[],$response=$((new DOMParser).parseFromString(null!=data?data:"","text/xml")),$(".row0, .row1",$response).each(function(){var tdl;return tdl=$(this).find("td a"),proxyCollection.push({host:$.trim($(tdl[1]).text()),port:parseInt($(tdl[2]).text(),10),type:$(tdl[3]).text()})}),infoWindow.setPosition(country.geometry.location),infoWindow.setContent(infoTemplate(proxyCollection)),infoWindow.open(map),proxySwitchEnabled&&$(".info-window").on("click",".proxy-switch",function(event){var proxy,proxyIndex;return proxyIndex=$(event.target).closest("tr").attr("data-index"),proxy=proxyCollection[proxyIndex],window.postMessage({type:"OP_PROXY_ON",body:proxy},"*"),!1}),veil(!1)}),deferredProxyCollection.fail(function(){return veil(!1)})}),deferredCountry.fail(function(){return veil(!1)})},doubleClickCatcher=null,google.maps.event.addListener(map,"click",function(event){return doubleClickCatcher=setTimeout(function(){return mapClickListener(event)},250)}),google.maps.event.addListener(map,"dblclick",function(){return clearTimeout(doubleClickCatcher)}),proxySwitchEnabled=!1,infoTemplate=function(proxies){var i,proxy,trc;return 0===proxies.length?'<div class="nobr">No proxies in this location</div>':(trc=proxySwitchEnabled?"proxy-switch":"","<div class='info-window'>                <table>                    <thead><tr><th>Host</th><th>Port</th><th>Type</th></tr></thead>                    <tbody>                        "+function(){var _i,_len,_results;for(_results=[],i=_i=0,_len=proxies.length;_len>_i;i=++_i)proxy=proxies[i],_results.push('<tr class="'+trc+'" data-index="'+i+'">'+"<td>"+proxy.host+"</td><td>"+proxy.port+"</td><td>"+proxy.type+"</td>"+"</tr>");return _results}().join("")+"                    </tbody>                </table>            </div>")},infoWindow=new google.maps.InfoWindow,marker=new google.maps.Marker({map:map}),google.maps.event.addListener(marker,"click",function(){return infoWindow.open(map,marker)}),$.getJSON("http://freegeoip.net/json/?callback=?",function(data){var clientLatLng;return clientLatLng=new google.maps.LatLng(data.latitude,data.longitude),map.setCenter(clientLatLng),findCountry(clientLatLng).done(function(country){return marker.setPosition(country.geometry.location)})}),window.addEventListener("message",function(event){return"OP_CHROME_EXTENSION_INITIALIZED"===event.data.type?proxySwitchEnabled=!0:void 0})})}.call(this);