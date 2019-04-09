var user = {
  id: "player",
  score: 0,

  fizzScore: function() {
    let fizzString = "";

    if (this.score % 3 === 0) {
      fizzString += "Fizz";
    } if (this.score % 5 === 0) {
      fizzString += "Buzz";
    } if (fizzString === "") {
      fizzString = this.score;
    }
    return fizzString;
  },

  Url: function() {
    return "http://131.247.210.6:8000/" + this.id;
  },

  setLocalUser: function() {
    localStorage.setItem("userStorage", JSON.stringify(this));
  },

  getLocalUser: function() {
    var userValues = JSON.parse(localStorage.getItem("userStorage"));
    this.score = userValues.score;
    this.id = userValues.id;
  }

};

function loadPlayerInfo() {
  user.getLocalUser();
  displayId();
  displayScore();
}

function displayId() {
  document.querySelector("#id-display").innerHTML = user.id;
}

function displayScore() {
  document.querySelector("#score-display").innerHTML = user.fizzScore();
}

function submitId() {
  user.id = document.querySelector("#id-input").value;

  if(user.id) {
    get(user.Url()).then(function(response) {

      if(response.status == 200) {
        user.id = response.data.id; 
        user.score = response.data.score;
        console.log(user.id + " was found with score of " + user.score);
      }
      else {
        post(user.Url(), { score: 0 });
        console.log(user.id + " was not found, score is now " + user.score);
      }
    })
    .then(() => {
      user.setLocalUser();
      window.open("index.html", "_self");
    })
    .catch(error => alert(error));
  }
}

function fizzButton() {
  user.score++;
  post(user.Url(), { score: user.score }).then(function(response){
    switch(response.status){
      case 200:
        user.score = response.data.score;
        break;
      case 201:
        user.score = response.data.score;
        break;
      case 400:
        console.error(response.data);
        break;
      case 500:
        console.error(response.data);
        break;
    }
  });
  displayScore();
}

function get(url) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.onload = function() {
      resolve({ status: http.status, data: JSON.parse(http.response) });
    };
    http.onerror = function() {
      reject(console.log("GET was rejected. . ."));
    };
    http.open("GET", url);
    http.send();
  });
}

function post(url, data) {
  data = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.onload = function() {
      resolve({ status: http.status, data: JSON.parse(http.response) });
    };
    http.open("POST", url);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(data);
  });
}

/**
 * @typedef {{id: string, score: number}} User
 */

/**
 * @typedef {{Error: string}} Error
 */
