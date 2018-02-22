sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";
   return Controller.extend("BasicFiori-Routing.controller.Detail", {
	   onOpenDialog : function () {
			this.getOwnerComponent().helloDialog.open(this.getView());
		}
   });
});