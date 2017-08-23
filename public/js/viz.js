/* globals Framework7 */
/* globals Dom7 */
(function(fj) {
'use strict';
  fj.showViz = function(post){
    var plot = d3.select('.canvas');

    let w = 1000, h = 1000;

    let allTagList = d3.entries(fj.groupTable);
    console.log(allTagList);
    let centerX = w/2, centerY = h/2, r = w/2 - 20;
    let angleStepSize = 2 * Math.PI/allTagList.length;
    let circle = plot.selectAll('circle')
      .data(allTagList)
      .enter();

    circle.append('circle')
      .attr('cx',function(d,i){return w/2 + Math.sin(angleStepSize * i) * r;})
      .attr('cy',function(d,i){return h/2 + Math.cos(angleStepSize * i) * r;})
      .attr('r',15)
      .style('fill',function(d){
        switch (d.value.group) {
          case 'environment':
            return '#8CC6ED';
          case 'food':
            return '#79C496';
          case 'feeling':
            return '#F7AC62';
          default:
            return 'black';
        }
        console.log(d);
      });

    let allSelectedTagList = d3.entries(post.tags);
    console.log(allSelectedTagList);
    allSelectedTagList.sort(function(a, b) {
      return a.value.seq - b.value.seq;
    });
    console.log(allSelectedTagList);
    allSelectedTagList.push(allSelectedTagList[0]);// aim to draw closed path

    let line = d3.line()
      .x(function(d) {
        return w/2 + Math.sin(angleStepSize * d.value.seq) * r;
      })
      .y(function(d) {
        return h/2 + Math.cos(angleStepSize * d.value.seq) * r;
      });

    circle.append('text')
      .data(allSelectedTagList)
      .attr('x',function(d,i){return w/2 + Math.sin(angleStepSize * d.value.seq) * r;})
      .attr('y',function(d,i){return h/2 + Math.cos(angleStepSize * d.value.seq) * r;})
      .text(function(d){return d.key;})
      .attr('font-size','2em');

    plot.append('path')
      .datum(allSelectedTagList)
      .attr('class', 'line')
      .attr('d', line)
      .style('fill','#dcdcdc')
      .style('fill-opacity',0.3)
      .style('stroke','#545454')
      .style('stroke-width','3px');
  }

})(window.fj = window.fj || {});
