document.addEventListener('DOMContentLoaded', function() {
   
  function randomString() {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var str = '';
    for (var i = 0; i < 10; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }
  function generateTemplate(name, data, basicElement) {
  var template = document.getElementById(name).innerHTML;
  var element = document.createElement(basicElement || 'div');

  Mustache.parse(template);
  element.innerHTML = Mustache.render(template, data);

  return element;
}
function Column(name) {
  var self = this;

  this.id = randomString();
  this.name = name;
  this.element = generateTemplate('column-template', { name: this.name, id: this.id });

  this.element.querySelector('.column').addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-delete')) {
      self.removeColumn();
    }

    if (event.target.classList.contains('add-card')) {
      self.addCard(new Card(prompt("Enter the name of the card")));
    }
  });
}
Column.prototype = {
    addCard: function(card) {
      this.element.querySelector('ul').appendChild(card.element);
    },
    removeColumn: function() {
      this.element.parentNode.removeChild(this.element);
    }
};
function Card(description) {
  var self = this;

  this.id = randomString();
  this.description = description;
  this.element = generateTemplate('card-template', { description: this.description }, 'li');

  this.element.querySelector('.card').addEventListener('click', function (event) {
    event.stopPropagation();

    if (event.target.classList.contains('btn-delete')) {
      self.removeCard();
    }
  });
}
Card.prototype = {
	removeCard: function() {
		this.element.parentNode.removeChild(this.element);
    }
};
  var board = {
    name: 'Kanban Board',
    addColumn: function(column) {
      this.element.appendChild(column.element);
      initSortable(column.id); //About this feature we will tell later
    },
    element: document.querySelector('#board .column-container')
};
function initSortable(id) {
  var el = document.getElementById(id);
  var sortable = Sortable.create(el, {
    group: 'kanban',
    sort: true
  });
}
document.querySelector('#board .create-column').addEventListener('click', function() {
    var name = prompt('Enter a column name');
    var column = new Column(name);
    board.addColumn(column);
  
});
// CREATING COLUMNS
var todoColumn = new Column('To do');
var doingColumn = new Column('Doing');
var doneColumn = new Column('Done');

// ADDING COLUMNS TO THE BOARD
board.addColumn(todoColumn);
board.addColumn(doingColumn);
board.addColumn(doneColumn);

// CREATING CARDS
var card1 = new Card('New task');
var card2 = new Card('Create kanban boards');

// ADDING CARDS TO COLUMNS
todoColumn.addCard(card1);
doingColumn.addCard(card2);




});
var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
  'X-Client-Id': 'X-Client-Id',
  'X-Auth-Token': 'X-Auth-Token',
  'Content-Type': 'application/json; charset=utf-8'
};

fetch(baseUrl + '/board', { headers: myHeaders })
  .then(function(resp) {
    return resp.json();
  })
  .then(function(resp) {
    setupColumns(resp.columns);
  });


  
  function setupColumns(columns) {
  columns.forEach(function (column) {
		var col = new Column(column.id, column.name);
    board.addColumn(col);
    setupCards(col, column.cards);
  });
}

function setupCards(col, cards) {
	cards.forEach(function (card) {
    var cardObj = new Card(card.id, card.name);
  	col.addCard(cardObj);
	});
}

function Column(id, name) {
    this.id = id;
    this.name = name || 'No name given';
}

Column.prototype = {
	removeColumn: function() {
  var self = this;
  fetch(baseUrl + '/column/' + self.id, { method: 'DELETE', headers: myHeaders })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      self.element.parentNode.removeChild(self.element);
    });
	}
};
if (event.target.classList.contains('add-card')) {
  var cardName = prompt("Enter the name of the card");
  event.preventDefault();
  self.addCard(new Card(cardName));
}

if (event.target.classList.contains('add-card')) {
  var cardName = prompt("Enter the name of the card");
  event.preventDefault();

  fetch(baseUrl + '/card', {
      method: 'POST',
      body: {
        //body query
      }
    })
    .then(function(res) {
      return res.json();
    })
    .then(function() {
      //create a new client side card
    });

  self.addCard(new Card(cardName));
}
var data = new FormData();
data.append('name', cardName);
data.append('bootcamp_kanban_column_id', self.id);

fetch(baseUrl + '/card', {
    method: 'POST',
    headers: myHeaders,
    body: data,
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(resp) {
    var card = new Card(resp.id, cardName);
    self.addCard(card);
  });
function Card(id, name) {
this.id = id;
this.name = name || 'No name given';
generateTemplate('card-template', { description: this.name }, 'li');
}

Card.prototype = {
removeCard: function() {
  var self = this;

  fetch(baseUrl + '/card/' + self.id, { method: 'DELETE', headers: myHeaders })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      self.element.parentNode.removeChild(this.element);
    })
}
};


document.querySelector('#board .create-column').addEventListener('click', function() {
  var name = prompt('Enter a column name');
  var data = new FormData();

  data.append('name', name);

  fetch(baseUrl + '/column', {
      method: 'POST',
      headers: myHeaders,
      body: data,
    })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(resp) {
      var column = new Column(resp.id, name);
      board.addColumn(column);
    });
});

// CREATING NEW COLUMN EXAMPLES
var todoColumn = new Column('TO DO');
var doingColumn = new Column('DOING');
var doneColumn = new Column('DONE');

// ADD COLUMN TO TABLES
board.createColumn(todoColumn);
board.createColumn(doingColumn);
board.createColumn(doneColumn);

// CREATING NEW CARDS
var card1 = new Card('New task');
var card2 = new Card('Create kanban boards');

// ADDING CARDS TO COLUMN
todoColumn.createCard(card1);
doingColumn.createCard(card2);
