describe('Store', function () {
    'use strict';

    var Store;

    beforeEach(module('connect-flux'));

    beforeEach(inject(function (_LuxaFluxStore_) {
        Store = _LuxaFluxStore_;
    }));

    it('should have run token', function () {
        expect(true).toEqual(true);
    });

    // var TeamAssetsStore = LuxaFlux.createStore({
    //     storeName: 'TeamAssets',

    //     handlers: {
    //         'ASSETS_LOAD_SUCCESS': 'loadAssetsSuccess',
    //         'ASSETS_LOAD_FAILED': 'loadAssetsFailed',
    //         'ASSET_CREATE': 'createAsset'
    //     },

    //     initialize: function() {
    //         this.items = [];
    //     },

    //     loadAssetsSuccess: function(assets) {
    //         this.items.push.apply(this.items, assets);
    //     },

    //     loadAssetsFailed: function() {
    //         this.items.length = 0;
    //     },

    //     createAsset: function(asset) {
    //         this.items.push(asset);
    //     }
    // });

    // var AssetActions = LuxaFlux.createActions({
    //     serviceActions: {
    //         'ASSETS_LOAD': 'loadAssets'
    //     },

    //     createAsset: function(asset) {
    //         this.dispatch('ASSET_CREATE', asset);
    //     },

    //     loadAssets: function(params) {
    //         return AssetResource.query(params).$promise;
    //     }
    // });

    // AssetActions.loadAssets({team_key: 'sbp'}).then(function() {
    //     console.log('all actions dispatched and handled');
    // });

    // AssetActions.createServiceActions();
});
