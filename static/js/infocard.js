function updateinfocard(){

  d3.json('/get_prediction').then(function(data) {
    //data = JSON.parse(data)
    console.log(data)
    var infocard = $('#infocard > div')[0];
    infocard.children[1].remove()

    $(<p>).text(data)
  }
}
