'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec(function (err, album) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!album) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({album: album});
            }
        }
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;
    var find = null;
    if (!artistId) {
        find = Album.find({}).sort('title');
    } else {
        find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec(function (err, albums) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!albums) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({albums: albums});
            }
        }
    });
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, function (err, albumUpdated) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!albumUpdated) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({albumUpdated: albumUpdated});
            }
        }
    })

}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = params.image;
    album.artist = params.artist;

    album.save(function (err, albumStored) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!albumStored) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({albumStored: albumStored});
            }
        }
    })

}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, function (err, albumRemoved) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!albumRemoved) {
                res.status(404).send({message: 'El album no ha sido eliminado'});
            } else {
                Song.find({artist: albumRemoved._id}).remove(function (err, songRemoved) {
                    if (err) {
                        res.status(500).send({message: 'error en la peticion'})
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({message: 'La cancion no ha sido eliminado'});
                        } else {
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });

}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = "Not Upload";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, {image: file_name}, function (err, albumUpdated) {
                if (!albumUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar'});
                } else {
                    res.status(200).send({image: file_name, album: albumUpdated});
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
    var pathFile = './uploads/album/' + imageFile;

    fs.exists(pathFile, function (exists) {
        if (exists) {
            res.sendfile(path.resolve(pathFile))
        } else {
            res.status(404).send({message: 'No existe la imagen'});
        }
    })
}

module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}