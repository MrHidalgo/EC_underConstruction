var command    =   require('./gulp-command.js');


var mainConfig = {

	build                       : {
		arr : [
			command.buildScss,
			command.buildJade,
			command.buildScript,
			command.sprites
		]
	}
};


module.exports.mainConfig = mainConfig;