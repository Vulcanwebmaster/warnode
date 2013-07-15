gameData.ELEMENTS[gameData.FAMILIES.building][gameData.RACES.tomatoes.id] = {
	mothertree: {
		name: 'Mother Tree',
		tooltip: 'Mother Tree (M)',
		f: gameData.FAMILIES.building,
		r: gameData.RACES.tomatoes.id,
		t: 0,
		shape: [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]],
		timeConstruction: 80,
		buttons: [gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.tomatoes.id].builder, gameData.ELEMENTS[gameData.FAMILIES.research][gameData.RACES.tomatoes.id].doublekatana, gameData.ELEMENTS[gameData.FAMILIES.research][gameData.RACES.tomatoes.id].triplekatana],
		needs: [{t: gameData.RESOURCES.wood.id, value: 300}, {t: gameData.RESOURCES.water.id, value: 300}],
		l: 500,
		defense: 0,
		armorType: fightLogic.ARMOR_TYPES.building,
		pop: 8,
		g: 'tomato_mothertree',
		gui: 'ic_tomato_mothertree.png',
		height: 21,
		vision: 15,
		lifeBarWidth: 50,
		key: 'mothertree'
	},
	house: {
		name: 'House',
		tooltip: 'House (O)',
		f: gameData.FAMILIES.building,
		r: gameData.RACES.tomatoes.id,
		t: 1,
		shape: [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1 , 1 , 1]],
		timeConstruction: 40,
		buttons: [],
		needs: [{t: gameData.RESOURCES.wood.id, value: 80}],
		l: 100,
		defense: 0,
		armorType: fightLogic.ARMOR_TYPES.building,
		pop: 6,
		g: 'tomato_house',
		gui: 'ic_tomato_house.png',
		height: 12,
		vision: 15,
		lifeBarWidth: 40,
		key: 'house'
	},
	casern: {
		name: 'Casern',
		tooltip: 'Casern (C)',
		f: gameData.FAMILIES.building,
		r: gameData.RACES.tomatoes.id,
		t: 2,
		shape: [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]],
		timeConstruction: 60,
		buttons: [gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.tomatoes.id].baseUnit1, gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.tomatoes.id].baseUnit2, gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.tomatoes.id].baseUnit3],
		needs: [{t: gameData.RESOURCES.wood.id, value: 200}, {t: gameData.RESOURCES.water.id, value: 200}],
		l: 250,
		defense: 0,
		armorType: fightLogic.ARMOR_TYPES.building,
		pop: 0,
		g: 'tomato_casern',
		gui: 'ic_tomato_casern.png',
		height: 18,
		vision: 15,
		lifeBarWidth: 40,
		key: 'casern'
	},
	researchlab: {
		name: 'Research Lab',
		tooltip: 'Research Lab (R)',
		f: gameData.FAMILIES.building,
		r: gameData.RACES.tomatoes.id,
		t: 3,
		shape: [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]],
		timeConstruction: 45,
		buttons: [],
		needs: [{t: gameData.RESOURCES.wood.id, value: 150}, {t: gameData.RESOURCES.water.id, value: 150}],
		l: 200,
		defense: 0,
		armorType: fightLogic.ARMOR_TYPES.building,
		pop: 0,
		g: 'tomato_researchlab',
		gui: 'ic_tomato_researchlab.png',
		height: 18,
		vision: 15,
		lifeBarWidth: 40,
		key: 'researchlab'
	},
	tower: {
		name: 'Tiny Tree',
		tooltip: 'Tiny Tree (T)',
		f: gameData.FAMILIES.building,
		r: gameData.RACES.tomatoes.id,
		t: 4,
		shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
		timeConstruction: 45,
		buttons: [],
		needs: [{t: gameData.RESOURCES.wood.id, value: 150}, {t: gameData.RESOURCES.water.id, value: 100}],
		l: 200,
		defense: 1,
		armorType: fightLogic.ARMOR_TYPES.building,
		pop: 0,
		g: 'tomato_tower',
		gui: 'ic_tomato_tower.png',
		height: 25,
		vision: 14,
		attackSpeed: 1,
		attack: 6, 
		weaponType: fightLogic.WEAPON_TYPES.piercing,
		range: 20,
		lifeBarWidth: 30,
		key: 'tower'
	},
	factory: {
		name: 'Factory',
		tooltip: 'Factory (F)',
		f: gameData.FAMILIES.building,
		r: gameData.RACES.tomatoes.id,
		t: 5,
		shape: [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]],
		timeConstruction: 45,
		buttons: [gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.tomatoes.id].specialUnit1],
		needs: [{t: gameData.RESOURCES.wood.id, value: 150}, {t: gameData.RESOURCES.water.id, value: 150}],
		l: 200,
		defense: 0,
		armorType: fightLogic.ARMOR_TYPES.building,
		pop: 0,
		g: 'tomato_factory',
		gui: 'ic_tomato_factory.png',
		height: 18,
		vision: 15,
		lifeBarWidth: 40,
		key: 'factory'
	}
};