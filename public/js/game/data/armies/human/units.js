gameData.ELEMENTS[gameData.FAMILIES.unit].push(
[
	{
		name : 'builder',
		r : 0,
		t : 0,
		shape : [[1]],
		speed : 1,
		isBuilder : true,
		buttons : [{id : 0, image : 'build.png', isEnabled : true, name: 'build'}],
		timeConstruction : 5,
		l : 20,
		attackSpeed : 3,
		attack : 5, 
		defense : 0,
		weaponType : 0,
		armorType : 0,
		gatheringSpeed : 2,
		maxGathering : 20,
		pop : 1,
		needs : [{t : gameData.RESOURCES.gold.id, value : 20}],
		g : 'dwarf.js',
		image: 'builder.png'
	},
	{
		name : 'swordsman',
		r : 0,
		t : 1,
		shape : [[1]],
		speed : 1,
		isBuilder : false,
		buttons : [],
		timeConstruction : 10,
		l : 50,
		attackSpeed : 2,
		attack : 10, 
		defense : 2,
		weaponType : 0,
		armorType : 0,
		pop : 1,
		needs : [{t : gameData.RESOURCES.gold.id, value : 50}],
		g : 'dwarf.js',
		image: 'builder.png'
	},
	{
		name : 'knight',
		r : 0,
		t : 2,
		shape : [[1, 1], [1, 1]],
		speed : 2,
		isBuilder : false,
		buttons : [],
		timeConstruction : 20,
		l : 120,
		attackSpeed : 1,
		attack : 20, 
		defense : 5,
		weaponType : 0,
		armorType : 0,
		pop : 2,
		needs : [{t : gameData.RESOURCES.gold.id, value : 100}],
		g : 'dwarf.js',
		image: 'builder.png'
	}
]);