sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
	"BasicFiori-Routing/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, History, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("BasicFiori-Routing.controller.CustomerDetail", {
        formatter: formatter,
		onInit: function () {
            
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("customerDetail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			var that = this;
            var sPath = oEvent.getParameter("arguments").customerId;
            var pathSplit = sPath.split('=');
            var C_ID = pathSplit[1];
            
              $.ajax({
                'url' : "http://northwind.servicestack.net/customers/"+C_ID+"?format=json",
                'type' : 'GET',
                'data' : "",
                'success' : function(data) {   
                    //console.log("data:"+JSON.stringify(data.CustomerOrders))
                    
                    data.orderDetailsCount = data.CustomerOrders.length;
                    data.stepStatus = "All";
                    var oCustomerModel = new JSONModel(data);
			        that.getOwnerComponent().setModel(oCustomerModel, "Orders");
                    
                    var oVizFrame = that.getView().byId("idpiechart");
                    oVizFrame.destroyFeeds();


                    //3. Create Viz dataset to feed to the data to the graph
                    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                        dimensions : [{
                            name : 'Id',
                            value : "{Order/Id}"
                        }],

                        measures : [{
                            name : 'Freight',
                            value : '{Order/Freight}'
                        } ],

                        data : {
                            path : "Orders>/CustomerOrders"
                        }
                    });
                    //oVizFrame.destroyFeed();  // use this before dataset
                    oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oCustomerModel);
                    //      4.Set Viz properties
                    oVizFrame.setVizProperties({
                        title:{
                            text : "Charges Paid(Freight)"
                        },
                        plotArea: {
                            colorPalette : d3.scale.category20().range(),
                            drawingEffect: "glossy"
                            }});

                    var feedSize = new sap.viz.ui5.controls.common.feeds.FeedItem({
                          'uid': "size",
                          'type': "Measure",
                          'values': ["Freight"]
                        }), 
                        feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
                          'uid': "color",
                          'type': "Dimension",
                          'values': ["Id"]
                        });
                    oVizFrame.addFeed(feedSize);
                    oVizFrame.addFeed(feedColor);
                },
                'error' : function(request,error)
                {
                    alert("Request: "+JSON.stringify(request));
                }
    
            });
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}
		},
        onFilterInvoices : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ContactName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("invoiceList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		onPress: function (oEvent) {
            var that = this;
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var sPath = oItem.getBindingContext("Orders").getPath().split("/")
			oRouter.navTo("customerOrder", {
				orderDetailsPath: sPath[1] + "=" + sPath[2]
			});
		},
        
        handleIconTabBarSelect : function(oEvent){
            var sCurrentStepNo = oEvent.getParameter('key');
            this.getOwnerComponent().getModel("Orders").setProperty("/stepStatus", sCurrentStepNo);
        }
	});
});
