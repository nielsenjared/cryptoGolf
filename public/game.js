// 'use strict';

const coins = ["BTCUSD", "LTCUSD", "ETHUSD", "XMRUSD", "LTCBTC", "ETHBTC", "XMRBTC"];
const tFrame = ["1m", "1h", "1D"];
let coin = null;
let points = [];

const getCoin = () => {
	document.getElementById("btc").addEventListener("click", () => {
		return coin = coins[0];
	});
	document.getElementById("ltc").addEventListener("click", () => {
		return coin = coins[1];
	});
	document.getElementById("eth").addEventListener("click", () => {
		return coin = coins[2];
	});
	document.getElementById("startBtn").addEventListener("click", () => {
		let ui = document.getElementById("ui");
		ui.style.display = "none";
		golf();

	});
}

const golf = async () => {

	// module aliases
	const Engine = Matter.Engine,
		Render = Matter.Render,
		World = Matter.World,
		Constraint = Matter.Constraint,
		Mouse = Matter.Mouse,
		MouseConstraint = Matter.MouseConstraint,
		Composite = Matter.Composite,
		Composites = Matter.Composites,
		Body = Matter.Body,
		Bodies = Matter.Bodies,
		Vector = Matter.Vector,
		Vertices = Matter.Vertices;

	// create an engine
	const engine = Engine.create();
	// THIS RENDERS OUR CANVAS
	const render = Render.create({
		width: 1200,
		height: 800,
		element: document.body,
		engine: engine
	});

	const pullCandleClose = async () => {

		let queryURL = "https://api.bitfinex.com/v2/candles/trade:1M:tBTCUSD/hist";
		let response = await fetch(queryURL);
		let graphData = await response.json();

		for (let i = 0; i < 30; i++) {
			points.push(Math.floor(graphData[i][2]));
		}
		return points;
	}

	let path = await pullCandleClose();

	//TODO FIX MIN AND MAX VALUES
	let minValue = Math.min(path);
	console.log(minValue);
	// console.log(path);
	// console.log(minValue);
	// for (var i = 0; i < path.length; i++) {
	//   path[i] = path[i] - minValue;
	// }
	let maxValue = Math.max(path[0]);
	var lines = [];

	// Terrain
	//REVIEW WILL RENDER
	for (let i = 0; i < path.length - 1; i++) {
		let x = (i + (i + 1)) / 2 * 30; //*5 only used to span graph
		let y = 600 - ((path[i] + path[i + 1]) / 2 * (350 / maxValue)); //scaling to fit area
		// console.log(y);
		let adjacent = 1 * 30;
		let opposite = (path[i + 1] - path[i]) * (350 / maxValue);
		let angle = Math.atan(opposite / adjacent);
		// console.log(angle);
		let line = Bodies.rectangle(x, y, Math.sqrt(opposite ** 2 + adjacent ** 2), 1, {
			isStatic: true,
			angle: -angle
		});
		// World.add(engine.world, line);
		lines.push(line);
	}


	let ball = Bodies.circle(40, 20, 30);
	World.add(engine.world, lines);
	World.add(engine.world, ball);
	// run the engine
	Engine.run(engine);
	// run the renderer
	Render.run(render);
};
