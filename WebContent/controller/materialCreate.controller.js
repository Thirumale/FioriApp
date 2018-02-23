sap.ui.define([
	"BasicFiori-Routing/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";
	return BaseController.extend("BasicFiori-Routing.controller.materialCreate", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf prokarma.view.view.materialCreate
		 */
		onInit: function() {
			this.getRouter().getRoute("materialCreate").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function() {
			this.getView().byId("DescriptionCreateId").setValue("");
			this.getView().byId("priceCreateId").setValue("");
			this.getView().byId("typeCreateId").setValue("");
			this.getView().byId("QuantityCreateId").setValue("");
		},

		onNavBack: function() {
			var that = this;
			if (this.getView().byId("onSavebtnId").getVisible()) {
				MessageBox.warning("The Unsaved Data will be lost. Do you want to Continue", {
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					onClose: function(sAction) {
						if (sAction === "OK") {
							that.getRouter().navTo("material");
						}
					}
				});
			} else {
				that.getRouter().navTo("material");
			}
		},
		onClearPressed:function(){
			this._onObjectMatched();
		},
		onCreatePressed: function() {
			var that = this;
			var desc = this.getView().byId("DescriptionCreateId").getValue();
			var price = this.getView().byId("priceCreateId").getValue();
			var type = this.getView().byId("typeCreateId").getValue();
			var quantity = this.getView().byId("QuantityCreateId").getValue();
			var unit = this.getView().byId("UnitCreateId").getText();
			var data = {
				"Price": price,
				"Description": desc,
				"Type": type,
				"Quantity": quantity,
				"Unit": unit
			};
			var createData = {
				"d": data
			};
			var oModel = this.getOwnerComponent().getModel("MainService");
			if (navigator.onLine) {
				oModel.create("/ZmatSet", createData, {
					method: "POST",
					success: function(data) {
						MessageBox.success("The new Materail is created successfully", {
							onClose: function(sAction) {
								that.getRouter().navTo("material");
							}
						});
					},
					error: function(e) {
						MessageBox.error(e.message);
					}
				});
			}
		}
	});

});