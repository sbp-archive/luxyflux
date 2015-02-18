describe('Actions', function () {
    'use strict';

    var Actions;

    var mockDispatcher, syncActionCreator;

    beforeEach(module('connect-flux'));

    beforeEach(inject(function (_LuxaFluxActions_) {
        Actions = _LuxaFluxActions_;
    }));

    describe('constructor()', function() {
        beforeEach(function() {
            mockDispatcher = {
                register: jasmine.createSpy(),
                dispatch: jasmine.createSpy()
            };

            syncActionCreator = new Actions(mockDispatcher);
        });

        it('should have throw an error when you do not pass in a dispatcher', function () {
            function createActionCreatorWithoutDispatcher() {
                return new Actions();
            }
            expect(createActionCreatorWithoutDispatcher).toThrow();
        });

        it('should bind our mockDispatcher', function() {
            expect(syncActionCreator.dispatcher).toBe(mockDispatcher);
        });
    });

    // var TeamAssetsStore = ConnectFlux.createStore({
    //     initialize: function() {
    //         this.items = [];
    //     },

    //     handlers: {
    //         'ASSETS_LOAD_COMPLETED': 'loadAssetsSuccess',
    //         'ASSETS_LOAD_FAILED': 'loadAssetsFailed',
    //         'ASSET_CREATE': 'createAsset'
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

    // var AssetActions = ConnectFlux.createActions({
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
});
