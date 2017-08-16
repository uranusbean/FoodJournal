/* globals Framework7 */
/* globals Dom7 */
(function(fj) {
'use strict';
  fj.showViz = function(){
    var plot = d3.select('.canvas');

    let w = 1000, h = 1000;

    let allTagList = d3.entries(fj.groupTable);
    let centerX = w/2, centerY = h/2, r = w/2 - 20;
    let angleStepSize = 2 * Math.PI/allTagList.length;

    plot.selectAll('circle')
      .data(allTagList)
      .enter()
      .append('circle')
      .attr('cx',function(d,i){return w/2 + Math.sin(angleStepSize * i) * r;})
      .attr('cy',function(d,i){return h/2 + Math.cos(angleStepSize * i) * r;})
      .attr('r',5);
  }




})(window.fj = window.fj || {});
