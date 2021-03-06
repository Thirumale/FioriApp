sap.ui.define([], function() {
	"use strict";

	return {

		statusText: function(sStatus) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			switch (sStatus) {
				case "A":
					return oResourceBundle.getText("invoiceStatusA");
				case "B":
					return oResourceBundle.getText("invoiceStatusB");
				case "C":
					return oResourceBundle.getText("invoiceStatusC");
				default:
					return sStatus;
			}
		},
		currencyValue: function(sValue) {
			if (!sValue) {
				return "";
			}

			return "$ " + parseFloat(sValue).toFixed(0);
		},
		emptyMId: function(sValue) {
			if (typeof sValue === "undefined") {
				return "Created In Offline";
			} else {
				return sValue;
			}
		},
		onlineFormaterType: function(sValue) {
			if (sValue === "Online") {
				return "Accept";
			} else {
				return "Reject";
			}
		},
		currencyValueEdit: function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(0);
		},
		formatDate: function(v) {
			if (v) {
				var date = v.substring(6, v.length - 2);
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd-MM-YYYY"
				});
				//console.log("v", new Date(parseInt(date)));
				return oDateFormat.format(new Date(parseInt(date)));
			} else {
				return "";
			}

		},

		totalPriceCalculation: function(unitPrice, discount, quantity) {
			var totalPrice = unitPrice * quantity;
			var totalPrice = totalPrice - (totalPrice * discount);
			return totalPrice;
		}
	};
});