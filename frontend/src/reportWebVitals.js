/*
Inside the function, there is a check to ensure that onPerfEntry is both provided and is indeed
 a function. If this condition is met, the code dynamically imports the web-vitals library using 
 JavaScript's import() function. This approach ensures that the library is only loaded when needed, 
 which can help reduce the initial bundle size and improve page load times.
*/

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

//Once the web-vitals module is loaded, the code destructures several functions from it
// getCLS, getFID, getFCP, getLCP, and getTTFB. These functions correspond to different 
// web performance metrics: Cumulative Layout Shift (CLS), First Input Delay (FID), First 
// Contentful Paint (FCP), Largest Contentful Paint (LCP), and Time to First Byte (TTFB). 
// Each of these functions is then called with onPerfEntry as an argument, which means that
//  whenever a metric is measured, the provided callback will be invoked with the results.