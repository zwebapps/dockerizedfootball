const  ObjectId = require('mongodb').ObjectId;
const db = require("../models");
const User = db.user;
const Role = db.role;
const Contact = db.contact;
const bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send({ content: "Public Content." });
};

exports.userBoard = (req, res) => {
  res.status(200).json({ content: "User Content." });
};

exports.adminBoard = (req, res) => {
  res.status(200).json({ content: "Admin Content." });
};
exports.moderatorBoard = (req, res) => {
  res.status(200).json({ content: "Moderator Content."});
};

exports.getAllUsers = (req, res) => {
  // get users
   User.find().populate("roles").exec((err, users) => {
    if(err){
      return res.status(500).send({ message: err });
    }
     return res.status(200).json(users.length > 0? users : { message: 'No user found' });
   });
};

exports.createUser = async (req, res) => {
  // get users
  if( req.body && req.body['username'] && req.body['password'].length > 0) {
    // validate emirates id
    const isValidated = req.body['username'] && req.body['username'].length > 0;
    if(isValidated) {
      // check if the same eid is already in the database
      let user = await User.findOne({ email: req.body['email'] });
      // get role by name
      let role = await Role.findOne({ name: req.body['role']  });
     
      if (!user) {   
        const userData = new User({
          firstname: req.body['firstname'],
          lastname: req.body['lastname'],
          username: req.body['username'],
          contact: req.body['contact'],
          password: bcrypt.hashSync(req.body['password'], 8),
          email: req.body['email'],
          roles: [ObjectId(role._id)]
        });

        const  savedUser = await userData.save();
        res.status(200).json(savedUser);
      } else {
        res.status(200).json({ message: 'User already exists' });
      }
    } else {
      res.status(200).json({ message: 'Name is not valid' });
    }
  } else {
    res.status(200).json({ message: 'Username  is not valid' });
  }
};


exports.deleteUser = async (req, resp, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: ObjectId(req.params.id)});
    if(!user){
      return resp.status(200).json({message: `No record found`, type: 'error'})
    }
    return resp.status(200).json({message: `User ${user.firstName} record deleted!`})
  } catch (error) {
    next(error);
  }
};

exports.UserByIdOrEID = async (req, resp, next) => {
   try {
    const { id } = req.params;
    if(id && id.includes(',')){
      let userIds = id.split(",");
      const users = await User.find({ _id: { "$in" : userIds } }).populate("roles").exec();
      resp.status(200).json(users? users : { message: 'Users not found'});
    } else {
      // check if emries id or normal id
      const userData = await User.findOne({ _id: ObjectId(id) }).populate("roles").exec();
      resp.status(200).json(userData? userData : { message: 'User not found'});
    }
  } catch (error) {
    next(error);
  }
};


exports.updateUser =  async (req, resp, next) => {
  try {
    const { id } = req.params;
    let fetchUser = await User.findOne({_id: ObjectId(id)});

    if (!fetchUser) return resp.status(404).json({ msg: 'User record not found' });
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    fetchUser = {
      ...fetchUser._doc,
      ...req.body
    }

   User.findByIdAndUpdate({ _id : ObjectId(req.params.id)},
   {
    $set: fetchUser
   },
   { new: true }).then((updatedUser) => {
     return resp.status(200).json(updatedUser);
     
   });

  } catch (error) {
    next(error);
  }
};


exports.createContact = async (req, res) => {
  // get users
  if( req.body && req.body['heading'] && req.body['content'].length > 0) {     
      const contactData = new Contact({
        heading: req.body['heading'],
        content: req.body['content'],       
        user: ObjectId(req.body.user['id']),
        status: 'Pending',
        createdAt: new Date(),
      });

      const savedContact = await contactData.save();
      res.status(200).json({ data: savedContact, message: 'Contact created successfully!'});
    } else {
      res.status(200).json({ message: 'Data is not provided correctly' });
    }
 
}
exports.updateContact = async (req, res) => {
  try {
  const { id } = req.params; 
  // get users
      if(id) {
        let fetchContact = await Contact.findOne({_id: ObjectId(id)});

        if (!fetchContact) return resp.status(404).json({ msg: 'Content record not found' });
        fetchContact = {
          ...fetchContact._doc,
          reply: req.body.reply,
          status: req.body.status
        }
            
      Contact.findByIdAndUpdate({ _id : ObjectId(id)},
      {
        $set: fetchContact
      },
      { new: true }).then((updateContent) => {
        return res.status(200).json({ content: updateContent, message: 'Notifications updated successfully!'});
      });
    }

  } catch (error) {
    next(error);
  }
     
}

exports.contentDelete = async (req, resp, next) => {
  try {
    const content = await Contact.findByIdAndDelete({ _id: ObjectId(req.params.id)});
    if(!content){
      return resp.status(200).json({message: `No record found`, type: 'error'})
    }
    return resp.status(200).json({ message: `Content record deleted!` })
  } catch (error) {
    next(error);
  }
}
exports.getAllContacts = (req, res) => {
  // get users
   Contact.find().populate("user").exec((err, users) => {
    if(err){
      return res.status(500).send({ message: err });
    }
     return res.status(200).json(users.length > 0? users : { message: 'No content found' });
   });
};

exports.allContactsByIdCoach = async (req, res) => {
  const { id } = req.params; 
  // get users
   const content = await Contact.find({user: ObjectId(id) }).populate("user").exec()
   if(content) {
      return res.status(200).send({conent: content,  status:'Success', message: "Conents fetched successrully!" });
    }else {
     return res.status(200).json({ message: 'No content found' });
   };
};