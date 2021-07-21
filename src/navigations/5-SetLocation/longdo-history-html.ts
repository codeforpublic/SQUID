export const LONGDO_MAP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thailand Plus</title>
    <style type="text/css">
        html{
          height:100%; 
        }
        body{ 
          margin:0px;
          height:100%; 
        }
        #map {
          height: 100%;
        }
    </style>

    <script type="text/javascript" src="https://api.longdo.com/map/?key=covid19"></script>
    <script>
        var LongdoMap;
        var homeMarker;

        function onMapInit() {
            LongdoMap = new window.longdo.Map({ 
                placeholder: document.getElementById("longdo-map"), 
                language: 'en' 
            });

            // registerMarker();
            // registerEvents();
            mapInterfaceSetting();
        }

        /** 
         * Marker
         **/
        function registerMarker() {
            homeMarker = new window.longdo.Marker(LongdoMap.location(), {
                icon: {
                    url: 'https://longdomap.thailandplus.in.th/morchana-pin-home.png',
                    urlHD: 'https://longdomap.thailandplus.in.th/morchana-pin-home-hd.png',
                    offset: { x: 12.5, y: 45 }
                },
                weight: window.longdo.OverlayWeight.Top,
                draggable: true,
                clickable: true
            });

            LongdoMap.Overlays.add(homeMarker);
        }

        /** 
         * Map UI Setting
         **/
        function mapInterfaceSetting() {
            LongdoMap.zoom(14, true);
            LongdoMap.Ui.LayerSelector.visible(false);
            LongdoMap.Ui.Toolbar.visible(false);
            LongdoMap.Ui.DPad.visible(false);
            LongdoMap.Ui.Fullscreen.visible(true);
            LongdoMap.Ui.Geolocation.visible(false);
            LongdoMap.Ui.Keyboard.enable(true);
            LongdoMap.Ui.Keyboard.enableInertia(true);
            LongdoMap.Ui.Mouse.enableClick(true);
            LongdoMap.Ui.Mouse.enableDrag(false);
            LongdoMap.Ui.Mouse.enableWheel(true);
            LongdoMap.Ui.Mouse.enableInertia(true);
            LongdoMap.Ui.Crosshair.visible(false);
            LongdoMap.Ui.Zoombar.visible(false);
        }

        /** 
         * Register Events
         **/
        function registerEvents() {
            LongdoMap.Event.bind('click', () => {
                const mouseLocation = LongdoMap.location(window.longdo.LocationMode.Pointer);
                if (homeMarker) {
                    homeMarker.move(mouseLocation, true);
                }
            });

            LongdoMap.Event.bind('overlayMove', (overlay) => {
                const { lat, lon } = overlay.location();
                const data = JSON.stringify({ latitude: lat, longitude: lon });
                if (window && window.ReactNativeWebView && window.ReactNativeWebView.postMessage) { 
                    window.ReactNativeWebView.postMessage(data);
                }
            });
        }

        /** 
         * inject js
         **/
        var ThailandPlusMap = {
            getGeolocation: function () {
                try {
                    LongdoMap.location(longdo.LocationMode.Geolocation);
                } catch (err) {
                    console.log(err);
                }
            },
            setDefaultMapLocation: function (lat, lon) {
                if (lat && lon) {
                    LongdoMap.location({ lat: lat, lon: lon })
                    homeMarker.move({ lat: lat, lon: lon }, true);
                }
            },
            setMaker: function(lat, lon, no) {
                if (lat && lon) {
                var maker = new window.longdo.Marker(LongdoMap.location(),
                    {
                        title: 'Custom Marker',
                        icon: {
                        html: '<div style="position:relative">' +
                            '<svg width="40" height="45" viewBox="0 0 146 182" fill="none" xmlns="http://www.w3.org/2000/svg">'+
                            '<path fill-rule="evenodd" clip-rule="evenodd" d="M73 181.629L78.3349 176.97C123.197 137.798 146 103.593 146 73.5274C146 30.9494 112.768 0.527344 73 0.527344C33.2316 0.527344 0 30.9494 0 73.5274C0 103.593 22.8028 137.798 67.6651 176.97L73 181.629Z" fill="#00A0D7"/></svg>'+
                            '<div style="position:absolute;top:12px;left:0px;color:#FFFFFF;font-size:13px;font-weight:bold;text-align:center;width: 40px"># ' + no + '</div>'+
                        '</div>',
                            offset: { x: 12.5, y: 45 }
                        },
                        popup: {
                        },
                        draggable: false,
                        clickable: false
                    });
                }
                LongdoMap.Overlays.clear()
                LongdoMap.Overlays.add(maker);
                LongdoMap.location({ lat: lat, lon: lon })
                maker.move({ lat: lat, lon: lon }, true);
            },
            setCurrentMaker: function(lat, lon) {
                var maker = new window.longdo.Marker(LongdoMap.location(),
                    {
                        title: 'Custom Marker',
                        icon: {
                        html: '<svg width="160" height="50" viewBox="0 0 160 201" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                        '<path fill-rule="evenodd" clip-rule="evenodd" d="M73 200.629L78.3349 195.97C123.197 156.798 146 122.593 146 92.5274C146 49.9494 112.768 19.5273 73 19.5273C33.2316 19.5273 0 49.9494 0 92.5274C0 122.593 22.8028 156.798 67.6651 195.97L73 200.629Z" fill="#00A0D7"/>' +
                        '<path fill-rule="evenodd" clip-rule="evenodd" d="M51.1197 88.1654L71.6243 67.6608L92.1288 88.1654H92.1246V122.332H51.1246V88.1654H51.1197ZM44.2913 94.9938L39.2452 100.04L34.4167 95.2115L66.7965 62.8318C69.4628 60.1655 73.7857 60.1655 76.4521 62.8318L108.832 95.2115L104.003 100.04L98.9579 94.9945V122.332C98.9579 126.106 95.8985 129.165 92.1246 129.165H51.1246C47.3506 129.165 44.2913 126.106 44.2913 122.332V94.9938Z" fill="white"/>' +
                        '</svg>',
                            offset: { x: 12.5, y: 45 }
                        },
                        popup: {
                        },
                        draggable: false,
                        clickable: false
                    });
                LongdoMap.Overlays.clear()
                LongdoMap.location({ lat: lat, lon: lon })
                LongdoMap.Overlays.add(maker);
                maker.move({ lat: lat, lon: lon }, true);
            }
        };
        window['ThailandPlusMap'] = ThailandPlusMap;
    </script>
</head>
<body onload="onMapInit();">
    <div style="display: block; height: 100vh; width: 100vw;">
        <div id="longdo-map" style="width: 100%; height: 100%;"></div>
    </div>
</body>
</html>`
