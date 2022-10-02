filePath = 'recipeExample.json'

function createRecipePage(filePath) {
  fetch(filePath)
    .then(response => {
      return response.json();
    })
    .then(function (data) {
        data = JSON.parse(data)

        // Clean the text in data.steps
        let longSteps = data.steps.replace(/\[|\]|'|,|"/g, '')


        let recipeDiv = document.getElementById('recipe-detail')
        recipeDiv.innerHTML =
          `<h1><strong>Recipe: ${data.name}</strong></h1>
        <p><strong>Properties:</strong></p>
        <ul>
          <li>Calories (kcal): ${data['Calories (kcal)']}</li>
          <li>Carbohydrates (g): ${data['Carbohydrates (g)']}</li>
          <li>Protein (g): ${data['Protein (g)']}</li>
          <li>Saturated fat (g): ${data['Saturated fat (g)']}</li>
          <li>Sodium (mg): ${data['Sodium (mg)']}</li>
          <li>Sugar (g): ${data['Sugar (g)']}</li>
        </ul>
        <div id="recipe-description">
          <p><strong>Description: </strong></p>
          <article>${data.description}</article>
        </div>
        <div id="recipe-steps">
          <p><strong>Steps: </strong></p>
          <article>${longSteps}</article>
        </div>
        <div id="recipe-description">
          <p><strong>Description: </strong></p>
          <article>${longSteps}</article>
        </div>`

        // An alternative way to display steps, using ordered list
        let steps = data.steps
          .replace("'", "")
          .replace("]", "")
          .replace("[", "")
          .split(',')
        let orderedList = document.createElement('ol')
        document.getElementById('recipe-steps').appendChild(orderedList)
        steps.forEach(function (step) {
          step = step.replace("'", "").replace("'", "").replace('"', "")
          let node = document.createElement('li')
          let textNode = document.createTextNode(step)
          node.appendChild(textNode)
          orderedList.appendChild(node)
        })

      }
    )
  ;
}

createRecipePage(filePath)

function parserecipe(data){
  let longSteps = data.steps.replace(/\[|\]|'|,|"/g, '')
  let recipeDiv = document.getElementById('recipe-detail')

  recipeDiv.innerHTML =
    `<h1><strong>Recipe: ${data.name}</strong></h1>
  <p><strong>Properties:</strong></p>
  <ul>
    <li>Rating: ${data['rating']}</li>
    <li>Calories (kcal): ${data['Calories (kcal)']}</li>
    <li>Carbohydrates (g): ${data['Carbohydrates (g)']}</li>
    <li>Protein (g): ${data['Protein (g)']}</li>
    <li>Saturated fat (g): ${data['Saturated fat (g)']}</li>
    <li>Sodium (mg): ${data['Sodium (mg)']}</li>
    <li>Sugar (g): ${data['Sugar (g)']}</li>
  </ul>
  <div id="recipe-description">
    <p><strong>Description: </strong></p>
    <article>${data.description}</article>
  </div>
  <div id="recipe-ingredients">
    <p><strong>Ingredients: </strong></p>
  </div>
  <div id="recipe-steps">
    <p><strong>Steps: </strong></p>
    <article>${longSteps}</article>
  </div>`

  // An alternative way to display steps, using ordered list
  appendlist(data.steps,'recipe-steps')
  appendlist(data.ingredients,'recipe-ingredients')

  // let steps = data.steps
  //   .replace("'", "")
  //   .replace("]", "")
  //   .replace("[", "")
  //   .split(',')
  // let orderedList = document.createElement('ol')
  // document.getElementById('recipe-steps').appendChild(orderedList)
  // steps.forEach(function (step) {
  //   step = step.replace("'", "").replace("'", "").replace('"', "")
  //   let node = document.createElement('li')
  //   let textNode = document.createTextNode(step)
  //   node.appendChild(textNode)
  //   orderedList.appendChild(node)
  // })
}

function appendlist(datainfo,framename){
  let steps = datainfo
    .replace("'", "")
    .replace("]", "")
    .replace("[", "")
    .split(',')
  let orderedList = document.createElement('ol')
  document.getElementById(framename).appendChild(orderedList)
  steps.forEach(function (step) {
    step = step.replace("'", "").replace("'", "").replace('"', "")
    let node = document.createElement('li')
    let textNode = document.createTextNode(step)
    node.appendChild(textNode)
    orderedList.appendChild(node)
  })
}
