sap.ui.define([
	"BasicFiori-Routing/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, Device,MessageToast) {
	"use strict";

	return BaseController.extend("BasicFiori-Routing.controller.Material", {

		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("material").attachPatternMatched(this._onMasterMatched, this);
		},

		_onMasterMatched: function() {
			var that = this,
				jsonModel = new JSONModel(),
				oModel = this.getOwnerComponent().getModel("MainService"),
				oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();
			oList.setBusy(true);
			this.setModel(oViewModel, "masterView");
			oList.attachEventOnce("updateFinished", function() {
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
			if( navigator.onLine) {
				MessageToast.show("Online");
				oModel.read("/ZmatSet", {
					success: function(data) {
						jsonModel.setData(data);
						oList.setBusy(false);
						that.getView().setModel(jsonModel, "MaterialModel");
					},
					error: function(error) {
						oList.setBusy(false);
						console.log("error" + error);
					}
				});
			} else {
				MessageToast.show("Offline");
			}

		},
		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},
		_createViewModel: function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: "Materials",
				noDataText: "No Materials Available",
				sortBy: "Description",
				groupBy: "None"
			});
		},
		_showDetail: function(oItem) {
			var bReplace = !Device.system.phone,
				selectedMaterial = new JSONModel();
			selectedMaterial.setData(oItem.getBindingContext("MaterialModel").getProperty());
			this.getOwnerComponent().setModel(selectedMaterial, "selectedMaterial");
			this.getRouter().navTo("materialDetails", {
				MaterialId: oItem.getBindingContext("MaterialModel").getProperty("Material")
			}, bReplace);
		},

		onSelectionChange: function(oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		}

	});

});