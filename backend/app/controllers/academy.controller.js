const  ObjectId = require('mongodb').ObjectId;
const db = require("../models");
const Academy = db.academy;

/* Add new employee*/
exports.createAcademy = async (req, resp, next) => {
  try {
    // multiple creation
    if(req.body && Array.isArray(req.body)) {
      let insertedAcademies = [];
      for (let i = 0; i < req.body.length; i++) {
        const isValidated = req.body[i]['Academy Name'] && req.body[i]['Academy Name'].length > 0;
        if(isValidated) {
          let academy = await Academy.findOne({ academyName: req.body[i]['Academy Name'] }); 
          if (!academy) { 
            const academyData = new Academy({
              academyName: req.body[i]['Academy Name'],   
              coach: [ ObjectId(req.body[i].user['createdBy'])],
              createdAt:  new Date()
            });
            insertedAcademies.push(req.body[i]);
            await academyData.save();
          }
        }
      };
      resp.status(200).json(insertedAcademies);

    } else if( req.body && req.body['Academy Name']) {
      // validate emirates id
      const isValidated = req.body['Academy Name'] && req.body['Academy Name'].length > 0;
      if(isValidated) {
        // check if the same eid is already in the database
        let academy = await Academy.findOne({ academyName: req.body['Academy Name'] });  
        if (!academy) {   
          const academyData = new Academy({
            academyName: req.body['Academy Name'],           
            coach: [ObjectId(req.body.user['createdBy'])],
            createdAt:  new Date()
          });
  
          const savedAcademy = await academyData.save();
          resp.status(200).json(savedAcademy);
        } else {
          resp.status(200).json({ message: 'Academy already exists' });
        }
      } else {
        resp.status(200).json({ message: 'Name is not valid' });
      }
   } else {
      resp.status(200).json({ message: 'Malformed data provided' });
   }
  } catch (error) {
    next(error);
  }
};

exports.getAcademyByName = async (req, resp, next) => {
  try {
    if( req.body && req.body.name) {
      const academy = await Academy.findOne({ academyName: req.body.name }).populate("coach").exec();
      resp.status(200).json(academy? academy: { message: 'No academy found' });
    } else {
      resp.status(200).json({message: 'Academy name is required to found'});
    }
  } catch (error) {
    next(error);
  }
};


/* GET all academies. */
exports.getAllAcademys =  async (req, resp, next) => {
  try {
    const academies = await Academy.find().populate("coach").exec();
    resp.status(200).json(academies.length > 0? academies : { message: 'No academy found' });
  } catch (error) {
    next(error);
  }
};

/* Get academy based on id*/
exports.getAcademyById = async (req, resp, next) => {
  try {
    if( req.params && req.params.id ) {
      const academy = await Academy.findOne({ _id: ObjectId(req.params.id)}).populate("coach").exec();
      resp.status(200).json(academy);
    } else {
      resp.status(200).json({message: 'Academy id is required to found'});
    }
  } catch (error) {
    next(error);
  }
};

exports.getAcademyByCoach  = async (req, resp, next) => {
  try {
    if( req.params && req.params.id ) {
      const academy = await Academy.findOne({ coach: ObjectId(req.params.id)}).populate("coach").exec();
      if(academy) resp.status(200).json(academy);
    } else {
      resp.status(200).json({message: 'Academy id is required to found'});
    }
  } catch (error) {
    next(error);
  }
};

exports.updateAcademyCoach  =  async (req, resp, next) => {

  try {
    const { id } = req.params;
    let fetchAcademy = await Academy.findOne({_id: ObjectId(id)});

    if (!fetchAcademy) return resp.status(404).json({ message: 'Academy record not found' });
    // updating academy
    fetchAcademy = {
      ...fetchAcademy,
      coach: fetchAcademy.coach.push(ObjectId(req.body.coach)) 
    }

    const updatedAcademy = await Academy.findByIdAndUpdate(req.params.id, fetchAcademy, { new: true });

    resp.status(200).json(updatedAcademy);

  } catch (error) {
    next(error);
  }
};

exports.updateAcademyCoach  =  async (req, resp, next) => {
  try {
    const { id } = req.params;
    let fetchAcademy = await Academy.findOne({_id: ObjectId(id)});

    if (!fetchAcademy) return resp.status(404).json({ message: 'Academy record not found' });
    // coach already existing
    if(fetchAcademy.coach && fetchAcademy.coach.includes(ObjectId(req.body.coach))) {
    let fetchAcademy = await Academy.findOne({_id: ObjectId(id)});
      fetchAcademy.coach = fetchAcademy.coach.filter(ch => ObjectId(ch) !== ObjectId(req.body.coach)) 
    } else {
      fetchAcademy.coach.push(ObjectId(req.body.coach)) 
    }
 
    const updatedAcademy = await Academy.findByIdAndUpdate(req.params.id, fetchAcademy, { new: true });

    resp.status(200).json(updatedAcademy);

  } catch (error) {
    next(error);
  }
};
/* Edit existing academy based on id*/
exports.updateAcademy =  async (req, resp, next) => {

  try {
    const { id } = req.params;
    let fetchAcademy = await Academy.findOne({_id: ObjectId(id)}).populate("coach").exec();

    if (!fetchAcademy) return resp.status(404).json({ message: 'Academy record not found' });
    // updating academy
    fetchAcademy = {
      ...fetchAcademy._doc,
      ...req.body
    }

    const updatedAcademy = await Academy.findByIdAndUpdate(req.params.id, fetchAcademy, { new: true });

    resp.status(200).json(updatedAcademy);

  } catch (error) {
    next(error);
  }
};

/* Delete Academy based on id*/
exports.deleteAcademy = async (req, resp, next) => {
  try {
    const academy = await Academy.findByIdAndDelete({ _id: ObjectId(req.params.id) });
    if(!academy) {
      resp.status(404).json({ message:`No academy record found!`})
    }
    resp.status(200).json({ message: `Academy ${academy.academyName} record deleted!`})
  } catch (error) {
    next(error);
  }
};

/* Delete all Academy*/
exports.deleteAllAcademys =  async (req, resp, next) => {

  try {
    const academy = await Academy.remove({});
    resp.status(200).json({ message:`All academies records has been deleted!`})
  } catch (error) {
    next(error);
  }

};