var countEnemy = 0;
var lives = 1;
var duid = 0;
function loadImages() {
	enemyImage = new Image();
	shipImage = new Image();
	bulletImage = new Image();
	bulletupgradedImage = new Image();

	enemyImage.src = "Images/enemy.png";
	shipImage.src = "Images/player.png";
	bulletImage.src = "Images/bullet.png";
	bulletupgradedImage.src = "Images/bulletupgraded.png";
}

function init() {
	canvas = document.getElementById('mycanvas');
	console.log(canvas);
	gameover = false;

	ctx = canvas.getContext('2d');

	W = canvas.width;
	H = canvas.height;
	prev_counter = 0;
	counter = 0;

	loadImages();

	// gambar shipnya
	ship = {
		x: 600,
		y: H - 70,
		w: 50,
		h: 50,
		speed: 25,
		bullets: [],

		update: function () {
			//this.x = this.x + this.speed;

			//if(this.x >= W-this.w || this.x<=0){
			//	this.speed *= -1;
			//}
		},

		draw: function () {
			ctx.drawImage(shipImage, ship.x, ship.y, ship.w, ship.h)
		},

		shoot: function () {

			if (counter - prev_counter >= 1) {
				console.log("tembak");

				var b = new bullet(this.x + (this.w) / 2, this.y, 10);
				this.bullets.push(b);
				prev_counter = counter;

				enemies.forEach(function (enemy) {

					//if(isColliding(this.bullets[this.bullets.length()-1],enemy)){
					if (isCollidingWithBullet(b, enemy)) {
						this.state = "inactive";
						console.log("musuh mati");
						var index = enemies.indexOf(enemy);
						enemies.splice(index, 1);
						countEnemy++;
						duid = Math.floor(countEnemy/10);
					}
					console.log(countEnemy);
				});
			}
		}
	};

	// control

	var kombo = {}; //ini array untuk menyimpan tombol apa saya yang ditekan saat itu
	window.addEventListener("keydown", detekKeyboard, true)
	window.addEventListener("keyup", lepasKeyboard, true)

	function detekKeyboard(e) {
		kode = e.keyCode;
		kombo[kode] = true; //tombol yang ditekan, indeks untuk tombol tersebut bernilai true

		//kiri
		if (kombo[37] == true) {
			ship.x = ship.x - ship.speed;
			if (ship.x <= 0) {
				ship.x = 0;
			}
			if (kombo[32] == true) { //sama dengan atas
				ship.shoot();
			}
		}
		//kanan
		if (kombo[39] == true) {
			ship.x = ship.x + ship.speed;
			if (ship.x >= W - ship.w) {
				ship.x = W - ship.w;
			}
			if (kombo[32] == true) { //sama dengan atas
				ship.shoot();
			}
		}

		//spacebar
		if (kombo[32] == true) { //sama dengan atas
			ship.shoot();
		}
	}

	function lepasKeyboard(e) {
		kode = e.keyCode;
		kombo[kode] = false;
		tembak = "";
	}
	//---- deteksi keyboard end ----

	enemies = [];
	var e = new enemy(10, 20, 5);
	enemies.push(e);

}

// Class Bullet
function bullet(x, y, speed) {
	this.x = x;
	this.y = y;
	this.w = 4;
	this.h = 14;
	this.state = "active"
	this.speed = speed;

	this.draw = function () {

		//ctx.fillStyle = "red"
		//ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.drawImage(bulletImage, this.x, this.y, this.w, this.h);

	}

	this.update = function () {
		this.y -= this.speed;

		if (this.y <= 0) {
			this.state = "inactive"
		}
	}

}

// Class Musuh
function enemy(x, y, speed) {
	this.x = x;
	this.y = y;
	this.w = 50;
	this.h = 50;
	this.state = "active"
	this.speed = speed;

	this.draw = function () {

		ctx.drawImage(enemyImage, this.x, this.y, this.w, this.h);

	}

	this.update = function () {

		this.x = this.x + this.speed;

		//ngecek apakah sudah di pinggir layar, jika sudah maka memantul (ke arah sebaliknya)
		if (this.x >= W - this.w || this.x <= 0) {
			this.speed *= -1;
		}

		this.y++;

		if (this.y <= 0) {
			this.state = "inactive"
		}
	}

}


function draw() {

	//hapus layar
	ctx.clearRect(0, 0, W, H);

	ctx.fillStyle = "red"

	//gambar kapal
	ship.draw()

	//gambar peluru
	ship.bullets.forEach(function (bullet) {
		bullet.draw();
	});

	//gambar musuh
	enemies.forEach(function (enemy) {
		enemy.draw();

	});
	
	//gambar score
	ctx.font = "30px Comic Sans MS ";
	ctx.fillStyle = "white";
	ctx.fillText("Score "+": "+countEnemy, 10, 50);
	ctx.fillText("Lives  "+": "+lives, 10, 85);
	ctx.fillText("Duid   "+": $ "+duid, 10, 125);

}

function update() {
	ship.update()

	ship.bullets.forEach(function (bullet) {
		bullet.update();

	});

	enemies.forEach(function (enemy) {
		enemy.update();
	});

	var no = Math.random();
	if (no < 0.02) {
		var x = Math.floor(Math.random() * (W - 50));x
		var y = Math.floor(Math.random() * 100);

		var speed = Math.random() * 10 + 2;
		var negative = Math.random();
		if (negative < 0.5) {
			speed = -speed;
		}

		var e = new enemy(x, y, speed);
		enemies.push(e);
	}

	enemies.forEach(function (enemy) {
		if (isColliding(ship, enemy)) {
			alert("GAME OVER! Silakan pencet OK untuk mengulang.");
			gameover = true;
			countEnemy = 0;
		}

	});
}

function isColliding(r1, r2) {
	var x_axis = Math.abs(r1.x - r2.x) <= Math.max(r1.w, r2.w);
	var y_axis = Math.abs(r1.y - r2.y) <= Math.max(r1.h, r2.h);

	return x_axis && y_axis;
}

function isCollidingWithBullet(r1, r2) {
	var x_axis = Math.abs(r1.x - r2.x) <= Math.max(r1.w, r2.w);
	var y_axis = Math.abs(r1.y - r2.y) <= Math.max(r1.h, r2.h);

	return x_axis || y_axis;
}

//fungsi memanggil fungsi update() and draw()
function render() {
	draw();
	update();
	console.log("in render");
	counter++;

	// similar to setInterval()
	if (gameover == false) {
		// similar to setInterval()
		window.requestAnimationFrame(render);
	} else {
		startGame();
	}
}

function startGame() {
	init();
	render();
}

startGame();