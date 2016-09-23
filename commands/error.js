module.exports = function (param) {
	console.error("Invalid command entered: %s with arguments", param.args[0], param.args.slice(1));
};
