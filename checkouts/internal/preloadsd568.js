
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com","https://extensions.shopifycdn.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.CgsWKOqO.js","/cdn/shopifycloud/checkout-web/assets/c1/app.3r-QFN-T.js","/cdn/shopifycloud/checkout-web/assets/c1/esnext-vendor.BU5-C5RZ.js","/cdn/shopifycloud/checkout-web/assets/c1/browser.-G55oGBd.js","/cdn/shopifycloud/checkout-web/assets/c1/FullScreenBackground.CFegFo2o.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-PaymentSessionMutation.Ci3hK8Gx.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-shop-discount-offer.DdO-7AzM.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-alternativePaymentCurrency.CUTZpdfN.js","/cdn/shopifycloud/checkout-web/assets/c1/consent-manager-shared.CnnexcNO.js","/cdn/shopifycloud/checkout-web/assets/c1/business-customer-BusinessCustomerShippingAddressManager.6NE0hugY.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUnauthenticatedErrorModal.DuSJSiRl.js","/cdn/shopifycloud/checkout-web/assets/c1/CaptureEvents-ButtonWithRegisterWebPixel.ChRj_lZQ.js","/cdn/shopifycloud/checkout-web/assets/c1/events-shared.xk3PqPtY.js","/cdn/shopifycloud/checkout-web/assets/c1/images-flag-icon.C_eXYJRt.js","/cdn/shopifycloud/checkout-web/assets/c1/images-payment-icon.D2Fpq5Mq.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.Bh-E6-Un.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage.D2D4WM_H.js","/cdn/shopifycloud/checkout-web/assets/c1/MarketsProDisclaimer.hjyyrOON.js","/cdn/shopifycloud/checkout-web/assets/c1/CrossBorderConsolidation.DFgZJly6.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useSubscribeMessenger.0HH2NQjb.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useSuppressShopPayModalOnLoad.B6pdNT18.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useHasOrdersFromMultipleShops.SDngVQMv.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayLogo.CSfh6_C6.js","/cdn/shopifycloud/checkout-web/assets/c1/VaultedPayment.DPEMXEmk.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingGroupsSummaryLine.-giovg9s.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview.GZMeDmNc.js","/cdn/shopifycloud/checkout-web/assets/c1/PickupPointCarrierLogo.BUKn6Mes.js","/cdn/shopifycloud/checkout-web/assets/c1/AutocompleteField-hooks.rUsL7EvV.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField.WjzZ61gI.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer.DAJOYlXN.js","/cdn/shopifycloud/checkout-web/assets/c1/RememberMeDescriptionText.COeyfY5x.js","/cdn/shopifycloud/checkout-web/assets/c1/MobileOrderSummary.BEFPwZfL.js","/cdn/shopifycloud/checkout-web/assets/c1/OrderEditVaultedDelivery.CFEqCtXk.js","/cdn/shopifycloud/checkout-web/assets/c1/SeparatePaymentsNotice.BHacIpJ6.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblems-StockProblemsLineItemList.rmuKPHQJ.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-cash-constants.DputEnFZ.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayPaymentRequiredMethod.COhANLvC.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown.DbfsgyGa.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal.CXtYolz7.js","/cdn/shopifycloud/checkout-web/assets/c1/extension-targets-shipping-options.BmSK4I2H.js","/cdn/shopifycloud/checkout-web/assets/c1/DutyOptions.BjV9whA6.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingMethodSelector.BUS1YzdB.js","/cdn/shopifycloud/checkout-web/assets/c1/SubscriptionPriceBreakdown.CDpDFsZG.js","/cdn/shopifycloud/checkout-web/assets/c1/component-RuntimeExtension.7UCgp64I.js","/cdn/shopifycloud/checkout-web/assets/c1/AnnouncementRuntimeExtensions.Cx50Vd_q.js","/cdn/shopifycloud/checkout-web/assets/c1/extension-targets-rendering-extension-targets.B3_PPMiM.js","/cdn/shopifycloud/checkout-web/assets/c1/esm-browser-v4.BKrj-4V8.js","/cdn/shopifycloud/checkout-web/assets/c1/ExtensionsInner.DwzOCVZ0.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.CfAhKPz4.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/FullScreenBackground.CfHxiIwO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ButtonWithRegisterWebPixel.CU099GPu.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/shared.CEMlQpma.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.CtwmLt0f.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/CrossBorderConsolidation.CvXXnYCy.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/LocalizationExtensionField.BGO83eR3.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.Cko1fUoG.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OrderEditVaultedDelivery.CSQKPDv7.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useSubscribeMessenger.BrcQzLuH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/DutyOptions.LcqrKXE1.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VaultedPayment.OxMVm7u-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PickupPointCarrierLogo.cbVP6Hp_.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.D6OuIVjc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethodSelector.B0hio2RO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SubscriptionPriceBreakdown.BSemv9tH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RuntimeExtension.DWkDBM73.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/AnnouncementRuntimeExtensions.V0VYEO4K.css"];
      var fontPreconnectUrls = ["https://cdn.shopify.com"];
      var fontPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0631/8214/3667/files/universregular-webfont.woff?v=1747336141"];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0631/8214/3667/files/skylrk-glassy_3_2_x320.png?v=1770937099"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  