'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec(function (err, song) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!song) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({song: song});
            }
        }
    });
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save(function (err, songStored) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!songStored) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({songStored: songStored});
            }
        }
    })

}

function getSongs(req, res) {
    var albumId = req.params.album;
    var find = null;
    if (!albumId) {
        find = Song.find({}).sort('number');
    } else {
        find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec(function (err, songs) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!songs) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({songs: songs});
            }
        }
    });
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, function (err, songUpdated) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!songUpdated) {
                res.status(404).send({message: 'No existe'});
            } else {
                res.status(200).send({songUpdated: songUpdated});
            }
        }
    })

}

function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, function (err, songRemoved) {
        if (err) {
            res.status(500).send({message: 'error en la peticion'})
        } else {
            if (!songRemoved) {
                res.status(404).send({message: 'El album no ha sido eliminado'});
            } else {
                res.status(200).send({song: songRemoved});
            }
        }
    });

}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = "Not Upload";

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();

        if (file_ext == 'mp3' || file_ext == 'ogg') {
            Song.findByIdAndUpdate(songId, {file: file_name}, function (err, songUpdated) {
                if (!songUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar'});
                } else {
                    res.status(200).send({image: file_name, song: songUpdated});
                }
            })
        } else {
            res.status(400).send({message: "Extension no valida"})
        }
    } else {
        res.status(200).send({message: "No has subido ninguna imagen"})
    }
}

function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var pathFile = './uploads/songs/' + songFile;

    fs.exists(pathFile, function (exists) {
        if (exists) {
            res.sendfile(path.resolve(pathFile))
        } else {
            res.status(404).send({message: 'No existe la cancion'});
        }
    })
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};