var userInput = {};


/**
*	CONSTANTS
*/
userInput.CAN_BE_BUILT_HERE = 10;
userInput.CANNOT_BE_BUILT_HERE = 1;
userInput.DOUBLE_CLICK_RADIUS_SIZE = 15;


/**
*	VARIABLES
*/
userInput.isChatWindowOpen = false;


userInput.doSelect = function (x, y) {

	// the user clicked on a toolbar's button
	if (GUI.toolbar.length > 0 && x < GUI.BUTTONS_SIZE + 10 && x > 10
		&& y < window.innerHeight - 10 && y > window.innerHeight- 10 - GUI.BUTTONS_SIZE * GUI.toolbar.length) {

			this.clickOnToolbar(GUI.toolbar[parseInt(GUI.toolbar.length - (window.innerHeight - y - 10) / GUI.BUTTONS_SIZE)]);
			return false;

	}

	// the user is building something
	else if (gameContent.building != null) {

		this.tryBuildHere();
		return false;

	} 

	//the user wants to select one or more elements
	else {

		//click on minimap
		if (x > window.innerWidth - GUI.MINIMAP_SIZE && y > window.innerHeight - GUI.MINIMAP_SIZE) {
			return;
		}

		this.leaveConstructionMode();

		//reset selected array
		gameSurface.unselectAll();
		gameContent.selected = [];

		//reset the selection rectangle
		gameContent.selectionRectangle = [];
		gameSurface.updateSelectionRectangle(-1, -1, -1, -1);

		gameContent.selectionRectangle[0] = x;
		gameContent.selectionRectangle[1] = y;

		var intersect = gameSurface.getFirstIntersectObject(x, y);
		if (intersect != null) {

			if (intersect.object.elementId != null) {
				gameContent.selected.push(intersect.object.elementId);
				gameSurface.selectElement(intersect.object.elementId);
			}
		}
	  	return true;

	}
}


userInput.doAction = function (x, y) {

	if (x > window.innerWidth - GUI.MINIMAP_SIZE && y > window.innerHeight - GUI.MINIMAP_SIZE) { return false; }

	//leave the construction mode if activated
	if(gameContent.building != null) {
		this.leaveConstructionMode();
	} else if(gameContent.selected.length > 0) {
		var selected = utils.getElementFromId(gameContent.selected[0]);
		if (rank.isAlly(gameContent.players, gameContent.myArmy, selected)
			&& (selected.f == gameData.FAMILIES.unit || selected.f == gameData.FAMILIES.building)) {
			this.dispatchUnitAction(x, y);
		}
	}

}


userInput.doDoubleClick = function (x, y) {

	if(gameContent.selected.length > 0) {

		var selected = utils.getElementFromId(gameContent.selected[0]);
		if(rank.isAlly(gameContent.players, gameContent.myArmy, selected)) {

			var tiles = tools.getTilesAround(gameContent.grid, selected.p, this.DOUBLE_CLICK_RADIUS_SIZE, true);
			for (var i in tiles) {
				if (tiles[i] > 0) {

					var element = utils.getElementFromId(tiles[i]);
					if(element.f == selected.f && rank.isAlly(gameContent.players, gameContent.myArmy, element) && element.t == selected.t) {

				  		// select the elements
				  		gameContent.selected.push(element.id);
			  	  		gameSurface.selectElement(element.id);

				  	}
				}
			}

		}

	}

}


userInput.pressToolbarShortcut = function (i) {
	if(i < GUI.toolbar.length) {
		this.clickOnToolbar(GUI.toolbar[i]);
	}
}


userInput.onEnterKey = function () {

	if (this.isChatWindowOpen) {

		$('#chat').addClass('hide');
		var message = $('input', '#chat').val();

		if (message != '') {

			if (message == 'olivier !' || message == '/soundon') {

				gameManager.musicEnabled = true;
				soundManager.playMusic();
				gameSurface.showMessage(gameSurface.MESSAGES.musicEnabled);

			} else if (message == 'paranormalement' || message == '/soundoff') {

				gameManager.musicEnabled = false;
				soundManager.stopMusic();
				gameSurface.showMessage(gameSurface.MESSAGES.musicDisabled);

			} else if (message == '/surrender') {

				gameManager.sendOrderToEngine(order.TYPES.surrender, [gameContent.myArmy]);

			} else {

				gameManager.sendOrderToEngine(order.TYPES.chat, [gameContent.myArmy, $('input', '#chat').val()]);

			}

		}

		$('input', '#chat').val('');

	} else {

		$('#chat').removeClass('hide');
		$('#chat').css('top', (window.innerHeight - $('#chat').height()) / 2);
		$('#chat').css('left', (window.innerWidth - $('#chat').width()) / 2);
        $('input', '#chat')[0].focus();

	}

	this.isChatWindowOpen = !this.isChatWindowOpen;

}


userInput.onMouseMove = function (x, y) {

	this.updateConstructionMode(x, y);
	this.updateMouseIcon(x, y);

}


userInput.onMouseUp = function () {

	this.removeSelectionRectangle();

}












/**
*	The user clicked on a button in the toolbar.
* 	@param button : the button that was clicked
*/
userInput.clickOnToolbar = function (button) {
	if (button.isEnabled) {
		soundManager.playSound(soundManager.SOUNDS_LIST.button);
		if (button.buttonId == GUI.TOOLBAR_BUTTONS.build.buttonId) {
			//build something
			GUI.showBuildings = true;
		} else if (GUI.showBuildings && button.isEnabled) {
			//building
			this.enterConstructionMode(button);
		} else if (button.buttonId == GUI.TOOLBAR_BUTTONS.cancel.buttonId) {
			//cancel construction
			gameManager.sendOrderToEngine(order.TYPES.cancelConstruction, [utils.getElementFromId(gameContent.selected[0]).id]);
		} else if (utils.getElementFromId(gameContent.selected[0]).f == gameData.FAMILIES.building) {
			gameManager.sendOrderToEngine(order.TYPES.buy,
					 					[gameContent.selected, button]);
		}
	}
}


/**
*	The user wants to build a construction and has chosen which one. 
* 	@param building : the building selected by the user
*/
userInput.enterConstructionMode = function (building) {
	gameContent.building = building;
	GUI.selectButton(building);
	this.updateConstructionMode(controls.mousePosition.x, controls.mousePosition.y);
}


/**
* 	The user is moving the mouse while in the construction mode.
*		Makes move the building with the mouse and shows if it can be built here. 
* 	@param (x, y) : current coordinates of the mouse
*/
userInput.updateConstructionMode = function (x, y) {
	if(gameContent.building != null) {
		//updates building position
		gameContent.building.p = gameSurface.getAbsolutePositionFromPixel(x, y);

		//check if building can be built here
		gameContent.building.canBeBuiltHere = true;
		for(var i in gameContent.building.shape) {
			for(var j in gameContent.building.shape[i]) {
				gameContent.building.shape[i][j] = this.CAN_BE_BUILT_HERE;
			}
		}
		utils.canBeBuiltHere(gameContent.building);
		gameSurface.updateBuildingGeometry();
	}
}


/**
*	The user does not want anymore to build the building selected.
*/
userInput.leaveConstructionMode = function () {
	gameContent.building = null;
	gameSurface.removeBuildingGeometry();
	GUI.unselectButtons();
	GUI.showBuildings = false;
}


/**
*	Updates mouse icon.
*/
userInput.updateMouseIcon = function (mouseX, mouseY) {
	var elementUnder = gameSurface.getFirstIntersectObject(mouseX, mouseY);
	var x = - controls.scroll[0];
	var y = controls.scroll[1];
	
	if (elementUnder != null && elementUnder.object.elementId != null) {
		var e = utils.getElementFromId(elementUnder.object.elementId);
		if (e != null && e.f != gameData.FAMILIES.land && rank.isEnemy(gameContent.players, gameContent.myArmy, e)) {
			GUI.updateMouse(GUI.MOUSE_ICONS.attack);
		} else {
			GUI.updateMouse(GUI.MOUSE_ICONS.select);
		}
	} else if (!controls.isKeyboardScrolling) {
		if (x > 0 && y > 0) {
			GUI.updateMouse(GUI.MOUSE_ICONS.arrowTopRight);
		} else if (x > 0 && y == 0) {
			GUI.updateMouse(GUI.MOUSE_ICONS.arrowRight);
		} else if (x > 0 && y < 0) {
			GUI.updateMouse(GUI.MOUSE_ICONS.arrowBottomRight);
		} else if (x < 0 && y > 0) {
			GUI.updateMouse(GUI.MOUSE_ICONS.arrowTopLeft);
		} else if (x < 0 && y == 0) {
			GUI.updateMouse(GUI.MOUSE_ICONS.arrowLeft);
		} else if (x < 0 && y < 0) {
			GUI.updateMouse(GUI.MOUSE_ICONS.arrowBottomLeft);
		} else if (x == 0 && y > 0) {
			GUI.updateMouse(GUI.MOUSE_ICONS.arrowTop);
		} else if (x == 0 && y < 0) {
			GUI.updateMouse(GUI.MOUSE_ICONS.arrowBottom);
		} else {
			GUI.updateMouse(GUI.MOUSE_ICONS.standard);
		}
	}
}


/**
*	The user wants to build his construction at the current position.
*/
userInput.tryBuildHere = function () {
	if(gameContent.building.canBeBuiltHere) {
		soundManager.playSound(soundManager.SOUNDS_LIST.hammer);
		// let's start the construction
		gameManager.sendOrderToEngine(order.TYPES.buildThatHere,
							 [gameContent.selected, gameContent.building, 
							  gameContent.building.p.x, 
							  gameContent.building.p.y]);
		this.leaveConstructionMode();
	} else {
		// cannot be built here !
	}
}


/**
*	Dispatches the action according to the order.
*/
userInput.dispatchUnitAction = function (x, y) {
	var destination;
	var elementUnder = gameSurface.getFirstIntersectObject(x, y);
	if (elementUnder != null) {
		if (elementUnder.object.elementId != null) {
			destination = utils.getElementFromId(elementUnder.object.elementId).p;
			gameSurface.animateSelectionCircle(elementUnder.object.elementId);
		} else {
			destination = {
				x : parseInt(elementUnder.point.x / gameSurface.PIXEL_BY_NODE),
				y : parseInt(elementUnder.point.y / gameSurface.PIXEL_BY_NODE)
			}
		}
		this.sendOrder(destination.x, destination.y);
	}
}


/**
*	Send order to the engine.
*/
userInput.sendOrder = function (x, y) {
	if (x >= 0 && y >= 0
		&& x < gameContent.map.size.x && y < gameContent.map.size.y) {
		gameManager.sendOrderToEngine(order.TYPES.action, [gameContent.selected, x, y]);
	}
}


/**
* 	The user is drawing a selection rectangle to select some elements.
* 	@param (x, y) : current coordinates of the mouse
*/
userInput.drawSelectionRectangle = function (x, y) {
	if(gameContent.selectionRectangle.length > 0) {

			// unselect the previous selected elements
			gameSurface.unselectAll();
			gameContent.selected = [];

			var unitSelected = false;

			gameSurface.updateSelectionRectangle(gameContent.selectionRectangle[0], gameContent.selectionRectangle[1], x, y);

			var position1 = gameSurface.getFirstIntersectObject(gameContent.selectionRectangle[0], gameContent.selectionRectangle[1]).point;
			var position2 = gameSurface.getFirstIntersectObject(x, y).point;

			var gamePosition1 = gameSurface.convertScenePositionToGamePosition(position1);
			var gamePosition2 = gameSurface.convertScenePositionToGamePosition(position2);
			var selectionRectangleGamePosition = [
				gamePosition1.x, gamePosition1.y, gamePosition2.x, gamePosition2.y
			];

			for (var i = Math.min(selectionRectangleGamePosition[0], selectionRectangleGamePosition[2]); i <= Math.max(selectionRectangleGamePosition[0], selectionRectangleGamePosition[2]); i++) {
				for (var j = Math.min(selectionRectangleGamePosition[1], selectionRectangleGamePosition[3]); j <= Math.max(selectionRectangleGamePosition[1], selectionRectangleGamePosition[3]); j++) {
					if (gameContent.grid[i][j] > 0) {
						var element = utils.getElementFromId(gameContent.grid[i][j]);
						if(rank.isAlly(gameContent.players, gameContent.myArmy, element)) {
					  		// select the elements
					  		gameContent.selected.push(element.id);
				  	  		gameSurface.selectElement(element.id);

				  	  		if(element.f == gameData.FAMILIES.unit) {
					  			unitSelected = true;
					  		}
					  	}
					}
				}
			}

			// unselect the buildings if one or more units are selected
			if(unitSelected) {
				var len = gameContent.selected.length;
				while(len--) {
					var element = utils.getElementFromId(gameContent.selected[len]);
					if(element.f == gameData.FAMILIES.building) {
						gameContent.selected.splice(len, 1);
				  		gameSurface.unselectElement(element.id);
					}
				}
			}

		}
}


/**
*	Removes the selection rectangle.
*/
userInput.removeSelectionRectangle = function () {
	gameContent.selectionRectangle = [];
	gameSurface.updateSelectionRectangle(-1, -1, -1, -1);
}