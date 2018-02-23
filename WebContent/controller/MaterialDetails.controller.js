sap.ui.define([
	"BasicFiori-Routing/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("BasicFiori-Routing.controller.MaterialDetails", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BasicFiori-Routing.WebContent.view.MaterialDetails
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("materialDetails").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

		},
		_onObjectMatched: function(oEvent) {
			this.setModel(this.getOwnerComponent().getModel("selectedMaterial"), "selectedMaterial");
		},
		
		onNavBack:function(){
			var that = this;
			if(this.getView().byId("saveButtonId").getVisible()){
				MessageBox.warning("The Unsaved Data will be lost. Do you want to Continue",{
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					onClose: function(sAction) {
						if(sAction === "OK"){
						that.onEditButtonPress();	
						that.getRouter().navTo("material");
						}
					}
				});
			}else{
			that.getRouter().navTo("material");	
			}	
		},
		
		onCancelButtonPress:function(){
			this.onEditButtonPress();
			this._onObjectMatched();
		},

		onEditButtonPress: function() {
			this.getView().byId("priceId").setEditable(!this.getView().byId("priceId").getEditable());
			this.getView().byId("typeId").setEditable(!this.getView().byId("typeId").getEditable());
			this.getView().byId("QuantityId").setEditable(!this.getView().byId("QuantityId").getEditable());
			this.getView().byId("DescriptionId").setEditable(!this.getView().byId("DescriptionId").getEditable());
			this.getView().byId("editButtonId").setVisible(!this.getView().byId("editButtonId").getVisible());
			this.getView().byId("saveButtonId").setVisible(!this.getView().byId("saveButtonId").getVisible());
			this.getView().byId("cancelButtonId").setVisible(!this.getView().byId("cancelButtonId").getVisible());
			this.getView().byId("DeleteButtonId").setVisible(!this.getView().byId("DeleteButtonId").getVisible());
		},
		onSaveButtonPress: function() {
			var that = this;
			var material = this.getView().byId("materialId").getValue();
			var desc = this.getView().byId("DescriptionId").getValue();
			var price = this.getView().byId("priceId").getValue();
			var type = this.getView().byId("typeId").getValue();
			var quantity = this.getView().byId("QuantityId").getValue();
			var unit = this.getView().byId("unitId").getText();
			var data = {
				"Material": material,
				"Price": price,
				"Description": desc,
				"Type": type,
				"Quantity": quantity,
				"Unit":unit
			};
			var updateData = {
				"d": data
			};
			var oModel = this.getOwnerComponent().getModel("MainService");
			if(navigator.onLine){
			oModel.update("/ZmatSet('" + material + "')", updateData, {
				method: "PUT",
				success: function(data) {
					MessageBox.success("The Materail Updated successfully",{
					onClose: function(sAction) {
							that.onEditButtonPress();
					}
				});
			
				//need to call reload the page with proper data
				},
				error: function(e) {
				MessageBox.error(e.message);
				}
			});
			}

		},
		
		onDeleteButtonPress:function(){
			var that = this;
			var material = this.getView().byId("materialId").getValue();
	var oModel = this.getOwnerComponent().getModel("MainService");
	oModel.remove("/ZmatSet('"+material+"')", {
    method: "DELETE",
    success: function(data) {
    	MessageBox.success("The Materail deleted successfully",{
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
	

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BasicFiori-Routing.WebContent.view.MaterialDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BasicFiori-Routing.WebContent.view.MaterialDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BasicFiori-Routing.WebContent.view.MaterialDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});