'use strict';
import {Item} from "./items.js";
let images = {
	player: new Image(),
	slot: new Image(),
	inv: new Image(),
	items: new Image(),
	chests: new Image(),
	armor: {
		wood: new Image(),
		knigth: new Image()
	},
	progressbar: new Image()
}, point_in_rectangle = (px, py, x, y, w, h) => { return (px >= x && py >= y && px <= x + w && py <= y + h); },
add_item = (id, count, ueffect) => {
	let inv = obj[player_id].inv;
	for (let i = 0; i < inv.length; i++) {
		for (let j = 0; j < inv[i].length; j++) {
			if (inv[i][j].id == '') {
				let item = Item[id], effect = item.effect;
				for (key in ueffect) {
					if (typeof(effect[key]) != 'undefined') effect[key] += ueffect[key];
						else effect[key] = ueffect[key];
				}
				inv[i][j].add(id, count, effect, item.lvl);
				return 1;
			}
		}
	}
},
add_window = (xx, yy, width, height, title) => {
	for (let j = 0; j < Math.floor((width - 32) / 16); j++) {
		Game.canvas.drawImage(images.inv, 16, 48, 16, 16, xx + 16 * (j + 1), yy - 16, 16, 16);
		for (let i = 0; i < Math.floor((height - 32) / 16); i++) 
			Game.canvas.drawImage(images.inv, 16, 32, 16, 16, xx + 16 * (j + 1), yy - height + 16 * (i + 1), 16, 16);
	}
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < Math.floor((height - 32) / 16); j++) 
			Game.canvas.drawImage(images.inv, 32 * i, 32, 16, 16, xx + (width - 16) * i, yy - height + 32 + 16 * j, 16, 16);
		for (let j = 0; j < Math.floor((width - 32) / 16); j++)
			Game.canvas.drawImage(images.inv, 16, 16 * i, 16, 16, xx + 16 * (j + 1), yy - height + 16 * i, 16, 16);
		Game.canvas.drawImage(images.inv, 32 * i, 48, 16, 16, xx + (width - 16) * i, yy - 16, 16, 16);
		Game.canvas.drawImage(images.inv, 32 * i, 0, 16, 16, xx + (width - 16) * i, yy - height, 16, 16);
		Game.canvas.drawImage(images.inv, 32 * i, 16, 16, 16, xx + (width - 16) * i, yy - height + 16, 16, 16);
	}
	Game.canvas.font = 'bold 6px Arial';
	Game.canvas.textBaseline = 'middle';
	Game.canvas.textAlign = 'center';
	Game.canvas.fillStyle = '#fff';
	Game.canvas.fillText(title || '', xx + width * .5, yy + 7 - height);
	Game.canvas.textAlign = 'left';
	Game.canvas.textBaseline = 'top';
}, 
add_info = (xx, yy, width, text) => {
	let height = 16 * (text.length - 1) + 8;
	for (let i = 0; i < 2; i++) {
		Game.canvas.drawImage(images.inv, 16 * i, 64, 8, 8, xx + (width - 8) * i, yy, 8, 8);
		Game.canvas.drawImage(images.inv, 16 * i, 72, 8, 8, xx + (width - 8) * i, yy + 8, 8, 8);
		Game.canvas.drawImage(images.inv, 16 * i, 80, 8, 8, xx + (width - 8) * i, yy + height - 8, 8, 8);
		for (let j = 0; j < width / 8 - 2; j++) Game.canvas.drawImage(images.inv, 8, 64 + 16 * i, 8, 8, xx + 8 * (j + 1), yy + (height - 8) * i, 8, 8);
		for (let j = 0; j < height / 8 - 3; j++) Game.canvas.drawImage(images.inv, 16 * i, 72, 8, 8, xx + (width - 8) * i, yy + 16 + 8 * j, 8, 8);
	}
	for (let i = 0; i < width / 8 - 2; i++) 
		for (let j = 0; j < height / 8 - 2; j++) Game.canvas.drawImage(images.inv, 8, 72, 8, 8, xx + 8 * (i + 1), yy + 8 * (j + 1), 8, 8);
	Game.canvas.fillStyle = '#fff';
	for (let i = 0; i < text.length; i++) Game.canvas.fillText(text[i], xx + 4, yy + 4 + 8 * (i + 1));
},
add_progressbar = (xx, yy, width, progress) => {
	Game.canvas.drawImage(images.progressbar, 0, 0, 8, 4, xx, yy, 8, 4);
	Game.canvas.drawImage(images.progressbar, 8, 0, 8, 4, xx + 8, yy, width - 16, 4);
	Game.canvas.drawImage(images.progressbar, 16, 0, 8, 4, xx + width - 8, yy, 8, 4);
	
	Game.canvas.drawImage(images.progressbar, 24, 0, 2, 4, xx + 1, yy, progress * (width - 2), 4);

},
socket = io(':6001'), online_state = 0,
online = {
	move: 1,
	msg: 2,
	inv: 4
}, my_socket = '';
images.player.src = './@/img/player.png';
images.items.src = './@/img/items.png';
images.chests.src = './@/img/chests.png';
images.inv.src = './@/img/inv.png';
images.slot.src = './@/img/slot.png';
images.armor.wood.src = './@/img/armor_wood.png';
images.armor.knigth.src = './@/img/armor_knigth.png';
images.progressbar.src = './@/img/progressbar.png';
class Slot {
	constructor(type, i, j) {
		this.id = '';
		this.count = 0;
		this.type = type;
		this.effect = {};
		this.i = i;
		this.j = j;
		this.size = 24;
	}
	drop(x, y) {
		if (point_in_rectangle(cursor.x - camera.x, cursor.y - camera.y, x, y, this.size, this.size)) {
			if (cursor.item.id != '') {
				mouse |= mouse_event.hover;
				if (mouse & mouse_event.lclick) {
					let nobj = obj[player_id].inv[cursor.index[0]][cursor.index[1]];
					if (this.type == '' || this.type == Item[cursor.item.id].type && Item[cursor.item.id].lvl <= obj[player_id].lvl) {
						if (this.id != '') {
							nobj.id = this.id;
							nobj.count = this.count;
							nobj.effect = this.effect;
							nobj.lvl = this.lvl;
						} else {
							nobj.id = '';
							nobj.count = 0;
							nobj.effect = {};
							nobj.lvl = 1;
						}
						if (nobj.type != '') for (key in cursor.item.effect) obj[player_id].stat[key] -= cursor.item.effect[key];
						this.id = cursor.item.id;
						this.count = cursor.item.count;
						this.effect = cursor.item.effect;
						this.lvl = cursor.item.lvl;
						if (this.type != '') {
							obj[player_id].armor_set[this.type] = this.id;
							for (key in this.effect) obj[player_id].stat[key] += this.effect[key];
							online_state |= online.move;
						}
						if (nobj.type != '') {
							obj[player_id].armor_set[nobj.type] = nobj.id;
							online_state |= online.move;
						}
					}
				}
			} else {
				if (this.id != '') {
					mouse |= mouse_event.hover;
					if (mouse & mouse_event.dclick) {
						cursor.item = {
							id: this.id,
							count: this.count,
							effect: this.effect,
							lvl: this.lvl
						};
						cursor.index = [this.i, this.j];
					} else {
						placeholder.name = Item[this.id].name;
						placeholder.type = Item[this.id].type;
						placeholder.effect = this.effect;
						placeholder.lvl = this.lvl;
						placeholder.legendary = Item[this.id].legendary || 0;
					}
					if (mouse & mouse_event.rclick) {
						this.use();
						mouse &=~ mouse_event.rclick;
					}
				}
			}
		}
	}
	draw(canvas, x, y) {
		canvas.drawImage(images.slot, 0, 0, 24, 24, x, y, 24, 24);
		if (this.id != '') {
			let item = Item[this.id];
			if (typeof(item.legendary) != 'undefined')
				if (item.legendary != 0) canvas.drawImage(images.slot, 24 * item.legendary, 0, 24, 24, x, y, 24, 24);
			canvas.drawImage(images.items, item.left, item.top, 16, 16, x + .5, y + .5, 24, 24);
			if (item.lvl > (obj[player_id].level || 1)) {
				canvas.fillStyle = '#f00';
				canvas.globalAlpha = .7;
				canvas.fillRect(x, y, 24, 24);
				canvas.globalAlpha = 1;
			}
			if (this.count > 1) {
				canvas.strokeStyle = '#000';
				canvas.fillStyle = '#fff';
				canvas.textAlign = 'right';
				canvas.textBaseline = 'bottom';
				canvas.lineWidth = 2;
				canvas.strokeText('x' + this.count, x + 22, y + 22);
				canvas.fillText('x' + this.count, x + 22, y + 22);

				canvas.textBaseline = 'top';
				canvas.textAlign = 'left';
			}
		} else {
			if (this.type != '') {
				let top = 24, left = 0;
				switch(this.type) {
					case 'body':
						left = 24;
					break;
					case 'boots': left = 48; break;
					case 'weapon': left = 72; break;
					case 'shield': top = 48; break;
				}
				canvas.drawImage(images.slot, left, top, 24, 24, x, y, 24, 24);
			}
		}
		this.drop(x, y);
	}
	add(id, count, effect, lvl) {
		this.id = id;
		this.count = count;
		this.effect = effect;
		this.lvl = lvl || 1;
	}
	use() {
		if (this.id != '') {
			let item = Item[this.id];
			for (let i = 0; i < obj[player_id].inv[obj[player_id].inv.length - 1].length; i++) {
				if (obj[player_id].inv[obj[player_id].inv.length - 1][i].type == item.type) {
					cursor.item = {
						id: this.id,
						count: this.count,
						effect: this.effect,
						lvl: this.lvl
					};
					let nobj = obj[player_id].inv[obj[player_id].inv.length - 1][i];
					for (key in nobj.effect) obj[player_id].stat[key] -= nobj.effect[key];
					this.id = nobj.id;
					this.count = nobj.count;
					this.effect = nobj.effect;
					this.lvl = nobj.lvl;
					nobj.id = cursor.item.id;
					nobj.count = cursor.item.count;
					nobj.effect = cursor.item.effect;
					nobj.lvl = cursor.item.lvl;
					if (this.type != '') {
						obj[player_id].armor_set[this.type] = this.id;

						online_state |= online.move;
					}
					if (nobj.type != '') {
						obj[player_id].armor_set[nobj.type] = nobj.id;
						for (key in nobj.effect) obj[player_id].stat[key] += nobj.effect[key];
						online_state |= online.move;
					}
					cursor.item.id = '';
					break;
				}
			}
		}
	}
};
class Obj {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	draw(func) {
		func;
	}
}
class Player extends Obj {
	constructor(x, y, name, set) {
		super(x, y);
		this.sprite_index = images.player;
		this.image_speed = .125;
		this.image_index = 0;
		this.image_xscale = 1;
		this.stat = {
			damage: 1,
			armor: 0,
			magic: 0
		}

		this.speed = 4;

		this.name = name || 'player';
		this.id = set;

		this.max_hp = 100;
		this.hp = this.max_hp;
		this.max_xp = 100;
		this.xp = 87;
		this.lvl = 1;

		this.state = 0;

		this.inv = [];
		let nn = ['body', 'helmet', 'boots', 'weapon', 'shield'];
		for (let i = 0; i < 7; i++) {
			this.inv[i] = [];
			for (let j = 0; j < 4 + (i >= 5); j++) 
				if (i == 6) this.inv[i][j] = new Slot(nn[j], i, j);
					else this.inv[i][j] = new Slot('', i, j);
		}
		this.armor_set = {
			body: '',
			helmet: '',
			boots: '',
			weapon: '',
			shield: ''
		};
	}
	draw() {
		let state = [machine.move], find = false, xscale = Math.sign(this.state & machine.left),
			w = 16, h = 20, xx = this.x - w * .5 - camera.x, yy = this.y - h - 2 - camera.y;
		if (this.armor_set.weapon != '') {
			switch(this.armor_set.weapon) {
				case 'sword_wood': Game.canvas.drawImage(images.armor.wood, 0, 16 + 9 * xscale, 21, 9, xx + (w - 21 * Game.zoom) * (xscale - !xscale) - 8 * !xscale - Math.floor(this.image_index), yy + 9 * Game.zoom, 21 * Game.zoom, 9 * Game.zoom); break;
				case 'sword_gold': Game.canvas.drawImage(images.armor.knigth, 0, 16 + 9 * xscale, 21, 9, xx + (w - 21 * Game.zoom) * (xscale - !xscale) - 8 * !xscale - Math.floor(this.image_index), yy + 9 * Game.zoom, 21 * Game.zoom, 9 * Game.zoom); break;
			}
		}
		for (let i = 0; i < state.length; i++) {
			if (this.state & state[i]) {
				switch(state[i]) {
					case machine.move:
						Game.canvas.drawImage(this.sprite_index, w * Math.floor(this.image_index + 1), xscale * h, w, h, xx, yy, w * Game.zoom, h * Game.zoom);
						this.image_index = (this.image_index + this.image_speed) * (this.image_index < 4 - this.image_speed);
					break;
				}
				find = true;
			}
		}
		if (!find) {
			Game.canvas.drawImage(this.sprite_index, 0, xscale * h, w, h, xx, yy, w * Game.zoom, h * Game.zoom);
			this.image_index = 0;
		}
		// рисование брони:
		if (this.armor_set.helmet != '') {
			Game.canvas.drawImage(images.armor.wood, 7 * xscale, 0, 7, 6, xx + w * .5, yy - 2, 7 * Game.zoom, 6 * Game.zoom);
		}
		if (this.armor_set.body != '') {
			switch(this.armor_set.body) {
				case 'body_wood': Game.canvas.drawImage(images.armor.wood, 0, 7, 15, 9, xx, yy + 9 * Game.zoom, 15 * Game.zoom, 9 * Game.zoom); break;
				case 'body_knigth': Game.canvas.drawImage(images.armor.knigth, 0, 7, 15, 9, xx, yy + 9 * Game.zoom, 15 * Game.zoom, 9 * Game.zoom); break;
			}
		}
		if (this.armor_set.shield != '') {
			switch(this.armor_set.shield) {
				case 'shield_wood': Game.canvas.drawImage(images.armor.wood, 14, 0, 7, 7, xx + w * xscale - 1 + (2 * xscale), yy + 9 * Game.zoom, 7 * Game.zoom, 7 * Game.zoom); break;
				case 'book_wizard': Game.canvas.drawImage(images.armor.knigth, 14, 0, 7, 8, xx + w * xscale - 2 + 4 * xscale, yy + 9 * Game.zoom, 7 * Game.zoom, 8 * Game.zoom); break;
			}
			
		}
		if (this.id != my_socket) {
			Game.canvas.font = "bold 8px Arial";
			Game.canvas.textBaseline = 'bottom';
			Game.canvas.fillStyle = '#00f';
			Game.canvas.textAlign = 'center';
			Game.canvas.fillText('<' + this.name + '>', xx + w, this.y - (h + 4) - camera.y);
			Game.canvas.textAlign = 'left';
			Game.canvas.textBaseline = 'top';
		}
	}
}
let obj = [], player_id = -1,
	add_object = (type, x, y, sock) => {
		switch(type) {
			case 'player':
				obj.push(new Player(x, y, 'player', sock));
				player_id = obj.length - 1;
			break;
			case 'other':
				obj.push(new Player(x, y, 'player', sock));
			break;
		}
	},
	keys = {
		up: 1,
		down: 2,
		left: 4,
		right: 8,
		inv: 16,
		character: 32,
		slot: [
			64,
			128,
			256,
			512,
			1024
		]
	}, key = 0, ui = 0, mouse = 0,
	mouse_event = {
		hover: 1,
		lclick: 2,
		move: 4,
		dclick: 8,
		rclick: 16
	},
	gui = {
		inventory: 1,
		character: 2
	},
	placeholder = {
		name: "",
		lvl: 1,
		effect: {},
		legendary: 0
	},
	cursor = {
		x: 0,
		y: 0,
		item: {
			id: '',
			count: 0,
			effect: {},
			lvl: 1
		},
		index: [0, 0]
	},
	camera = {
		x: 0,
		y: 0
	},
	machine = {
		move: 1,
		attack: 2,
		death: 4,
		left: 8,
		active: 16
	};
export let Game = {
	canvas_id: document.getElementById('canvas'),
	canvas: null,
	zoom: 2,
	init: () => {
		Game.canvas_id.width = Game.canvas_id.clientWidth;
		Game.canvas_id.height = Game.canvas_id.clientHeight;
		Game.canvas = Game.canvas_id.getContext('2d');
		Game.canvas.imageSmoothingEnabled = false;
		Game.canvas.scale(Game.zoom, Game.zoom);

		add_object('player', 10, 10, '');
		//add_object('other', 50, 50);

		add_item('shield_wood', 1, {armor: 2});
		add_item('sword_wood', 1, {magic: 14, damage: 10});
		add_item('sword_gold', 1, {});
		add_item('apple', 4, {});

		add_item('helmet_wood', 1, {});
		add_item('body_wood', 1, {});
		add_item('body_knigth', 1, {});
		add_item('book_wizard', 1, {});

		let zoom = Game.zoom;
	
		window.addEventListener('keydown', e => {
			switch(e.keyCode) {
				case 87: key |= keys.up; break;
				case 83: key |= keys.down; break;
				case 68: key |= keys.right; break;
				case 65: key |= keys.left; break;
				case 49: key |= keys.slot[0]; break;
				case 50: key |= keys.slot[1]; break;
				case 51: key |= keys.slot[2]; break;
				case 52: key |= keys.slot[3]; break;
				case 53: key |= keys.slot[4]; break;
			}
		});
		window.addEventListener('keyup', e => {
			switch(e.keyCode) {
				case 87: key &=~ keys.up; break;
				case 83: key &=~ keys.down; break;
				case 68: key &=~ keys.right; break;
				case 65: key &=~ keys.left; break;
				case 66: key |= keys.inv; break;
				case 67: key |= keys.character; break;
			}
		});
		window.addEventListener('resize', () => {
			Game.canvas_id.width = Game.canvas_id.clientWidth;
			Game.canvas_id.height = Game.canvas_id.clientHeight;
			Game.canvas.imageSmoothingEnabled = false;
			Game.canvas.scale(Game.zoom, Game.zoom);
		});
		window.addEventListener('mousemove', e => {
			cursor.x = e.pageX / zoom + camera.x;
			cursor.y = e.pageY / zoom + camera.y;
			mouse |= mouse_event.move;
		});
		window.addEventListener('contextmenu', e => {
			e.preventDefault();
		});
		window.addEventListener('mouseup', e => {
			if (e.button == 0) {
				cursor.x = e.pageX / zoom + camera.x;
				cursor.y = e.pageY / zoom + camera.y;
				mouse |= mouse_event.lclick;
			}
			if (e.button == 2) {
				mouse |= mouse_event.rclick;
			}
		});
		window.addEventListener('mousedown', (e) => {
			if (e.button == 0) {
				mouse |= mouse_event.dclick;
			}
		});
		// online:
		socket.on('auth', msg => {
			obj[player_id].id = msg; 
			my_socket = msg;
			online_state |= online.move;
		});
		socket.on('move', msg => {
			if (msg.id != obj[player_id].id) {
				let find = false;
				for (let i = 0; i < obj.length; i++) {
					let nobj = obj[i];
					if (obj[i] instanceof Player) {
						if (nobj.id == msg.id) {
							nobj.x = msg.x;
							nobj.y = msg.y;
							nobj.armor_set = {
								helmet: msg.set.helmet,
								body: msg.set.body,
								weapon: msg.set.weapon,
								boots: msg.set.boots,
								shield: msg.set.shield
							};
							nobj.state = msg.state;
							find = true;
							break;
						}
					}
				}
				if (!find) {
					add_object('other', msg.x, msg.y, msg.id);
					let nobj = obj[obj.length - 1];
					nobj.armor_set = {
						helmet: msg.set.helmet,
						body: msg.set.body,
						weapon: msg.set.weapon,
						boots: msg.set.boots,
						shield: msg.set.shield
					};
					online_state |= online.move;
				}
			}
		});
		socket.on('send', msg => { // получение сообщений:
			let chat = document.getElementById('block-message'),
				message = document.createElement('a');
			if (msg.id != obj[player_id].id) message.innerHTML = '<span class = "nickname">[' + msg.id + ']:</span> ' + msg.msg + "<br/>";
				else message.innerHTML = msg.msg + "<br/>";
			chat.appendChild(message);
		});
		socket.on('disconnect', msg => {
			for (let i = 0; i < obj.length; i++) {
				let nobj = obj[i];
				if (nobj instanceof Player) {
					if (nobj.id == msg) {
						obj.splice(i, 1);
						break;
					}
				}
			}
			for (let i = 0, nobj; i < obj.length; i++) {
				nobj = obj[i];
				if (nobj instanceof Player) {
					if (nobj.id == my_socket) {
						player_id = i;
						break;
					}
				}
			}
		});
		Game.update();
	},
	update: () => {
		let canvas_id = Game.canvas_id, zoom = Game.zoom;
		if (key & keys.inv) {
			if (ui & gui.inventory) ui &=~ gui.inventory;
				else ui |= gui.inventory;
			key &=~ keys.inv;
		}
		if (key & keys.character) {
			if (ui & gui.character) ui &=~ gui.character;
				else ui |= gui.character;
			key &=~ keys.character;
		}
		let nobj = obj[player_id];
		let hspd = Math.sign((key & keys.right) - (key & keys.left)), vspd = Math.sign((key & keys.down) - (key & keys.up));
		
		for (let i = 0; i < keys.slot.length; i++) { // использовние слотов быстрого доступа:
			if (key & keys.slot[i]) {
				nobj.inv[nobj.inv.length - 2][i].use();
				//console.log('press ' + i + ' key!');
				key &=~ keys.slot[i];
			}
		}

		if (hspd != 0 || vspd != 0) {
			nobj.x += hspd * 4;
			nobj.y += vspd * 4;
			if (hspd == -1) nobj.state |= machine.left;
			if (hspd == 1) nobj.state &=~ machine.left;
			nobj.state |= machine.move;
			online_state |= online.move;
		} else { 
			if (nobj.state & machine.move) {
				nobj.state &=~ machine.move; 
				online_state |= online.move;
			}
		}
		camera.x += Math.floor(((nobj.x - canvas_id.width * .5 / zoom) - camera.x) * .2);
		camera.y += Math.floor(((nobj.y - canvas_id.height * .5 / zoom) - camera.y) * .2);
		Game.draw();
		let cursors = ['pointer'], types = [mouse_event.hover];
			canvas_id.style.cursor = 'default';
			for (let i = 0; i < cursors.length; i++) 
				if (mouse & types[i]) canvas_id.style.cursor = cursors[i];
		mouse = 0;
		if (online_state) { // отправка сообщений на сервер:
			let state = [online.msg, online.move, online.inv];
			for (let i = 0; i < state.length; i++) {
				if (online_state & state[i]) {
					switch(state[i]) {
						case online.msg: // отправка сообщения в чат:
							let chat = document.getElementById('chat');
							socket.emit('send', chat.value);
							chat.value = '';
						break;
						case online.move: // перемещение:
							socket.emit('move', {
								id: obj[player_id].id, 
								x: obj[player_id].x, 
								y: obj[player_id].y, 
								state: obj[player_id].state,
								set: {
									helmet: obj[player_id].armor_set.helmet,
									body: obj[player_id].armor_set.body,
									boots: obj[player_id].armor_set.boots,
									weapon: obj[player_id].armor_set.weapon,
									shield: obj[player_id].armor_set.shield
								}
							});
						break;
					}
					online_state &=~ state[i];
				}
			}
		}
		requestAnimationFrame(Game.update);
	},
	draw: () => {
		Game.canvas.clearRect(0, 0, Game.canvas_id.width, Game.canvas_id.height);
		
		for (let i = 0, nobj; i < obj.length; i++) {
			nobj = obj[i];
			if (nobj instanceof Player) nobj.draw();
		}
		obj.sort((obj1, obj2) => { return obj1.y - obj2.y; });
		for (let i = 0, nobj; i < obj.length; i++) {
			nobj = obj[i];
			if (nobj instanceof Player) {
				if (nobj.id == my_socket) {
					player_id = i;
					break;
				}
			}
		}
		Game.gui();
	},
	gui: () => {
		let canvas = Game.canvas, canvas_id = Game.canvas_id, zoom = Game.zoom;
		placeholder.name = '';
		canvas.fillStyle = '#fff';
		canvas.font = "bold 6px Arial";
		let nobj = obj[player_id];
		add_progressbar(100, Game.canvas_id.height / zoom - 8, Game.canvas_id.width / zoom - 200, nobj.xp / nobj.max_xp);
		// панель быстрого доступа:
		let xx = canvas_id.width / zoom * .5 - 26 * (obj[player_id].inv[obj[player_id].inv.length - 2].length / 2), yy = canvas_id.height / zoom - 36;
		for (let i = 0; i < obj[player_id].inv[obj[player_id].inv.length - 2].length; i++) {
			obj[player_id].inv[obj[player_id].inv.length - 2][i].draw(canvas, xx + (26) * i, yy);
			canvas.fillStyle = '#fff';
			canvas.textAlign = 'right';
			canvas.textBaseline = 'top';
			canvas.fillText(i + 1, xx + 26 * i + 22, yy + 2);

			canvas.textAlign = 'left';
		}
		xx = canvas_id.width / zoom - 100 - 26 * 3;
		for (let i = 0; i < 3; i++) {
			canvas.fillRect(xx + 26 * i, yy, 24, 24);
			if (point_in_rectangle(cursor.x - camera.x, cursor.y - camera.y, xx + 26 * i, yy, 24, 24)) {
				mouse |= mouse_event.hover;
				if (mouse & mouse_event.lclick) {
					switch(i) {
						case 1: key |= keys.character; break;
						case 2: key |= keys.inv; break;
					}
					mouse &=~ mouse_event.lclick;
				}
			}
		}
		if (ui != 0) {
			let ui_state = [gui.inventory, gui.quests, gui.character], yy = canvas_id.height / zoom - 42,
				width = Math.floor((obj[player_id].inv.length - 2) * 24 / 16 + 2) * 16, xx = canvas_id.width / zoom - width - 16, height = 0;
			for (let i = 0; i < ui_state.length; i++) {
				if (ui & ui_state[i]) {
					canvas.fillStyle = '#fff';
					switch(ui_state[i]) {
						case gui.inventory: // инвентарь:
							height = (obj[player_id].inv[0].length * 24 / 16 + 2) * 16;
							add_window(xx, yy, width, height, 'Инвентарь');
							let size = 24, offset = 2,
								nx = xx + (width - (obj[player_id].inv.length - 2) * (size + offset)) * .5,
								ny = yy - height + 8 + (height - obj[player_id].inv[0].length * (size + offset)) * .5;
							for (let i = 0; i < obj[player_id].inv.length - 2; i++) 
								for (let j = 0; j < obj[player_id].inv[i].length; j++) obj[player_id].inv[i][j].draw(canvas, nx + (size + offset) * i, ny + (size + offset) * j);
						break;
						case gui.character: // снаряжение:
							height = 416 / zoom;
							add_window(xx, yy, width, height, 'Персонаж');
							add_info(xx + width * .1, yy - height * .35, width * .8, ['Защита: ' + obj[player_id].stat.armor, 'Урон: ' + obj[player_id].stat.damage, 'Магия: ' + obj[player_id].stat.magic]);
							let pos = [[0, 0], [0, -32], [0, 32], [-32, 0], [32, 0]];
							canvas.fillStyle = '#000';
							for (let i = 0; i < pos.length; i++) obj[player_id].inv[obj[player_id].inv.length - 1][i].draw(canvas, xx + width * .5 + pos[i][0] - 12, yy - height * .6 + pos[i][1] - 12);
						break;
					}
					canvas.drawImage(images.inv, 48, 0, 8, 8, xx + width - 12, yy - height + 3, 8, 8);
					if (point_in_rectangle(cursor.x - camera.x, cursor.y - camera.y, xx + width - 12, yy - height + 3, 8, 8)) {
						mouse |= mouse_event.hover;
						if (mouse & mouse_event.lclick) {
							ui &=~ ui_state[i];
							mouse &=~ mouse_event.lclick;
						}
					}
					yy -= height + 8;
				}
			}
		}
		if (cursor.item.id != '') { // предмет у курсора:
			let item = Item[cursor.item.id];
			canvas.globalAlpha = .5;
			canvas.drawImage(images.items, item.left, item.top, 16, 16, cursor.x - camera.x, cursor.y - camera.y, 24, 24);
			canvas.globalAlpha = 1;
			if (mouse & mouse_event.lclick) {
				cursor.item = {
					id: '',
					count: 0,
					effect: 0,
					index: []
				};
				mouse &=~ mouse_event.lclick;
			}
		}
		if (placeholder.name != '') { // информация о предмете:
			let width = 100, xx = cursor.x - camera.x + 8, yy = cursor.y - camera.y + 8;
			if (xx + width >= canvas_id.width / zoom) xx = xx - (xx + width - canvas_id.width / zoom);
			if (yy + placeholder.height >= canvas_id.height / zoom) yy = yy - (yy + placeholder.height - canvas_id.height / zoom);
			let ny = yy, clr_name = ['#fff', '#4cff6d', '#75ecff', '#db3dff'];
			canvas.fillStyle = '#000';
			canvas.fillRect(xx, yy, width, placeholder.height);
			canvas.fillStyle = clr_name[placeholder.legendary];
			canvas.fillText(placeholder.name, xx + 4, yy + 4);
			canvas.fillStyle = '#fff';
			canvas.fillText('Использование <ПКМ>.', xx + 4, yy + placeholder.height - 10);
			canvas.fillStyle = '#ffe14c';
			canvas.fillText('(' + placeholder.lvl + 'lvl)', xx + 8 + canvas.measureText(placeholder.name).width, yy + 4);
			canvas.fillStyle = '#666';
			let type = '';
			switch(placeholder.type) {
				case 'weapon': type = 'Оружие'; break;
				case 'potion': type = 'Зелье, Еда'; break;
				case 'shield': type = 'Щит'; break;
				case 'helmet': type = 'Голова'; break;
				case 'body': type = 'Броня'; break;
				case 'boots': type = 'Ботинки'; break;
			}
			canvas.fillText('<' + type + '>', xx + 4, yy + 12);
			yy = yy + 22;
			let stats = ['damage', 'magic', 'health', 'armor'], clr = ['#ff3567', '#db3dff', '#4cff6d', '#a3a3a3'], name = ['урона', 'магии', 'здоровья', 'брони'];
			for (let i = 0; i < stats.length; i++) {
				if (typeof(placeholder.effect[stats[i]]) != 'undefined') {
					canvas.fillStyle = clr[i];
					canvas.fillText('+' + placeholder.effect[stats[i]] + ' ' + name[i], xx + 4, yy);
					yy += 8;
				}
			}
			if (placeholder.lvl > obj[player_id].lvl) {
				canvas.fillStyle = '#f00';
				canvas.fillText('Требуется ' + placeholder.lvl + ' уровень!', xx + 4, yy + 6);
				yy += 8;
			}
			placeholder.height = Math.abs(yy - ny) + 16;
		}
		canvas.fillStyle = '#000';
	}
};