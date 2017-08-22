'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, function (err, artist) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!artist) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({artist: artist});
            }
        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = params.image;
    artist.save(function (err, artistStored) {
        if (err) {
            res.status(500).send({message: 'error l gurdar el artista'})
        } else {
            if (!artistStored) {
                res.status(404).send({message: 'No se ha guardado'});
            } else {
                res.status(200).send({artist: artistStored});
            }
        }
    })
}

function getArtists(req, res) {
    var page = ((typeof req.params.page != "undefined") ? req.params.page : 1);
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!artists) {
                res.status(404).send({message: 'No existe'});
            } else {
                return res.status(200).send({totalItems: total, artists: artists});
            }
        }
    })
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, function (err, artistUpdated) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!artistUpdated) {
                res.status(404).send({message: 'No existe'});
            } else {
                return res.status(200).send({artists: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, function (err, artistRemoved) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!artistRemoved) {
                res.status(404).send({message: 'No existe'});
            } else {
                Album.find({artist: artistRemoved._id}).remove(function (err, albumRemoved) {
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
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = "Not Upload";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, {image: file_name}, function (err, artistUpdated) {
                if (!artistUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar'});
                } else {
                    res.status(200).send({image: file_name, artist: artistUpdated});
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
    var pathFile = './uploads/artists/' + imageFile;

    fs.exists(pathFile, function (exists) {
        if (exists) {
            res.sendfile(path.resolve(pathFile))
        } else {
            res.status(404).send({message: 'No existe la imagen'});
        }
    })
}


module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile

};