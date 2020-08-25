var express = require('express');
var router = express.Router();
var i18next = require('i18next');


class IndexController {
	static list(req, res, next) {
		res.render('index', { title: 'Express'}) ;
	}
}