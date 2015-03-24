var GLSLCreator = (function(exports) {

   exports.Context = function(element) {
      this.context = element.getContext("2d");
      this.context.fillRect(0, 0, 100, 100);
   }

   return exports;

})(GLSLCreator || {});

