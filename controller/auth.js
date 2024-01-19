const bcrypt = require('bcrypt');
const Member = require('../model/member');

exports.join = async(req, res, next) =>{
    const {email, password} = req.body;
    
}