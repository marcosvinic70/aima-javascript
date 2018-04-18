/* The general structure is to put the AI code in xyz.js and the visualization
   code in c_xyz.js. Create a diagram object that contains all the information
   needed to draw the diagram, including references to the environment&agents.
   Then use a draw function to update the visualization to match the data in
   the environment & agent objects. Use a separate function if possible for
   controlling the visualization (whether through interaction or animation).
   Chapter 2 has minimal AI and is mostly animations. */

const SIZE = 100;
const colors = {
	perceptBackground: 'hsl(240,10%,85%)',
	perceptHighlight: 'hsl(60,100%,90%)',
	actionBackground: 'hsl(0,0%,100%)',
	actionHighlight: 'hsl(150,50%,80%)'
};


/* Create a diagram object that includes the world (model) and the svg
   elements (view) */
function makeDiagram(selector) {
	let diagram = {}, world = new World(4);
	diagram.world = world;
	diagram.xPosition = (floorNumber) =>  floorNumber * 600 / diagram.world.floors.length;

	diagram.root = d3.select(selector);
	diagram.robot = diagram.root.append('g')
		.attr('class', 'robot')
		.style('transform', `translate(${diagram.xPosition(world.location)}px,100px)`);
	diagram.robot.append('rect')
		.attr('width', SIZE)
		.attr('height', SIZE)
		.attr('fill', 'hsl(120,25%,50%)');
	diagram.perceptText = diagram.robot.append('text')
		.attr('x', SIZE/2)
		.attr('y', -25)
		.attr('text-anchor', 'middle');
	diagram.actionText = diagram.robot.append('text')
		.attr('x', SIZE/2)
		.attr('y', -10)
		.attr('text-anchor', 'middle');

	diagram.floors = [];
	for (let floorNumber = 0; floorNumber < world.floors.length; floorNumber++) {

		diagram.floors[floorNumber] =
			diagram.root.append('rect')
			.attr('class', 'clean floor') // for css
			.attr('x', diagram.xPosition(floorNumber))
			.attr('y', 225)
			.attr('width', SIZE)
			.attr('height', SIZE/4)
			.attr('stroke', 'black')
			.on('click', function() {
				world.markFloorDirty(floorNumber);
				diagram.floors[floorNumber].attr('class', 'dirty floor');
			})
			.on('dblclick', function() {
				world.markFloorVeryDirty(floorNumber);
				diagram.floors[floorNumber].attr('class', 'Vdirty floor');
			})
			;
	}
	return diagram;
}


/* Rendering functions read from the state of the world (diagram.world)
   and write to the state of the diagram (diagram.*). For most diagrams
   we only need one render function. For the vacuum cleaner example, to
   support the different styles (reader driven, agent driven) and the
   animation (agent perceives world, then pauses, then agent acts) I've
   broken up the render function into several. */

function renderWorld(diagram) {
	for (let floorNumber = 0; floorNumber < diagram.world.floors.length; floorNumber++) {
		diagram.floors[floorNumber].attr('class', () => {

			if(!diagram.world.floors[floorNumber].Vdirty && !diagram.world.floors[floorNumber].dirty) {

					return 'clean floor';

				} else if(diagram.world.floors[floorNumber].Vdirty) {

					return 'Vdirty floor';

				} else {

					return 'dirty floor';

				}
		})
	}
	diagram.robot.style('transform', `translate(${diagram.xPosition(diagram.world.location)}px,100px)`);
}

function renderAgentPercept(diagram, dirty, Vdirty) {
	let perceptLabel = () => {
			if(!dirty) {

				return "It's clean";

			} else if(Vdirty) {

				return "It's very dirty";

			} else {

				return "It's dirty";

			}
		}

	diagram.perceptText.text(perceptLabel);

}

function renderAgentAction(diagram, action) {
	let actionLabel = {null: 'Waiting', 'SUCK': 'Vacuuming', 'A': 'Going to A', 'B': 'Going to B', 'C': 'Going to C', 'D': 'Going to D', 'WASH': 'Washing'}[action];
	diagram.actionText.text(actionLabel);
}


/* Control the diagram by letting the AI agent choose the action. This
   controller is simple. Every STEP_TIME_MS milliseconds choose an
   action, simulate the action in the world, and draw the action on
   the page. */

const STEP_TIME_MS = 2500;
function makeAgentControlledDiagram() {
	let diagram = makeDiagram('#agent-controlled-diagram svg');
	function update() {
		let location = diagram.world.location;
		let percept = diagram.world.floors[location].dirty;
		let perceptVdirty = diagram.world.floors[location].Vdirty;
		let action = reflexVacuumAgent(diagram.world);
		diagram.world.simulate(action);
		renderWorld(diagram);
		renderAgentPercept(diagram, percept, perceptVdirty);
		renderAgentAction(diagram, action);
	}
	update();
	setInterval(update, STEP_TIME_MS);
}

makeAgentControlledDiagram();
