let w = 400,
  h = 200;
let padding={
  top:30,
  right:30,
  bottom:30,
  left:30
};
// let padding = {
//   top: 100,
//   right: 200,
//   bottom: 100,
//   left: 100
// };
let width = w - padding.left - padding.right;
let height = h - padding.top - padding.bottom;



//-----------------------------------------------Draw histogram---------------------------------------------------//
function drawhistogram() {

  $('.buttons').remove();
  $('#slider-distance').remove();
  $('#histogram').remove();
  var ul = document.getElementById("recipelist");
  if (ul != null){
    c = ul.children;
    var cidx = 0,
        cnum = c.length;
    while (cidx < cnum) {
      c[0].remove();
      cidx ++;
    };
  }

  var $histarea = $("#histogram-area");
  $("<div>").addClass("buttons").attr("style","display:flex;justify-content: space-between;width: 90%; margin-left: 5%;").appendTo($histarea).appendTo($histarea);
  var slidertotal = $("<div slider>").attr("id", "slider-distance").appendTo($histarea);
  var slidebar = $("<div>").appendTo(slidertotal);
  $("<div inverse-left>").attr("style", "width:70%;").appendTo(slidebar);
  $("<div inverse-right>").attr("style", "width:70%;").appendTo(slidebar);
  $("<div range>").attr("style", "left:00%;right:00%;").appendTo(slidebar);
  $("<span thumb>").attr("style", "left:0%;").appendTo(slidebar);
  $("<span thumb>").attr("style", "left:100%;").appendTo(slidebar);
  $("<div sign>").attr("style", "left:0%;").appendTo(slidebar)
    .append($("<span>").attr("id", "value1").text("0"));
  $("<div sign>").attr("style", "left:100%;").appendTo(slidebar)
    .append($("<span>").attr("id", "value2").text("100"));
  var slider1 = `var rightslider = this.parentNode.childNodes[2];
                this.value=Math.min(this.value,rightslider.value-1);
                var value=(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.value)-(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.min);
                var children = this.parentNode.childNodes[0].childNodes;
                children[0].style.width=value+'%';
                children[2].style.left=value+'%';
                children[3].style.left=value+'%';
                children[5].style.left=value+'%';
                children[5].childNodes[0].innerHTML=this.value;`
  var slider2 = `var leftslider = this.parentNode.childNodes[1];
                this.value=Math.max(this.value,leftslider.value-(-1));
                var value=(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.value)-(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.min);
                var children = this.parentNode.childNodes[0].childNodes;
                children[1].style.width=(100-value)+'%';
                children[2].style.right=(100-value)+'%';
                children[4].style.left=value+'%';
                children[6].style.left=value+'%';
                children[6].childNodes[0].innerHTML=this.value;`
  $("<input>").attr("id", "slider-1").attr("max", "100").attr("min", "0")
    .attr("oninput", slider1).attr("step", "1").attr("tabindex", "0")
    .attr("type", "range").attr("value", "0")
    .appendTo(slidertotal);
  $("<input>").attr("id", "slider-2").attr("max", "100").attr("min", "0")
    .attr("oninput", slider2).attr("step", "1").attr("tabindex", "0")
    .attr("type", "range").attr("value", "100")
    .appendTo(slidertotal);
  // $("<div>").attr("id","recommendation-area").appendTo($histarea)

  //--------------------------------------Set up Canvas-------------------------------------------------------------//

  d3.select('#histogram-area').append('div').attr('id', 'histogram');

  d3.json('/get_stats').then(function(data) {
    data = data['data']
    console.log(data)
    data = JSON.parse(data)
    // console.log(data.slice(1, 5))
    var labels = ["rating","Calories (kcal)","Carbohydrates (g)","Protein (g)","Total fat (g)"];
    var displaylabels = ["Rating","Calories","Carbohydrate","Protein","Fat"];
    //
    // let labels = Object.keys(data[0]).filter(function(d) {
    //   return d !== 'Name'
    // });
    // console.log('properties includes:', labels)

    //---------------------------------------------Add Statistic Button----------------------------------------//

    labels = d3.select('div.buttons')
      .selectAll('input[name="statistics]"')
      .data(labels)
      .enter()
      .append('label')
    labels.attr('transform', 'translate(' + 100 + ',0)')
    let inputs = labels
      .append('input')
      .attr('id', type => (type + '-button'))
      .attr('class', 'statisticInput')
      .attr('name', 'statistics')
      .attr('type', 'radio')
      .attr('value', function(d) {
        return d
      })
      .on('click', function(){
        updateHistogram(this.value, data);
        handleSliderChange(data);
        })
      .append('text').text(function(d) {
        return d
      })
    labels.append('text').text(function(d,i) {
      return displaylabels[i]
    })

    document.getElementById('rating-button').setAttribute('checked', 'true')

    // Set default status
    createHistogram('rating', data);
    handleSliderChange(data);
    d3.select('#slider-1').on('change', function(){handleSliderChange(data)})
    d3.select('#slider-2').on('change', function(){handleSliderChange(data)})
    let initialRecipeList = getRecipeList(data,'Rating', '0', '100', 5)
    displayRecipeList(initialRecipeList)

  });
};

function createHistogram(statisticType, values) {
  console.log(statisticType)
  console.log(values)
  values = values.map(function(d) {
    return d[statisticType]
  })

  let svg = d3
    .select('#histogram')
    .append('svg')
    .attr('id', 'myHistogram')
    .attr('width', w)
    .attr('height', h);

  let histogram = d3.histogram();
  let bins = histogram(values);

  // Create scale
  let maxPoint = d3.max(values);
  let minPoint = d3.min(values);
  let maxCount = d3.max(bins, function(d) {
    return d.length;
  });
  let maxCountBin = bins.reduce(function(a, b) {
    if (a.length >= b.length) {
      return a;
    } else {
      return b;
    }
  });
  let xScale = d3.scaleLinear().domain([minPoint, maxPoint]).range([0, width]);
  let yScale = d3.scaleLinear().range([height, 0]).domain([0, maxCount]);

  svg
    .selectAll('rect')
    .data(bins)
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return padding.left + xScale(d.x0);
    })
    .attr('transform', function(d) {
      return 'translate(0,' + (yScale(d.length) + padding.top) + ')';
    })
    .attr('width', function(d) {
      return xScale(d.x1) - xScale(d.x0) - 1;
    })
    .attr('height', function(d) {
      return height - yScale(d.length);
    })
    .style('fill', '#fec44f');

  svg
    .append('text')
    .text(maxCount)
    .attr('class', 'data-label')
    .attr('x', padding.left + xScale(maxCountBin.x0) + w / 100)
    .attr('y', padding.top + yScale(maxCount) - h / 100);

  //Add chart title
  // svg
  //   .append('text')
  //   .text(statisticType + ' Distribution Histogram')
  //   .attr('class', 'chart-title')
  //   .attr('x', padding.left - 30)
  //   .attr('y', padding.top / 2);

  // Add Axes
  let xAxis = d3.axisBottom(xScale).ticks(bins.length + 1)
  svg.append('g').call(xAxis)
    .attr('transform', 'translate(' + padding.left + ',' + (height + padding.top) + ')')

  let yAxis = d3.axisLeft(yScale)
  // svg.append('g')
  //   .call(yAxis)
  //   .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
  // svg.append('text')
  //   .text('Count')
  //   .attr('class', 'axis-label')
  //   .attr('x', padding.left / 2)
  //   .attr('y', padding.top + height / 2)
  //   .attr('transform', 'rotate(-90,' + (padding.left / 2) + ',' + (padding.top + height / 2) + ')')

  svg.append('text')
    .text('Stat')
    .attr('class', 'axis-label')
    .attr('x', padding.left + width / 2)
    .attr('y', padding.top + height + 40)


  // Add filter triangle
  let triangle = d3.symbol().type(d3.symbolTriangle).size(50)

  svg.append('g')
    .selectAll('.filter-triangle')
    .data([minPoint, maxPoint])
    .enter()
    .append('path')
    .attr('d', triangle)
    .attr('class', 'filter-triangle')
    .style('fill', 'black')
    .attr('transform', function(d) {
      let x_transform = padding.left + (xScale(d))
      let y_transform = padding.top + height + 6
      return 'translate(' + x_transform + ',' + y_transform + ')'
    })
}

function updateHistogram(statType, values) {
  d3.select('#myHistogram').remove();
  createHistogram(statType, values);

  // update sliders
  $("[inverse-left]")[0].setAttribute("style", "left:0%;");
  $("[inverse-right]")[0].setAttribute("style", "right:0%;");
  $("[range]")[0].setAttribute("style","left:0%;right:0%");
  thumbs = $("[thumb]");
  thumbs[0].setAttribute("style", "left:0%;");
  thumbs[1].setAttribute("style", "left:100%;");
  signs = $("[sign]");
  signs[0].setAttribute("style", "left:0%;");
  signs[1].setAttribute("style", "left:100%;");
  signs[0].getElementsByTagName('span')[0].innerHTML = '0';
  signs[1].getElementsByTagName('span')[0].innerHTML = '100';
  $('#slider-1')[0].value = '0';
  $('#slider-2')[0].value = '100';
  //
  // $("<div sign>").attr("style", "left:100%;").appendTo(slidebar)
  //   .append($("<span>").attr("id", "value2").text("100"));
}

function filterHistogram(data,statType, lowerLimit, upperLimit) {
  console.log(statType + ';' + lowerLimit + ';' + upperLimit)
  let selectedValues = data.map(d => (d[statType]))
  console.log(d3.max(selectedValues))
  let histogram = d3.histogram();
  let bins = histogram(selectedValues)


  d3.selectAll('rect').data(bins).transition()
    .style('opacity',function(bin) {
      if (bin.x1 > upperLimit) {
        return 0.3 // Grey color
      } else if (bin.x0 < lowerLimit) {
        return 0.3
      } else {
        return 1 // Yellow Color
      }
    })
    .style('fill', function(bin) {
      if (bin.x1 > upperLimit) {
        return '#fec44f' // Grey color
      } else if (bin.x0 < lowerLimit) {
        return '#fec44f'
      } else {
        return '#fec44f' // Yellow Color
      }
    });

  // Update filter triangle
  let xScale = d3.scaleLinear().domain([d3.min(selectedValues), d3.max(selectedValues)]).range([0, width])
  d3.selectAll('.filter-triangle')
    .data([lowerLimit, upperLimit])
    .attr('transform', function(d) {
      let x_transform = padding.left + (xScale(d))
      let y_transform = padding.top + height + 6
      return 'translate(' + x_transform + ',' + y_transform + ')'
    })

}

// function handleClick() {
//   updateHistogram(this.value, data)
// }

function handleSliderChange(data) {

  let statType = getStatType()
  let selectedData = data.map(d => (d[statType]))

  let minValue = d3.min(selectedData)
  let maxValue = d3.max(selectedData)
  let range = maxValue - minValue

  let lowerLimit = document.getElementById('slider-1').value * 0.01 * range + minValue
  let upperLimit = document.getElementById('slider-2').value * 0.01 * range + minValue

  filterHistogram(data, statType, lowerLimit, upperLimit)
  let Recipes = getRecipeList(data,statType, lowerLimit, upperLimit)
  updateRecipeList(Recipes)
}

function getRecipeList(data, statType, lowerLimit, upperLimit, size = 5) {
  let selectedDate = data.filter(function(recipe) {
    return (recipe[statType] > lowerLimit && recipe[statType] < upperLimit)
  })

  // Sort all data according to its rating, descending
  let sortedData = selectedDate.sort(function(a, b) {
    return b.Rating - a.Rating
  })
  return sortedData.slice(0, size)
}

// function updateleft(val) {
  // console.log(val);
  // this.value=Math.min(this.value,this.parentNode.childNodes[5].value-1);
  // var value=(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.value)-(100/(parseInt(this.max)-parseInt(this.min)))*parseInt(this.min);
  // var children = this.parentNode.childNodes[1].childNodes;
  // children[1].style.width=value+'%';children[5].style.left=value+'%';
  // children[7].style.left=value+'%';children[11].style.left=value+'%';
  // children[11].childNodes[1].innerHTML=this.value;
// }

function getStatType() {
  let buttons = document.getElementsByName('statistics')
  // let statType = document.querySelector('input[class="statisticInput"]:checked').value;
  let statType
  buttons.forEach(function(button) {
    if (button.checked) {
      statType = button.value
    }
  })
  return statType
}

function displayRecipeList(recipeList) {
  var ul = document.getElementById("recipelist");
  for (var i = 0; i < recipeList.length; i++) {
    var li = document.createElement("li");
    li.setAttribute("id","recipe"+i);
    var a = document.createElement("a");
    a.appendChild(document.createTextNode('·  ' + recipeList[i].name));
    li.appendChild(a);
    li.onclick = function(){
      idx = +this.id.slice(6);
      var recipe = recipeList[idx];
      recipe_open(recipe);
    };
    li.classList.add('recipeentry')
    ul.appendChild(li);
    };

  // let container = document.getElementById('recommendation-area')
  // container.innerHTML = 'Recommended List: <br><br>'
  // for (let i = 0; i < recipeList.length; i++) {
  //   container.innerHTML += 'Recipe Name:' + recipeList[i].Name + '<br><br>'
  // }
}

function updateRecipeList(recipeList) {
  var ul = document.getElementById("recipelist");
  c = ul.children;
  var cidx = 0,
      cnum = c.length;
  while (cidx < cnum) {
    c[0].remove();
    cidx ++;
  }
  // for ( let ele of c) { console.log(ele);ele.remove();};
  console.log('now is updating')
  // d3.select('#recommendation-area').empty()
  displayRecipeList(recipeList)
}

/* open and update the recipe information window */
function recipe_open(recipe) {
  // console.log($(this))
  console.log(recipe)
  // change title
  // h1 = document.getElementById('recipecard').getElementsByTagName('h3')[0];
  // h1.innerHTML=recipe.name;

  // change text
  var div = document.getElementById('recipeinfocontainer');
  c = div.children;
  // remove existed text
  for (var i = 0; i < c.length; i++) {
    c[i].remove()
  }

  // add new ones
  var recipeDiv = $("<div>")
                  .attr("id",'recipe-detail')
                  .attr('style','line-height: 1.5; letter-spacing: .1rem;')
                  .appendTo(div);
   // = document
   //              .createElement('div')
   //              .setAttribute("id",'recipe-detail')
   //              .appendTo(div);
   //              // .setAttribute('style','line-height: 1.5; letter-spacing: .1rem;')

  parserecipe(recipe)
  // p.innerHTML = recipe.steps;
  // p.innerHTML = repeat(id.slice(3),1000);
  // p.setAttribute('style','line-height: 1.5; letter-spacing: .1rem;')

  // div.appendChild(p)
  document.getElementById('recipechart').style.visibility = 'visible';
  document.getElementById('recipechart').style.opacity = 1;

}

function repeat(id,num){
  str = '';
  for (var i = 0; i < num; i++) {
    r = Math.random();
    if (r < 0.1) {
      str = str+'<b>' + id + '</b>'+' ';
    }
    else if (r < 0.3) {
      str = str+'<highlight>' + id + '</highlight>' +' ';
    }
    else {
      str = str+id+' ';
    }
  }
  return str
}
