/* globals Framework7 */
/* globals Dom7 */
(function(fj) {
'use strict';
  fj.showExploreViz = function(){
    var plot = d3.select('.canvas');

    let w = $(window).width(),
      h = w;
    $('.canvas').width(w).height(h);
    let start_drag_angle = 0;
    let drag_history_angle = 0; // Allow next draw to start from previous angles

    let allTagList = d3.entries(fj.groupTable);
    console.log(allTagList);
    let centerX = w/2, centerY = h/2, r = w/2 - 20;
    let angleStepSize = 2 * Math.PI/allTagList.length;
    let circle = plot.selectAll('circle')
      .data(allTagList)
      .enter();

    circle.append('circle')
      .attr('cx',function(d,i){return centerX + Math.sin(angleStepSize * i) * r;})
      .attr('cy',function(d,i){return centerY + Math.cos(angleStepSize * i) * r;})
      .attr('r',5)
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

      plot.call(d3.drag()
        .container(plot.node())
        .on('start', function() {
          let dx = 1.0 * d3.event.x - centerX;
          let dy = - 1.0 * d3.event.y + centerY;
          start_drag_angle = Math.atan2(dx, dy) + Math.PI;
          console.log("Start angle: ", start_drag_angle, d3.event.x, d3.event.y, centerX, centerY);
        })
        .on('drag', function() {
          let dx = 1.0 * d3.event.x - centerX;
          let dy = - 1.0 * d3.event.y + centerY;
          let angle = Math.atan2(dx, dy) + Math.PI ;
          let rotation = angle - start_drag_angle;

          console.log(d3.event.x, d3.event.y, dx, dy, angle, rotation);

          plot.selectAll('circle')
            .data(allTagList)
            .transition()
            .duration(10)
            .attr('cx', function(d, i) {
                let theta = angleStepSize * i;
                theta -= rotation;
                theta -= drag_history_angle;
                return centerX + r * Math.sin(theta);
            })
            .attr('cy', function(d, i) {
                let theta = angleStepSize * i;
                theta -= rotation;
                theta -= drag_history_angle;
                return centerY + r * Math.cos(theta);
            })
        })
        .on('end', function() {
          let dx = 1.0 * d3.event.x - centerX;
          let dy = - 1.0 * d3.event.y + centerY;
          let angle = Math.atan2(dx, dy) + Math.PI ;
          let rotation = angle - start_drag_angle;
          drag_history_angle += rotation;
        })
      );

    // var pointer = plot.append('rect')
    //   .attr('x',centerX)
    //   .attr('y', 0)
    //   .attr('width',5)
    //   .attr('height',20)
    //   .style('fill','red');
    var trianglePointer = d3.symbol()
      .type(d3.symbolTriangle)
      .size(80);
    plot.append('path')
      .attr('d', trianglePointer)
      .attr('stroke', 'black')
      .attr('fill','none')
      .attr("transform", function(d) {
        return "translate(" + centerX + "," + centerY * 1.96 + ")"
      });

    // let line = d3.line()
    //   .x(function(d) {
    //     return w/2 + Math.sin(angleStepSize * d.value.seq) * r;
    //   })
    //   .y(function(d) {
    //     return h/2 + Math.cos(angleStepSize * d.value.seq) * r;
    //   });

    // circle.append('text')
    //   .data(allSelectedTagList)
    //   .attr('x',function(d,i){return w/2 + Math.sin(angleStepSize * d.value.seq) * r;})
    //   .attr('y',function(d,i){return h/2 + Math.cos(angleStepSize * d.value.seq) * r;})
    //   .text(function(d){return d.key;})
    //   .attr('font-size','2em');
    //
    // plot.append('path')
    //   .datum(allSelectedTagList)
    //   .attr('class', 'line')
    //   .attr('d', line)
    //   .style('fill','#dcdcdc')
    //   .style('fill-opacity',0.3)
    //   .style('stroke','#545454')
    //   .style('stroke-width','3px');
  }

})(window.fj = window.fj || {});
