
var appId = '[your appId from developers.here.com';
var appCode = '[your appCode from developers.here.com]';

window.olMap = {
    showMap: function () {
        var HereLayers = [
            {
                base: 'base',
                type: 'maptile',
                scheme: 'osm',                
            },
            {
                base: 'base',
                type: 'maptile',
                scheme: 'normal.day',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'base',
                type: 'maptile',
                scheme: 'normal.day.transit',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'base',
                type: 'maptile',
                scheme: 'pedestrian.day',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'aerial',
                type: 'maptile',
                scheme: 'terrain.day',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'aerial',
                type: 'maptile',
                scheme: 'satellite.day',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'aerial',
                type: 'maptile',
                scheme: 'hybrid.day',
                app_id: appId,
                app_code: appCode
            }
        ];
        var urlTpl = 'https://{1-4}.{base}.maps.cit.api.here.com' +
            '/{type}/2.1/maptile/newest/{scheme}/{z}/{x}/{y}/256/png' +
            '?app_id={app_id}&app_code={app_code}';

        var layers = [];

        var osmLayer = new ol.layer.Tile({
            visible: false,
            type: "base",
            preload: Infinity,
            source: new ol.source.OSM()
        });
        

        var i, ii;

        for (i = 0, ii = HereLayers.length; i < ii; ++i) {
            var layerDesc = HereLayers[i];

            if (layerDesc.scheme === "osm") {
                layers.push(osmLayer);
            }

            if (layerDesc.scheme !== "osm") {
                layers.push(new ol.layer.Tile({
                    visible: false,
                    type: "base",
                    preload: Infinity,
                    source: new ol.source.XYZ({
                        url: createUrl(urlTpl, layerDesc),
                        attributions: 'Map Tiles &copy; ' + new Date().getFullYear() + ' ' +
                            '<a href="http://developer.here.com">HERE</a>'
                    })
                }));
            }
        }



        var map = new ol.Map({
            target: 'map',
            layers: layers,
            view: new ol.View({
                center: ol.proj.fromLonLat([36.8173, -1.2865]),
                zoom: 18
            })
        });

        //map.addControl(new ol.control.LayerSwitcher());

        function createUrl(tpl, layerDesc) {
            return tpl
                .replace('{base}', layerDesc.base)
                .replace('{type}', layerDesc.type)
                .replace('{scheme}', layerDesc.scheme)
                .replace('{app_id}', layerDesc.app_id)
                .replace('{app_code}', layerDesc.app_code);
        }

        var select = document.getElementById('layer-select');

        function onChange() {
            var scheme = select.value;
            for (var i = 0, ii = layers.length; i < ii; ++i) {
                layers[i].setVisible(HereLayers[i].scheme === scheme);                
            }
        }

        select.addEventListener('change', onChange);

        onChange();
    }
};


