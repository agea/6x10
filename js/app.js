$(document).ready(function () {

  var w = 200;
  var h = 250;
  var ratio = w / h;
  var speed = 50;

  var kbd = new window.keypress.Listener();

  var paper = Raphael("wrap");

  paper.setViewBox(0, 0, w, h);

  var $wrap = $('#wrap');
  var $window = $(window);

  var offset = {
    top: 0,
    left: 0
  };


  $('#bg').html(Trianglify({
    height: 3000,
    width: 3000,
    x_colors: 'YlOrBr',
    cell_size: 100 + Math.random() * 100
  }).canvas());

  function onResize() {
    var wratio = $window.width() / $window.height();
    $wrap.css({
      'margin-top': 0
    });
    if (wratio >= ratio) {
      $wrap.width($window.height() * ratio);
      $wrap.height($window.height());
      offset.top = 0;
      offset.left = ($window.width() - $wrap.width()) / 2;
    } else {
      $wrap.width($window.width());
      $wrap.height($window.width() / ratio);
      offset.left = 0;
      offset.top = ($window.height() - $wrap.height()) / 2;
      $wrap.css({
        'margin-top': offset.top + 'px'
      });

    }
  }

  onResize();

  $(window).resize(onResize);

  function getScale() {
    return paper._vbSize || (1 / paper._viewBoxShift.scale);
  }

  function vBox2Window(x, y) {
    var scale = getScale();
    return {
      x: offset.left + x / scale,
      y: offset.top + y / scale
    };
  }

  var rect = paper.rect(0, 0, 60, 100)
    .transform("T70,70")
    .attr("fill", "#ffffff")
    .attr("stroke-width", "0")
    .glow({
      color: '#ee963d',
      width: 24
    });

  paper.path(icons.help)
    .attr('stroke-width', '0')
    .attr('fill', '#ffffff')
    .transform("T179,-3S0.75,0.75");

  paper.circle(191, 9, 7)
    .attr('cursor', 'pointer')
    .attr('stroke-width', '0')
    .attr('fill', 'rgba(255,255,255,0)')
    .click(function () {
      $('#myModal').modal('toggle');
    });

  $.get('README.md', function (data) {
    $('.about-body')
      .html(new commonmark.HtmlRenderer()
        .render(new commonmark.Parser()
          .parse(data)
        )
      );
  })

  paper.path(icons.rotateCW)
    .attr('fill', '#000000')
    .transform("T73,183");

  paper.circle(85, 195, 14)
    .attr('cursor', 'pointer')
    .attr('stroke-width', '0')
    .attr('fill', 'rgba(255,255,255,0)')
    .click(rotateCW);

  paper.path(icons.rotateCCW)
    .attr('fill', '#000000')
    .transform("T103,183");

  paper.circle(115, 195, 14)
    .attr('cursor', 'pointer')
    .attr('stroke-width', '0')
    .attr('fill', 'rgba(255,255,255,0)')
    .click(rotateCCW);

  paper.path(icons.flipV)
    .attr('fill', '#000000')
    .transform("T73,223");

  paper.circle(85, 225, 14)
    .attr('cursor', 'pointer')
    .attr('stroke-width', '0')
    .attr('fill', 'rgba(255,255,255,0)')
    .click(flipV);

  paper.path(icons.flipH)
    .attr('fill', '#000000')
    .transform("T103,223");

  paper.circle(115, 225, 14)
    .attr('cursor', 'pointer')
    .attr('stroke-width', '0')
    .attr('fill', 'rgba(255,255,255,0)')
    .click(flipH);

  var blocks = [];

  blocks.push(paper.path('M0,0V40H10V20H20V10H10V0H0'));
  blocks.push(paper.path('M0,0V30H30V20H10V0H0'));
  blocks.push(paper.path('M0,0V20H30V0H20V10H10V0H0'));
  blocks.push(paper.path('M0,0V10H50V0H0'));
  blocks.push(paper.path('M0,10V30H10V20H20V10H30V0H10V10H0'));
  blocks.push(paper.path('M0,0V10H10V20H40V10H20V0H0'));
  blocks.push(paper.path('M0,10V20H10V30H20V20H30V10H20V0H10V10H0'));
  blocks.push(paper.path('M0,0V40H20V30H10V0H0'));
  blocks.push(paper.path('M0,0V20H20V30H30V10H10V0H0'));
  blocks.push(paper.path('M0,0V20H10V30H20V0H0'));
  blocks.push(paper.path('M0,0V10H10V30H20V10H30V0H0'));
  blocks.push(paper.path('M0,0V20H10V30H20V20H30V10H10V0H0'));

  function resetPositions() {
    blocks[0].transform("T10,10");
    blocks[1].transform("T10,60");
    blocks[2].transform("T10,110");
    blocks[3].transform("T10,160");
    blocks[4].transform("T10,210");

    blocks[5].transform("T60,10");
    blocks[6].transform("T110,10");
    blocks[7].transform("T160,10");

    blocks[8].transform("T160,60");
    blocks[9].transform("T160,110");
    blocks[10].transform("T160,160");
    blocks[11].transform("T160,210");
  }

  var transform = _.throttle(function (transform, element, origin) {
    element = element || selected;
    if (element.moving) {
      return;
    }

    element.moving = true;

    if (transform.indexOf("R") == 0) {
      var bb = element.getBBox();
      var ot = element.transform();
      element.transform(ot + transform);
      var bb2 = element.getBBox();
      transform = transform + "T" + (bb.x - bb2.x) + "," + (bb.y - bb2.y);
      element.transform(ot);
    }

    element.animate({
      transform: (origin || "...") + transform
    }, speed, 'easeOut', function () {
      element.moving = false;
      var bb = element.getBBox();
      if (bb.x<0){
        element.transform('...T' + (-bb.x) + ",0");
      }
      if (bb.x2>w){
        element.transform('...T' + (w-bb.x2) + ",0");
      }
      if (bb.y<0){
        element.transform('...T0,' + (-bb.y));
      }
      if (bb.y2>h){
        element.transform('...T0,' + (h-bb.y2));
      }
      checkSolved();

    });
  }, speed * .6);

  function checkSolved() {
    var bb = rect.getBBox();
    var scale = getScale();
    var cover = 0;

    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 10; j++) {
        var point = vBox2Window(bb.x + i * 10 + 5, bb.y + j * 10 + 5);
        var element = paper.getElementByPoint(point.x, point.y);
        if (blocks.indexOf(element) != -1) {
          cover++;
        }
      }
    }
    if (cover==60){

    }
  }

  function rotateCW() {
    selected.rotated = !selected.rotated;
    if (selected.flipped) {
      transform("R90");
    } else {
      transform("R-90");
    }
  }

  function rotateCCW() {
    selected.rotated = !selected.rotated;
    if (selected.flipped) {
      transform("R-90");
    } else {
      transform("R90");
    }
  }

  function flipV() {
    selected.flipped = !selected.flipped;
    if (!selected.rotated) {
      transform("S1,-1");
    } else {
      transform("S-1,1");
    }
  }

  function flipH() {
    selected.flipped = !selected.flipped;
    if (selected.rotated) {
      transform("S1,-1");
    } else {
      transform("S-1,1");
    }
  }

  _.each(blocks, function (block) {
    block.attr('cursor', 'pointer');
    block.mousedown(function () {
      select(blocks.indexOf(block));
    });

    block.drag(function (dx, dy) {
      var scale = getScale();

      var deltaX = ((dx - this.dx) * scale || 0);
      var deltaY = ((dy - this.dy) * scale || 0);

      transform("T" + parseInt(dx * scale / 10) * 10 + "," + parseInt(dy * scale / 10) * 10,
        this,
        this.dt);

      this.dx = dx;
      this.dy = dy;
    }, function () {
      this.dt = this.transform();
    }, function () {
      this.dx = undefined;
      this.dy = undefined;
    })
  });

  function select(i) {
    _.each(blocks, function (block) {
      block.attr("stroke", "#D2C187");
      block.attr("fill", "#AE5D0B");
      block.attr("stroke-width", "0.25");
    });
    blocks[i].attr("fill", "#FF9000");
    blocks[i].attr("stroke-width", "0");
    selected = blocks[i];
    selected.toFront();
  }

  resetPositions();
  select(0);

  kbd.simple_combo("w", function () {
    //select previous block
    select((blocks.indexOf(selected) + blocks.length + 1) % blocks.length)
  });

  kbd.simple_combo("q", function () {
    //select next block
    select((blocks.indexOf(selected) + blocks.length - 1) % blocks.length)
  });

  kbd.simple_combo("a", rotateCW);
  kbd.simple_combo("s", rotateCCW);
  kbd.simple_combo("z", flipV);
  kbd.simple_combo("x", flipH);

  kbd.simple_combo("up", function () {
    transform("T0,-10");
  });

  kbd.simple_combo("down", function () {
    transform("T0,10");
  });

  kbd.simple_combo("left", function () {
    transform("T-10,0");
  });

  kbd.simple_combo("right", function () {
    transform("T10,0");
  });

});
