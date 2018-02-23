sap.ui.define([
	"BasicFiori-Routing/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController, JSONModel, Device ) {
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
			if (navigator.onLine) {
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
				that.showToster("You are viewing offline data");
				oList.setBusy(false);
				var myVar = setInterval(function() {
					onlineCbk();
				}, 3000);

				function onlineCbk() {
					if (navigator.onLine) {
						that._onMasterMatched();
						that.showToster("Your Online, Please bare with us your data is getting Sync");
						clearInterval(myVar);
					}
				}
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
			var detailId = sap.ui.getCore().byId("__xmlview2--saveButtonId");
			if (detailId !== undefined) {
				if (detailId.getVisible()) {
					return sap.m.MessageToast.show("please save/Cancel the Materail before moving");
				}
			}

			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		onSemanticAddButtonPress: function() {
			this.getRouter().navTo("materialCreate");
		}

	});

});