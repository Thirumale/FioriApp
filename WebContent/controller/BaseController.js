/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"BasicFiori-Routing/model/formatter"
], function(Controller, History, MessageToast, formatter) {
	"use strict";

	return Controller.extend("BasicFiori-Routing.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		 onInit:function(){
		 	this.offlineInterval, this.onlineInterval;
		 },
		formatter: formatter,
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		setOfflineData: function(name, data) {
			localStorage.setItem(name, JSON.stringify(data));
			return true;
		},
		setofflineTimer: function(name, clbk) {
			clearInterval(name);
			name = setInterval(function() {
				clbk();
			}, 3000);
		},
		hideBusyIndicator: function() {
			sap.ui.core.BusyIndicator.hide();
		},

		showBusyIndicator: function(iDelay) {
			sap.ui.core.BusyIndicator.show(iDelay);
		},
		syncData: function() {
			var that = this;
			var oModel = that.getOwnerComponent().getModel("MainService");
			that.showBusyIndicator(0);
			var offlineData = that.getOfflineData("offline");
			$.each(offlineData, function(i, offlinedata) {
				if (offlinedata.type === "C") {
					function creatCall() {
						var MaterialDesc = offlinedata.data.d.Description;
						oModel.create(offlinedata.url, offlinedata.data, {
							method: "POST",
							success: function(data) {
								that.showToster("Material '" + MaterialDesc + "' Is created");

							},
							error: function(e) {
								that.showToster("Material '" + MaterialDesc + "' Is failed to created");
							},async: true
						});
					}
					setTimeout(creatCall, 1000);
				}
			});
			return true;

		},
		getOfflineData: function(name) {
			return JSON.parse(localStorage.getItem(name));
		},
		setConnection: function() {
			var that = this;
			if (navigator.onLine) {
				that.getOwnerComponent().getModel("device").getData().connected = "Online";
				setTimeout(function() {
					$("header").removeClass("offline");
				}, 1000);
			} else {
				that.getOwnerComponent().getModel("device").getData().connected = "Offline";
				setTimeout(function() {
					$("header").addClass("offline");
				}, 1000);
			}
			that.getOwnerComponent().getModel("device").refresh(true);

		},
		showToster: function(msg) {
			return MessageToast.show(msg, {
				duration: 3000, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center center", // default
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: false // default
			});
		},
		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			//oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}

	});

});