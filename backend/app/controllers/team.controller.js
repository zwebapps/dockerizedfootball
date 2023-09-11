const  ObjectId = require('mongodb').ObjectId;
const db = require("../models");
const Team = db.team;

/* Add new team*/
exports.createTeam = async (req, resp, next) => {

  try {
    // multiple creation
    if(req.body && Array.isArray(req.body)) {
      let insertedTeams = [];
      for (let i = 0; i < req.body.length; i++) {
        const isValidated = req.body[i]['Team Name'] && req.body[i]['Team Name'].length > 0;
        if(isValidated) {
          let team = await Team.findOne({ teamName: req.body['Team Name'] }); 
          if (!team) { 
            const teamData = new Team({
              teamName:  req.body[i]['Team Name'],
              academy_id: req.body[i]['Academy Id'],
              leagues: [...req.body[i].leagues],
              user_id: ObjectId(req.body[i].user['createdBy']),
              createdAt: new Date()
            });
            insertedTeams.push(req.body[i]);
            await teamData.save();
          }
        }
      };
      resp.status(200).json(insertedTeams);

    } else if( req.body && req.body['Team Name']) {
      // validate Team Name
      const isValidated = req.body['Team Name'] && req.body['Team Name'].length > 0;
      if(isValidated) {
        // check if the same eid is already in the database
        const team = await Team.findOne({ teamName: req.body['Team Name'] });

        if (!team) {   
          const teamData = new Team({
            teamName:  req.body['Team Name'],
            academy_id: req.body['Academy Id'],
            leagues: [...req.body.leagues ],
            user_id: ObjectId(req.body.user['createdBy']),
            createdAt: new Date()
          });
  
          const savedPlayer = await teamData.save();
          resp.status(200).json(savedPlayer);
        } else {
          resp.status(200).json({ message: 'Team already exists' });
        }
      }else {
        resp.status(200).json({ message: 'Team Name is not valid' });
      }
   } else {
      resp.status(200).json({ message: 'Malformed data provided' });
   }
  } catch (error) {
    next(error);
  }
};


/* GET all team. */
exports.getAllTeams =  async (req, resp, next) => {
 
  try {
    const teams = await Team.find().populate(["academy_id", "leagues", "user_id"]).exec();
    resp.status(200).json(teams.length > 0? teams : { message: 'No team found' });
  } catch (error) {
    next(error);
  }
};

/* Get team based on id*/
exports.getTeamById = async (req, resp, next) => {
  try {
    const { id } = req.params;
    if(id) {
      const team = await Team.findOne({ _id: ObjectId(id) }).populate(["academy_id", "leagues", "user_id"]).exec();
      resp.status(200).json(team ? team: { message: 'No team found' });
    }else{
      resp.status(200).json({ message: 'Malformed Id provided' });
    }
  } catch (error) {
    next(error);
  }
};
exports.getTeamByAcademyId = async (req, resp, next) => {
  try {
    const { id } = req.params;
    if(id) {
      const team = await Team.find({ academy_id: ObjectId(req.params.id) }).populate(["academy_id", "leagues", "user_id"]).exec();
      resp.status(200).json(team.length > 0 ? team: { message: 'No team found' });
    }else{
      resp.status(200).json({ message: 'Malformed Id provided' });
    }
  } catch (error) {
    next(error);
  }
};

/* Edit existing team based on id*/
exports.updateTeam =  async (req, resp, next) => {
  try {
    const { id } = req.params;
    if(id) {
    let fetchTeam = await Team.find({_id: ObjectId(id)}).populate(["academy_id", "leagues", "user_id"]).exec();

    if (!fetchTeam) return resp.status(404).json({ message: 'Team record not found' });
    fetchTeam = {
      ...fetchTeam._doc,
      ...req.body
    }

    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, fetchTeam, { new: true });

    resp.status(200).json(updatedTeam).status(200);
  } else {
    resp.status(200).json({ message: 'Malformed Id provided' });
  }

  } catch (error) {
    next(error);
  }
};


/* Delete team based on id*/
exports.deleteTeam = async (req, resp, next) => {

  try {
    if(req.params && req.params.id) {
    const team = await Team.findByIdAndDelete( { _id: ObjectId(req.params.id)} );
    if(!team){
      resp.status(200).send(`Team record not found!`)
    }
    resp.status(200).send(`Team ${team.teamName} record deleted!`)
  } else {
    resp.status(200).json({ message: 'Malformed Id provided' });
  }
  } catch (error) {
    next(error);
  }

};

/* Delete all Players*/
exports.deleteAllTeams =  async (req, resp, next) => {

  try {
    const team = await Team.remove({});
    resp.status(200).json({ message: `All teams has been deleted!`})
  } catch (error) {
    next(error);
  }

};
