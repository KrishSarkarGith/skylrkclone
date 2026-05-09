(function() {
  const BASE_URL = `https://cdn-odl.avada.io/scripttag`;
  // const BASE_URL = `https://avada-order-limit.firebaseapp.com/scripttag`;
  // const BASE_URL = `https://avada-order-limit-staging.firebaseapp.com/scripttag`;

  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.async = !0;
  scriptElement.src = BASE_URL + `/avada-order-limit.min.js?v=${new Date().getTime()}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(scriptElement, firstScript);
})();
