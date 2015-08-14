var models = require('../models/models.js');

var stats = {
	questions: 0,
	comments: 0,
	qnocomments: 0,
	qcomments: 0
};

exports.show = function(req,res, next){
	//var preguntas = 0;
	//var prueba;
	models.Quiz.count().
	then(function(count){
		stats.questions = count;
		return models.Comment.count();
	})
	.then(function(count){
		stats.comments = count;
		return models.Comment.aggregate('QuizId','count',{distinct: true});
	})
	.then(function(count){
		stats.qcomments = count;
	})
	.catch(function(error){
		next(error);
	})
	.finally(function(){
		res.render('statistics/show.ejs', {stats: stats ,errors: []});
	});
	//console.log('PRUEBA: ' + stats.questions);
	//console.log('MIRAR AQUI: ' + preguntas.then(function(count){ preguntas = count;}));
	//console.log('MIRAR AQUI: ' + preguntas);
	//var comentarios = models.Comment.count();
	//var comPreg = comentarios/preguntas;
	//var quiz = models.Quiz.build({questions: preguntas,comments: comentarios,commQue: comPreg});
	//console.log('quiz: ' +quiz.questions);
};
