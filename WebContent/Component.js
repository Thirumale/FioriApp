sap.ui.define([
               "sap/ui/core/UIComponent",
               "sap/ui/model/json/JSONModel",
               "sap/ui/model/resource/ResourceModel",
               "BasicFiori-Routing/model/models",
          
               ], function (UIComponent, JSONModel, ResourceModel,models) {
	"use strict";
	return UIComponent.extend("BasicFiori-Routing.Component", {
		metadata : {
//			rootView: "BasicFiori-Routing.view.App",
			manifest: "json"
		},
		init : function () {
			// call the init function of the parent
            var that= this;
			UIComponent.prototype.init.apply(this, arguments);
		
				// set the device model
				this.setModel(models.createDeviceModel(), "device");
			// set data model on view
			   var oData = {
					   recipient : {
						   name : "Worldly ppl"
					   }
			   };
            		 
            /*var oModel = new sap.ui.model.odata.v2.ODataModel("http://services.odata.org/Northwind/Northwind.svc/");	
            function mySuccessHandler(data){
                 var oInvoiceModel = new JSONModel({"Customers":data.results});
			         that.setModel(oInvoiceModel, -);
            }
            function myErrorHandler(e){
                console.log(e)
            }
            oModel.read("/Customers", {success: mySuccessHandler, error: myErrorHandler});*/
			   /*var oModel = new JSONModel(oData);
			   this.setModel(oModel);
			   */
			   // set invoice model - local
			   var oConfig = this.getMetadata().getConfig();
			   var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
          /*  
             $.ajax({
                'url' : oConfig.invoiceLocal,
                'type' : 'GET',
                'data' : "",
                'success' : function(data) {              
                    var oInvoiceModel = new JSONModel(data);
			         that.setModel(oInvoiceModel, "customer");
                },
                'error' : function(request,error)
                {
                    alert("Request: "+JSON.stringify(request));
                }
            });*/
			   
			   // set i18n model on view
			   var i18nModel = new ResourceModel({
				   bundleName: "BasicFiori-Routing.i18n.messageBundle"
			   });
			   this.setModel(i18nModel, "i18n");
		
			   //Router
			// create the views based on the url/hash
				this.getRouter().initialize();
				
				//First time when no category is selected, default welcome page should be displayed
				//navigate to initial page for !phone
				if (!sap.ui.Device.system.phone) {
					this.getRouter().getTargets().display("welcome");
				}
			   
			
		}
	});
});