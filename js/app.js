var kbd = new window.keypress.Listener();

var paper = Raphael(0, 0, 220, 270);

var blocks = [];

blocks.push({path:paper.path('M0,0V40H10V20H20V10H10V0H0'),rot:0});
blocks.push({path:paper.path('M0,0V30H30V20H10V0H0'),rot:0});
blocks.push({path:paper.path('M0,0V20H30V0H20V10H10V0H0'),rot:0});
blocks.push({path:paper.path('M0,0V20H10V30H20V20H30V10H10V0H0'),rot:0});
blocks.push({path:paper.path('M0,0V40H20V30H10V0H0'),rot:0});
blocks.push({path:paper.path('M0,10V30H10V20H20V10H30V0H10V10H0'),rot:0});
blocks.push({path:paper.path('M0,0V10H10V20H40V10H20V0H0'),rot:0});
blocks.push({path:paper.path('M0,10V20H10V30H20V20H30V10H20V0H10V10H0'),rot:0});
blocks.push({path:paper.path('M0,0V20H20V30H30V10H10V0H0'),rot:0});
blocks.push({path:paper.path('M0,0V20H10V30H20V0H0'),rot:0});
blocks.push({path:paper.path('M0,0V10H10V30H20V10H30V0H0'),rot:0});
blocks.push({path:paper.path('M0,0V10H50V0H0'),rot:0});

function resetPositions() {
  blocks[0].path.transform("T10,10");
  blocks[1].path.transform("T10,60");
  blocks[2].path.transform("T10,110");
  blocks[3].path.transform("T10,160");
  blocks[4].path.transform("T10,210");

  blocks[5].path.transform("T60,10");
  blocks[6].path.transform("T110,10");
  blocks[7].path.transform("T160,10");

  blocks[8].path.transform("T160,60");
  blocks[9].path.transform("T160,110");
  blocks[10].path.transform("T160,160");
  blocks[11].path.transform("T160,210");
}


function resetBlocks() {
  _.each(blocks, function (block) {
    block.path.attr("stroke", "#ff9000");
    block.path.attr("fill", "#ffffff");
    block.path.attr("stroke-width", "1");
  });
}


var rect = paper.rect(0, 0, 60, 100);

rect.transform("T70,70");
rect.attr("fill", "#ffffff");
rect.attr("stroke", "#000000");
rect.attr("stroke-width", "1");

var selected = blocks[0];

function select(i) {
  resetBlocks();
  blocks[i].path.attr("fill", "#ff9000");
  blocks[i].path.attr("stroke-width", "0");
  selected = blocks[i];
}

resetPositions();
resetBlocks();
select(0);

kbd.simple_combo("w", function () {
  //select previous block
  select((blocks.indexOf(selected)+blocks.length+1)%blocks.length)
});

kbd.simple_combo("q", function () {
  //select next block
  select((blocks.indexOf(selected)+blocks.length-1)%blocks.length)
});

kbd.simple_combo("a", function () {
  //rotate counterclockwise
  selected.rot+=270;
  selected.path.transform("r"+selected.rot)
});

kbd.simple_combo("s", function () {
  //rotate clockwise
  selected.rot+=90;
  selected.path.transform("r"+selected.rot)
});


