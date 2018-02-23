sap.ui.define([
	"BasicFiori-Routing/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, JSONModel,MessageBox) {
	"use strict";
	return BaseController.extend("BasicFiori-Routing.controller.materialCreate", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf prokarma.view.view.materialCreate
		 */
		//	onInit: function() {
		//
		//	},
		
		onNavBack:function(){
				var that = this;
			if(this.getView().byId("onSavebtnId").getVisible()){
				MessageBox.warning("The Unsaved Data will be lost. Do you want to Continue",{
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					onClose: function(sAction) {
						if(sAction === "OK"){
						that.getRouter().navTo("material");
						}
					}
				});
			}else{
			that.getRouter().navTo("material");	
			}	
		},
			onCreatePressed:function(){
			var that = this;
			var desc = this.getView().byId("DescriptionCreateId").getValue();
			var price = this.getView().byId("priceCreateId").getValue();
			var type = this.getView().byId("typeCreateId").getValue();
			var quantity = this.getView().byId("QuantityCreateId").getValue();
			var unit = this.getView().byId("UnitCreateId").getValue();
			var data = {
				"Price": price,
				"Description": desc,
				"Type": type,
				"Quantity": quantity,
				"Unit":unit
			};
			var createData = {
				"d": data
			};
			var oModel = this.getOwnerComponent().getModel("MainService");
				if(navigator.onLine){
			oModel.create("/ZmatSet",createData,{
    		method: "POST",
    		success: function(data) {
    		MessageBox.success("The new Materail is created successfully",{
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
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf prokarma.view.view.materialCreate
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf prokarma.view.view.materialCreate
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf prokarma.view.view.materialCreate
		 */
		//	onExit: function() {
		//
		//	}

	});

});