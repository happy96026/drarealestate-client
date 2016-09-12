(function( $, google ) {

    var map = new google.maps.Map( document.getElementById( 'map' ), {
        zoom: 11,
        center: {lat: 53.5333, lng: -113.5000},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    // Part 1 - Mark up Roads, Water, Parks, Landscape

    $('.btn-group').colorDrop({
        onChange: function() {
            changeMapStyles( map );
        }
    });

    $('#map').height($(window).height());

    function changeMapStyles( map ) {
        var hueColor = $('#hue-list').colorDrop('val'),
            roadColor = $('#road-list').colorDrop('val'),
            waterColor = $('#water-list').colorDrop('val'),
            parkColor = $('#park-list').colorDrop('val'),
            landscapeColor = $('#landscape-list').colorDrop('val');
        var featureOpts = [
            {
              stylers: [
                { hue: hueColor }
              ]
            },{
                elementType: "labels",
                stylers: [{
                    visibility: "on"
                }]
            },{
                featureType: "road",
                stylers: [{
                    visibility: "on"
                }, {
                    color: roadColor
                }]
            },{
                featureType: "water",
                stylers: [{
                    visibility: "on"
                }, {
                    color: waterColor
                }]
            },
            {
                featureType: "poi"
                ,stylers: [{
                    visibility: "on"
                }, {
                    color: parkColor
                }]
            },
            {
                featureType: "landscape",
                stylers: [{
                    visibility: "on"
                }, {
                    color: landscapeColor
                }]
            }
        ];  
        map.setOptions({
            styles: featureOpts
        });            
    };
    changeMapStyles( map );

    // Part 2 - Mark up neighborhoods

    // listener on polygon
    var addListenersOnPolygon = function(polygon,name,area) {
        // when the polygon has been clicked 
        google.maps.event.addListener(polygon, 'click', function (event) {   
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>'+
                '<div id="bodyContent">'+
                '<p><b>'+ name +'</b> has an area of '+ area +' km^2</p>'+
                '</div>'+
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                position: event.latLng
            });
            infowindow.open(map,polygon);                  
        });
        // when the polygon has been moused over
        google.maps.event.addListener(polygon, 'mouseover', function (event) {
            this.setOptions({fillOpacity:0.8});
            this.setOptions({strokeOpacity:0.8});
        });
        // when the polygon has been moused out
        google.maps.event.addListener(polygon, 'mouseout', function (event) {
            this.setOptions({fillOpacity:0.2});
            this.setOptions({strokeOpacity:0.2});
        });
    }
    // random color generator
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    // ajax request for wards or neighbourhoods
    $.ajax({
        // Wards
        // url:'https://data.edmonton.ca/api/views/8fid-pcdr/rows.json?accessType=DOWNLOAD'
        // neighbourhoods
        url:'https://data.edmonton.ca/api/views/nckr-nnqj/rows.json?accessType=DOWNLOAD'
    }).done(function(data){   // parse the data and store it
        // console.log(data["data"].length);
        var Polygonlnglat;
        triangleCoords = [];        
        var neighbourhood;          
        for ( i=0; i<data["data"].length; i++){
            triangleCoords = [];
            Polygonlnglat = data["data"][i][9].replace("MULTIPOLYGON","").replace("(((","").replace(/,/g,"").replace(")))","").split(" ");
            for ( j=1; j<= Polygonlnglat.length; j=j+2 ){
                triangleCoords.push( { lng: Number(Polygonlnglat[j]),lat: Number(Polygonlnglat[j+1]) } );
            }
            neighbourhood = new google.maps.Polygon({
                paths: triangleCoords,
                strokeColor: getRandomColor(),
                strokeOpacity: 0.2,
                strokeWeight: 1,
                fillColor: getRandomColor(),
                fillOpacity: 0.2,
                indexID: i
            });
            neighbourhood.setMap(map);        
            addListenersOnPolygon(neighbourhood,data["data"][i][8],data["data"][i][11]);
        }
    });

    // Part 3 - Mark up schools

    // listener on polygon
    var addListenersOnSchoolMarker = function(marker,name,url,address,level,phone_number) {
        // when the polygon has been clicked 
        google.maps.event.addListener(marker, 'click', function (event) {
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>'+
                '<div id="bodyContent">'+
                '<p><b>website </b>' + url +'</p>'+
                '<p><b>address </b>' + address +'</p>'+
                '<p><b>level   </b>' + level +'</p>'+
                '<p><b>phone   </b>' + phone_number +'</p>'+
                '</div>'+
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            infowindow.open(map,marker);

            // For street view
            var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('street_view'),
                {
                    position: event.latLng,
                    pov: {heading: 165, pitch: 0},
                    zoom: 1,
                    enableCloseButton: True
                });
        });
    }

    // ajax request for schools
    $.ajax({
        url:'https://data.edmonton.ca/resource/7yqh-39tz.json'
    }).done(function(data){   // parse the data and store it
        SchoolMarkerClusterer = new MarkerClusterer(map,[]);
        for ( i=0; i<data.length; i++){
            school = new google.maps.Marker({
                map:map,
                position: { lng: Number(data[i].location.longitude),lat: Number(data[i].location.latitude) },
                icon: './museum_science.png'
            });
            SchoolMarkerClusterer.addMarker(school);
            school.setMap(map);        
            addListenersOnSchoolMarker(school,data[i].school_name,data[i].website.url,data[i].address,data[i].grade_level,data[i].phone_number);
        }
    });


    $("#school-list").change(function(){ 
        console.log("Checkbox changed.");
        alert('checkbox changed test');        
    })





    // Part 4 - Search Box

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
    });



    // // Part 3 - Drawing Library 
    // var drawingManager = new google.maps.drawing.DrawingManager({
    //     drawingMode: google.maps.drawing.OverlayType.MARKER,
    //     drawingControl: true,
    //     drawingControlOptions: {
    //         position: google.maps.ControlPosition.TOP_CENTER,
    //         drawingModes: [
    //             google.maps.drawing.OverlayType.MARKER,
    //             google.maps.drawing.OverlayType.CIRCLE,
    //             google.maps.drawing.OverlayType.POLYGON,
    //             google.maps.drawing.OverlayType.POLYLINE,
    //             google.maps.drawing.OverlayType.RECTANGLE
    //         ]
    //     },
    //     markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
    //     circleOptions: {
    //         fillColor: '#ffff00',
    //         fillOpacity: 1,
    //         strokeWeight: 5,
    //         clickable: false,
    //         editable: true,
    //         zIndex: 1
    //     }
    // });

    // drawingManager.setMap(map);

    // Part5 - heat map implementation

    // var firebase = new Firebase("https://yu-firebase-map.firebaseio.com/");

    // // Heat Map
    // // Add marker on user click
    // map.addListener('click', function(e) {
    //     firebase.push({lat: e.latLng.lat(), lng: e.latLng.lng()});
    // });

    // // Create a heatmap.
    // var heatmap = new google.maps.visualization.HeatmapLayer({
    //     data: [],
    //     map: map,
    //     radius: 8
    // });

    // firebase.on("child_added", function(snapshot, prevChildKey) {
    //     // Get latitude and longitude from Firebase.
    //     var newPosition = snapshot.val();

    //     // Create a google.maps.LatLng object for the position of the marker.
    //     // A LatLng object literal (as above) could be used, but the heatmap
    //     // in the next step requires a google.maps.LatLng object.
    //     var latLng = new google.maps.LatLng(newPosition.lat, newPosition.lng);

    //     heatmap.getData().push(latLng);
    // });


})( jQuery, google );