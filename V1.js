var screenshot = require('desktop-screenshot');
var gm = require('gm');
var nodecr = require('nodecr');
var google = require('google');
var question;
var answers;

function gmA() {
	gm('screenshot.jpg')
	.crop('378', '207', '23', '312')
	.write('answers.jpg', function (err) {
		if (!err) {
			console.log("Answers Resized");
		}
	});
}

function gmQ() {
	gm('screenshot.jpg')
	.crop('372', '98', '26', '192')
	.write('question.jpg', function (err) {
		if (!err) {
          console.log("Question resized");
		}
	})
}

function tesseract() {
	nodecr.process('question.jpg', function(err, text) {
		if(err) {
			console.error(err);
		} else {
			question = text.replace(/\n/g, " ");
			console.log('Question:"' + question + '"');
		}
	});
	nodecr.process('answers.jpg', function(err, text) {
		if(err) {
			console.error(err);
		} else {
			answers = text.replace(/^\s*$[\n\r]{1,}/gm, '');
			answers = answers.split(/\n/g);
			answers = answers.filter(function(e) { return e === 0 || e });
			for (var i = 0; i < answers.length; i++) {
				console.log("The Answers are: " + answers[i]);
			}
		}
	});
}

function googleSearch() {
	google.resultsPerPage = 20;
//	var nextCounter = 0;

	google(question, function(err, res) {
		if (err) console.error(err)
		console.log("Searching Google for the Question");
		for (var i = 0; i < res.links.length; ++i) {
			var link = res.links[i];
			if (link.link != null) {
				if(link.title.indexOf(answers[0]) != -1) {
					console.log(answers[0] + " found in the Title of Top 20 Google Results.");
				}
				if(link.description.indexOf(answers[0]) != -1) {
					console.log(answers[0] + " Found in the description of Top 20 Google Results.");
				}
			}
		}
	})
}

screenshot("screenshot.jpg", {width: 1920}, function(error, complete) {
	if(error)
		console.log("Screenshot failed", error);
	else
		console.log("Screenshot Complete");
		gmQ();
		gmA();
});

tesseract();
googleSearch();
