var gameLogic = {};


/**
*	Number of time the game is being updated by second.
*/
gameLogic.FREQUENCY = 5;


/**
*	Updates all the data related to the game logic itself : positions, life, ...
* 	It also checks if the game is ending.
*	Returns all the required elements.
*/
gameLogic.update = function (game) {
	game.modified = [];
	game.added = [];
	game.removed = [];

	//resolve players orders
	for (var i in game.orders) {
		order.dispatchReceivedOrder(game, game.orders[i][0], game.orders[i][1]);
	}
	game.orders = [];

	for (var n in game.players) {
		if (game.players[n].s != gameData.PLAYER_STATUSES.surrender) {
			game.players[n].s = gameData.PLAYER_STATUSES.defeat;
		}
	}

	//units
	for(var n in game.gameElements[gameData.FAMILIES.unit]) {
		var element  = game.gameElements[gameData.FAMILIES.unit][n];
		
		this.resolveActions(game, element);
		this.updateMoves(game, element);
		this.protectAround(game, element);
	}

	//buildings
	for (var n in game.gameElements[gameData.FAMILIES.building]) {
		var element  = game.gameElements[gameData.FAMILIES.building][n];

		if (game.players[element.o].s != gameData.PLAYER_STATUSES.surrender) {
			//player is still alive
			game.players[element.o].s = gameData.PLAYER_STATUSES.ig;
		}
		
		this.updateBuildings(game, element);
		this.protectAround(game, element);
	}

	this.addNewBuildings(game);
	this.removeDeads(game);
	this.checkGameOver(game);
	stats.update(game);

	//handles chat messages
	var chatMessages = [];
	for (var i in game.chat) {
		chatMessages.push(game.chat[i]);
	}
	game.chat = [];
	return {
		modified : game.modified,
		added: game.added,
		removed: game.removed,
		players: game.players,
		chat: chatMessages
	};
}


/**
* 	Synchronizes user's build actions with the game loop.
*/
gameLogic.addNewBuildings = function (game) {
	for (var i in game.newBuildings) {
		game.newBuildings[i].l = 1;
		gameCreation.addGameElement(game, game.newBuildings[i]);
	}
	game.newBuildings = [];

	for (var i in game.cancelBuildings) {
		gameCreation.removeGameElement(game, game.cancelBuildings[i]);
	}

	game.cancelBuildings = [];
}


/**
*	Updates moving units' positions.
*/
gameLogic.updateMoves = function (game, element) {
	if(element.mt != null && element.mt.x != null) {
		move.moveElement(game, element);
		tools.addUniqueElementToArray(game.modified, element);
	}
}


/**
*	Depending on the action of the unit, change the destination,
*	and if close enough, resolve the action (build, fight...).
*/
gameLogic.resolveActions = function (game, element) {
	if (element.a != null) {
		var elementData = gameData.ELEMENTS[element.f][element.r][element.t]
		var distance = tools.getElementsDistance(element, element.a);
		//is close enough ?
		if (distance <= 1) {
			//stop moving
			element.mt = {x : null, y : null};
			
			if (elementData.isBuilder && element.a.f == gameData.FAMILIES.building
				&& rank.isAlly(game.players, element.o, element.a)) {
				if(element.a.cp < 100) {
					//build
					action.doTheBuild(game, element, element.a);	
				} else if(element.ga != null) {
					//come back with some resources
					production.getBackResources(game, element);
				} else {
					//repair
					action.doTheBuild(game, element, element.a);
				}
			} else if (elementData.isBuilder && element.a.f == gameData.FAMILIES.land) {
				//gathering resources
				action.doTheGathering(game, element, element.a);
			} else if (rank.isEnemy(game.players, element.o, element.a)) {
				//attack
				action.doTheAttack(game, element, element.a);
			}
		} else if (distance <= elementData.range) {
			if (rank.isEnemy(game.players, element.o, element.a)) {
				//attack
				action.doTheAttack(game, element, element.a);

				//stop moving
				element.mt = {x : null, y : null};
			}
		} else {
			//move closer in order to do the action
			var closest = tools.getClosestPart(element, element.a);
			element.mt = {x : closest.x, y : closest.y};
		}
		tools.addUniqueElementToArray(game.modified, element);
	}
}


/**
*	Removes dead units from gameElements.	
*/
gameLogic.removeDeads= function (game) {
	var n = game.gameElements[gameData.FAMILIES.unit].length;
	while (n--) {
		var element = game.gameElements[gameData.FAMILIES.unit][n]; 
		if (element.l <= 0) {
			production.removeUnit(game, element);
			game.gameElements[gameData.FAMILIES.unit].splice(n, 1);
			gameCreation.removeGameElement(game, element);
		}
	}
}


/**
*	Updates buildings constructions, units production and research.
*/
gameLogic.updateBuildings = function (game, building) {
	if (building.q.length > 0) {
		production.updateQueueProgress(game, building);
		tools.addUniqueElementToArray(game.modified, building);
	}
}


/**
*	Stops the game if the winning conditions are reached.
*/
gameLogic.checkGameOver = function (game) {
	var nbPlayersDefeated = 0;
	var victory = -1;
	for (var i in game.players) {
		if (game.players[i].s == gameData.PLAYER_STATUSES.defeat
			|| game.players[i].s == gameData.PLAYER_STATUSES.surrender) {
			nbPlayersDefeated++;
		} else {
			victory = game.players[i].o;
		}
	}

	if (nbPlayersDefeated == game.players.length - 1) {
		game.players[victory].s = gameData.PLAYER_STATUSES.victory;
	}
}


/**
*	Aggressive AI.
*/
gameLogic.protectAround = function (game, element) {
	if ((element.mt == null || element.mt.x == null) && element.a == null && element.pa == null
		&& !gameData.ELEMENTS[element.f][element.r][element.t].isBuilder 
		&& (element.f == gameData.FAMILIES.unit || element.cp >= 100)) {
		AI.searchForNewEnemy(game, element);
	}
}