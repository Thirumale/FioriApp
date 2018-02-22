sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"BasicFiori-Routing/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("BasicFiori-Routing.controller.InvoiceList", {

		formatter: formatter,

		onInit: function () {
			/*var oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");*/
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
			var sPath = oItem.getBindingContext("customer").getPath().split("/")
            var C_ID = oEvent.getSource().getBindingContext("customer").getProperty("Id");
            /*$.ajax({
                'url' : "http://northwind.servicestack.net/customers/"+C_ID+"?format=json",
                'type' : 'GET',
                'data' : "",
                'success' : function(data) {   
                    //console.log("data:"+JSON.stringify(data.CustomerOrders))
                    var oCustomerModel = new JSONModel(data);
			        sap.ui.getCore().setModel(oCustomerModel, "Orders");
                    console.log(oCustomerModel)
                },
                'error' : function(request,error)
                {
                    alert("Request: "+JSON.stringify(request));
                }
    
            });*/
			oRouter.navTo("customerDetail", {
				customerId: 	sPath[1] +"="+ C_ID
			});
		}
	});

});