const uploadFile = require("../middlewares/upload");
const uploadFiles = require("../middlewares/uploads");
const  ObjectId = require('mongodb').ObjectId;
const db = require("../models");
const Player = db.player;
const Increment = db.increment;
const fs = require('fs');
// global.__basedir = __dirname;


const getNextSequence = async(nm) => {
let counter = await Increment.findOne({name: nm});
if (!counter) {
  const increment = new Increment({
    name: nm,
    sequence_value: 0
  })
  await increment.save();
}
let sequenceDoc = await Increment.findOneAndUpdate(
  {
    name : nm
  },
  {
    $inc : {
      sequence_value: 1
    }
  }).exec();
  return sequenceDoc.sequence_value;
}

// upload file
exports.upload = async (req, res) => {
  try {
   
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // // rename the file 
    const file_name = Date.now()+'_'+req.file.originalname;
    const folderPath = __basedir+'/public/resources/assets/';
    // Rename the file
    fs.rename(folderPath+req.file.originalname, folderPath+'/'+file_name, () => {
      return res.status(200).send({
        message: "Uploaded the file successfully: " + file_name,
        filename: file_name
      });
    });   
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

exports.multiUpload = async (req, res) => {
  try {
   
    await uploadFiles(req, res);

    if (req.files == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // // rename the file   
    return res.status(200).send({
      message: "Uploaded the files successfully",
      count: req.files.length
    });
   
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file ${err}`,
    });
  }
};

exports.getListFiles = (req, res) => {
  const directoryPath = __basedir + "/public/resources/assets/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: __basedir+'/'+ file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

exports.download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/public/resources/assets/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
/* Add new employee*/
exports.createPlayer = async (req, resp, next) => {
// Emirates ID formate:  '784-1986-123456-2'
  try {
    // multiple creation
    if(req.body && Array.isArray(req.body)) {
      let insertedPlayers = [];
      for (let i = 0; i < req.body.length; i++) {
        const isValidated = req.body[i]['eidNo'] && req.body[i]['eidNo'].split('-').length === 4;
        if(isValidated) {
          let player = await Player.findOne({ emiratesIdNo: req.body[i]['eidNo'] }); 
          if (!player) {
            const playerNo = await getNextSequence("item_id");
            const playerData = new Player({
              firstName: req.body[i]['firstName'],
              lastName: req.body[i]['surName'],
              dob: new Date(req.body[i]['dob']),
              squadNo: req.body[i]['squadNo'],
              league:  ObjectId(req.body[i]['league']),
              academy:  ObjectId(req.body[i]['academy']),
              team:  ObjectId(req.body[i]['team']),
              playerNo: playerNo,
              playerImage: req.body[i]['playerImage'],
              emiratesIdNo:  req.body[i]['eidNo'],
              eidFront: req.body[i]['eidFront'],
              eidBack:  req.body[i]['eidBack'],
              playerStatus: req.body[i]['status'],
              user: ObjectId(req.body[i].user['createdBy']),
              createdAt:  new Date()
            });
            insertedPlayers.push(req.body[i]);
            await playerData.save();
          }
        }
      };
      resp.status(200).json(insertedPlayers);

    } else if( req.body && req.body['eidNo']) {
      // validate emirates id
      const isValidated = req.body['eidNo'] && req.body['eidNo'].split('-').length === 4;
      if(isValidated) {
        // check if the same eid is already in the database
        let player = await Player.findOne({ emiratesIdNo: req.body['eidNo'] });    
        if (!player) {  
          const playerNo = await getNextSequence("item_id");
          const playerData = new Player({
            firstName: req.body['firstName'],
            lastName: req.body['surName'],
            dob: new Date(req.body['dob']),
            squadNo: req.body['squadNo'],
            league:  ObjectId(req.body['league']),
            academy:  ObjectId(req.body['academy']),
            team:  ObjectId(req.body['team']),
            playerNo: playerNo,
            playerImage: req.body['playerImage'],
            emiratesIdNo:  req.body['eidNo'],
            eidFront: req.body['eidFront'],
            eidBack:  req.body['eidBack'],
            playerStatus: req.body['status'],
            user: ObjectId(req.body.user['createdBy']),
            createdAt:  new Date()
          });
  
          const savedPlayer = await playerData.save();
          resp.status(200).json({ player: savedPlayer, message: 'Player created successfully' });
        } else {
          resp.status(200).json({ message: 'Player already exists' });
        }
      }else {
        resp.status(200).json({ message: 'Emirates is not valid' });
      }
   } else {
      resp.status(200).json({ message: 'Malformed data provided' });
   }
  } catch (error) {
    next(error);
  }
};

exports.bulkUploadPlayers = async (req, resp, next) => {
    try {
      // multiple creation
      if(req.body && Array.isArray(req.body)) {
        let bkPlayers = req.body;
        let insertedPlayers = [];
        let Players = await Player.find().exec();
        let fltPlayers = bkPlayers.filter(bk => !Players.find(p => p.emiratesIdNo === bk['EID No']));
        for (let i = 0; i < fltPlayers.length; i++) {                    
              const playerData = new Player({
                firstName: fltPlayers[i]['First Name'],
                lastName: fltPlayers[i]['Surname'],
                dob: new Date(fltPlayers[i]['DOB']),
                squadNo: fltPlayers[i]['Squad Number'],
                league:  ObjectId(fltPlayers[i]['League']),
                academy:  ObjectId(fltPlayers[i]['academy']),
                team:  ObjectId(fltPlayers[i]['Team']),
                playerNo: fltPlayers[i]['Player ID Number'],
                playerImage: fltPlayers[i]['playerImage'],
                emiratesIdNo:  fltPlayers[i]['EID No'],
                eidFront: fltPlayers[i]['EID Front Upload'],
                eidBack:  fltPlayers[i]['EID Upload Back'],
                playerStatus: 'Pending',
                user: ObjectId(fltPlayers[i].User['id']),
                createdAt:  new Date()
              });
              insertedPlayers.push(fltPlayers[i]);
              await playerData.save();
        };
        resp.status(200).json({ message: 'Players created successfully', players: insertedPlayers });
      } else {
        resp.status(200).json({ message: 'Malformed data provided' });
     }
    } catch (error) {
      next(error);
    }
  };
  

/* GET all players listing. */
exports.getAllPlayers = (req, res) => {
  try {
    Player.find().populate("league").populate("academy").populate("team").populate("user").exec((err, players) => {
      if(err){
        return res.status(500).send({ message: err });
      }
      return res.status(200).json(players.length > 0? players: { message: 'No players found' });  
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

/* Get employee based on id*/
exports.playerByIdOrEID = async (req, resp, next) => {
  let pl = {};
  try {
    const { id } = req.params;
    if(id.includes('-') && id.split('-').length === 4){
      // check if emries id or normal id
      pl = await Player.findOne({ emiratesIdNo: id }).populate(["user", "league", "academy", "team"]).exec();
    } else {
      // check if emries id or normal id
      pl = await Player.find({ _id: ObjectId(id) }).populate(["user", "league", "academy", "team"]).exec();
    }
    resp.status(200).json(pl? pl : { message: 'Player not found'});
  } catch (error) {
    next(error);
  }
};


exports.playerByTeam = async (req, resp, next) => {
  let pl = {};
  try {
    const { id } = req.params;
    if(id) {
      // check if emries id or normal id
      pl = await Player.find({ team: ObjectId(id) }).populate(["user", "league", "academy", "team"]).exec();
    } 
    resp.status(200).json(pl ? pl : { message: 'Player not found'});
  } catch (error) {
    next(error);
  }
};

exports.playerByAcademy = async (req, resp, next) => {
  let pl = {};
  try {
    const { id } = req.params;
    if(id) {
      // check if emries id or normal id
      pl = await Player.find({ academy: ObjectId(id) }).populate(["user", "league", "academy", "team"]).exec();
    } 
    resp.status(200).json(pl ? pl : { message: 'Player not found'});
  } catch (error) {
    next(error);
  }
};

/* Edit existing employee based on id*/
exports.updatePlayer =  async (req, resp, next) => {
  try {
    const { id } = req.params;
    let fetchPlayer = await Player.find({_id: ObjectId(id)});

    if (!fetchPlayer) return resp.status(404).json({ msg: 'Player record not found' });
    fetchPlayer = {
      ...fetchPlayer._doc,
      ...req.body
    }

    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, fetchPlayer, { new: true });

    resp.status(200).json(updatedPlayer);

  } catch (error) {
    next(error);
  }
};

/* Edit existing employee based on id*/
exports.approvePlayer =  async (req, resp, next) => {

  try {

    const { id } = req.params;
    let fetchPlayer = await Player.find({_id: ObjectId(id)});

    if (!fetchPlayer) return resp.status(404).json({ message: 'Player record not found' });
    fetchPlayer = {
      ...fetchPlayer,
      playerStatus: req.body.playerStatus
    }
    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, fetchPlayer, { new: true });

    resp.status(200).json(updatedPlayer);

  } catch (error) {
    next(error);
  }
};

/* Delete employee based on id*/
exports.deletePlayer = async (req, resp, next) => {

  try {
    const player = await Player.findByIdAndDelete({ _id: ObjectId(req.params.id)});
    if(!player){
      resp.status(200).json({message: `Player ${player.firstName} record deleted!`})
    }
    resp.status(200).json({message: `Player ${player.firstName} record deleted!`})
  } catch (error) {
    next(error);
  }
};

/* Delete all Players*/
exports.deleteAllPlayers =  async (req, resp, next) => {

  try {
    const pl = await Player.remove({});
    resp.status(200).json({ msg: `All players records has been deleted!`})
  } catch (error) {
    next(error);
  }

};


