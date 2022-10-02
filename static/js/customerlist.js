// Add Ingredient list to select
d3.json('/get_ingredient_list')
  .then(function(data) {
    //console.log(data)
    var ingredientlist = data;
    for (var i = 0; i < ingredientlist.length; i++) {
      var ul = document.getElementById("myMenu");
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.appendChild(document.createTextNode(ingredientlist[i].ingredient));
      li.appendChild(a);
      ul.appendChild(li);
    };

    $(".scrollbar li a").on("click", function() {
      $(".scrollbar li a").removeClass('selected');
      $(this).attr('class', 'selected');
    });

  });


// Add tags
d3.json('/get_tags')
  .then(function(data) {
    //console.log(data);

    tagboard = $('#tags')[0];

    for (var classidx=0; classidx<data.length; classidx++){

      taglist = data[classidx];
      tagclass = data[classidx].Class;

      $("<div>")
        .attr("id",tagclass)
        .attr("style","width:200px")
        .appendTo(tagboard)
        .append(
          $("<h3>")
            .text('- '+data[classidx].DisplayName+' -')
            .attr("style","color:white;font-size:20px")
        )

      for (const [key, value] of Object.entries(taglist)) {
          if (value != '' && key!="Class" && key!="DisplayName"){

            $("<div>")
              .attr("style","display:inline-block;width:100%;position:relative;height:35px;")
              .appendTo($("#"+tagclass))
              .append(
                $("<input>")
                .attr("type", "checkbox")
                .attr('id',value)
                .attr("class", tagclass+'-checkbox')
                .attr("style","position:absolute;left:5px;top:8px"),
                $("<p>")
                .attr("id","tag")
                .attr("style","position:absolute;left:23px;top:3px;color:white;margin:0px")
                // .attr("style","color:white;margin-top:10px; margin-left:5px")
                .text(value)
                      )
          }
        };
    };

    // Checkbox function
    var taglimit = 1;
    $('input[type=checkbox]').on('change', function(evt) {
      tagclass = this.classList[0];
      if ($('.'+tagclass+':checked').length > taglimit) {
        this.checked = false;
      } else {
        var checkboxes = document.querySelectorAll('input[type=checkbox]');
        //var selectedtags = [];
        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            selectedtags.push(checkboxes[i].id);
          }
        }
        console.log(selectedtags);
      }
    });

  });
