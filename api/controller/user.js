'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una accion del controllador'
    })
}

function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                user.save(function (err, userStorage) {
                    if (err) {
                        res.status(500).send({message: "Error al guardar"});
                    } else {
                        if (!userStorage) {
                            res.status(404).send({message: "No se registro el user"});
                        } else {
                            res.status(200).send({user: userStorage});
                        }
                    }
                });
            } else {
                res.status(200).send({message: "Introduce los datos"});
            }
        });
    } else {
        res.status(500).send({message: "Introduce la password"});
    }

}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({'email': 'admin@admin.com'}, function (err, user) {
        if (err) {
            res.status(500).send({message: "request error"})
        } else {

            console.log(email.toLowerCase());
            if (!user) {
                res.status(404).send({message: "the user not exist"});
            } else {
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        if (params.getHash) {
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({user: user});
                        }
                    } else {
                        res.status(404).send({message: "erro in login"});
                    }
                })
            }
        }
    })
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos'});
    }

    User.findByIdAndUpdate(userId, update, function (err, userUpdated) {
        if (err) {
            res.status(500).send({message: 'Error al actualizar el usuario'});
        } else {
            if (!userUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar'});
            } else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "Not Upload";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {image: file_name}, function (err, userUpdated) {
                if (!userUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar'});
                } else {
                    res.status(200).send({image: file_name, user: userUpdated});
                }
            })
        } else {
            res.status(400).send({message: "Extension no valida"})
        }
    } else {
        res.status(200).send({message: "No has subido ninguna imagen"})
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;

    fs.exists(pathFile, function (exists) {
        if (exists) {
            res.sendfile(path.resolve(pathFile))
        } else {
            res.status(404).send({message: 'No existe la imagen'});
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};