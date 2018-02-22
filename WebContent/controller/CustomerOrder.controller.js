sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
	"BasicFiori-Routing/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, History, JSONModel, formatter, Filter, FilterOperator, MessageToast) {
	"use strict";
	return Controller.extend("BasicFiori-Routing.controller.CustomerOrder", {
        formatter: formatter,
		onInit: function () {
            
            //this.oVizFrame = this.getView().byId("idcolumn");
            
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("customerOrder").attachPatternMatched(this._onObjectMatched, this);
           
           	
		},
		_onObjectMatched: function (oEvent) {
            
            
            
            var sPath = oEvent.getParameter("arguments").orderDetailsPath;
			var sContext = "/" + sPath.split('=').join("/");
            
            var ordersModel = this.getOwnerComponent().getModel("Orders");
            var ordersData = ordersModel.getData();
            this.ordersData = ordersModel.getData();
            
            var pathSplit = sPath.split('=');
            var orderIndex = pathSplit[1];
            
            var orderDetailsArray = ordersModel.getData().CustomerOrders[orderIndex];
            orderDetailsArray.orderCount = orderDetailsArray.OrderDetails.length;
            orderDetailsArray.stepStatus = "All";
            
            
            var orderDetailsModel = new JSONModel(orderDetailsArray);
            this.getOwnerComponent().setModel(orderDetailsModel, "OrderDetails"); 
            
              var oVizFrame = this.getView().byId("idcolumn");
            oVizFrame.destroyFeeds();
            
            
            //                3. Create Viz dataset to feed to the data to the graph
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions : [{
                    name : 'ProductId',
                    value : "{ProductId}"
                }],

                measures : [{
                    name : 'UnitPrice',
                    value : '{UnitPrice}'
                } ],

                data : {
                    path : "OrderDetails>/OrderDetails"
                }
            });
            //oVizFrame.destroyFeed();  // use this before dataset
            oVizFrame.setDataset(oDataset);
            oVizFrame.setModel(orderDetailsModel);
            oVizFrame.setVizType('column');

            //                4.Set Viz properties
            oVizFrame.setVizProperties({
                plotArea: {
                colorPalette : d3.scale.category20().range()
            }});

            var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["UnitPrice"]
            });
            var feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["ProductId"]
            });
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedCategoryAxis);
            
            
            
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("customerDetails", this.ordersData.Orders.CustomerId);
			}
		},
        
        handleIconTabBarSelect : function(oEvent){
            var sCurrentStepNo = oEvent.getParameter('key');
            this.getOwnerComponent().getModel("OrderDetails").setProperty("/stepStatus", sCurrentStepNo);
        }
	
	});
});