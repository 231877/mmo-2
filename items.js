export let Item = {
	apple: {
		top: 0,
		left: 0,
		name: "Яблоко",
		type: "potion",
		lvl: 1,
		effect: {
			health: 2
		},
		legendary: 0
	},
	sword_wood: {
		top: 0,
		left: 16,
		name: "Деревянный меч",
		type: "weapon",
		effect: {
			damage: 4
		},
		lvl: 1,
		legendary: 3
	},
	shield_wood: {
		top: 0,
		left: 32,
		name: "Деревянный щит",
		type: "shield",
		lvl: 1,
		effect: {
			armor: 10
		},
		legendary: 1
	},
	helmet_wood: {
		top: 0,
		left: 9 * 16,
		name: "Деревянный шлем",
		type: "helmet",
		lvl: 1,
		effect: {
			armor: 5
		}
	},
	body_wood: {
		top: 16,
		left: 0,
		name: "Деревянный нагрудник",
		type: "body",
		lvl: 1,
		effect: {
			armor: 15
		}
	},
	book_wizard: {
		top: 0,
		left: 48,
		name: "Магический щит",
		type: "shield",
		lvl: 1,
		effect: {
			magic: 15,
			damage: 4
		},
		legendary: 2
	},
	sword_gold: {
		top: 16,
		left: 16,
		name: "Кошерный меч",
		type: "weapon",
		lvl: 1,
		effect: {
			damage: 23
		},
		legendary: 3
	},
	body_knigth: {
		top: 16,
		left: 64,
		name: "Кошерная броня",
		type: "body",
		lvl: 1,
		effect: {
			armor: 40,
			damage: 5
		},
		legendary: 1
	}
}