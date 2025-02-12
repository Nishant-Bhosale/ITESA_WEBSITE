const Event = require("../models/event");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

// exports.createEvent = (req, res) => {
//   const event = new Event(req.body);
//   event.save((err, event) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Failed to create Event!",
//       });
//     }
//     res.json({ event });
//   });
// };

exports.getEventById = (req, res, next, id) => {
  Event.findById(id)
    .populate("category")
    .exec((err, event) => {
      if (err) {
        return res.status(400).json({
          error: "Event not found!",
        });
      }
      req.event = event;
      next();
    });
};

exports.getEvent = (req, res) => {
  req.event.image = undefined;
  return res.json(req.event);
};

exports.getAllEvents = async (req, res) => {
  try {
    let today = new Date();
    // console.log(today);

    const upcomingEvent = await Event.find({
      "date.endDate": { $gte: today.toDateString() },
    }).sort({ date: -1 });
    const pastEvent = await Event.find({
      "date.endDate": { $lt: today.toDateString() },
    }).sort({ date: -1 });
    // console.log(upcomingEvent);
    res.json({
      upcomingEvent,
      pastEvent,
    });
  } catch (error) {
    res.json({
      error: "Err while fetching events!",
    });
  }
};

// exports.getAllLatestEvents = (req, res) => {
//   Event.find({ category: "60e01bcf7a8c310358a13af3" })
//     .sort({ date: 1 })
//     .exec((err, events) => {
//       if (err || !events) {
//         return res.status(400).json({
//           error: "No Events found in DB",
//         });
//       }
//       // console.log(events.length);
//       res.json(events);
//     });
// };

// exports.getAllPastEvents = (req, res) => {
//   Event.find({ category: "60e01bd87a8c310358a13af4" })
//     .sort({ date: 1 })
//     .exec((err, events) => {
//       if (err || !events) {
//         return res.status(400).json({
//           error: "No Events found in DB",
//         });
//       }
//       // console.log(events.length);
//       res.json(events);
//     });
// };

exports.createEvent = (req, res) => {
  console.log(req.body);
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    console.log(fields);

    //destructure the fields
    const {
      name,
      info,
      linkedinURL,
      instagramURL,
      startDate,
      endDate,
    } = fields;

    // console.log(name, info, linkedinURL, instagramURL, category);

    if (
      (!name || !info || !linkedinURL || !instagramURL || !startDate, !endDate)
    ) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }
    let obj = {
      name,
      info,
      linkedinURL,
      instagramURL,
      date: {
        startDate,
        endDate,
      },
    };
    console.log(obj);
    let event = new Event(obj);

    //handle file here
    if (file.image) {
      console.log(file.image.type == "image/jpeg");
      console.log(file.image.type);
      const jpg = "image/jpg";
      const jpeg = "image/jpeg";
      const png = "image/png";
      // console.log(
      //   file.image.type !== "image/jpg" || "image/jpeg" || "image/png"
      // );
      // if (file.image.type != ("image/jpeg" || "image/png")) {
      //   return res.status(422).json({
      //     error: "File type should be jpg or png!",
      //   });
      // }

      if (file.image.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }

      event.image.data = fs.readFileSync(file.image.path);
      event.image.contentType = file.image.type;
    }

    console.log(event);

    // console.log(product);

    //save to the DB
    event.save((err, event) => {
      if (err) {
        res.status(400).json({
          error: "Saving Event in DB failed",
        });
      }
      res.json(event);
    });
  });
};

exports.updateEvent = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    let event = req.event;
    console.log(event);
    event - _.extend(event, fields);

    if (file.image) {
      // console.log(typeof file.image.type);
      // if (file.image.type === ("image/jpeg" || "image/png")) {
      //   return res.status(422).json({
      //     error: "File type should be jpg or png!",
      //   });
      // }

      if (file.image.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      event.image.data = fs.readFileSync(file.image.path);
      event.image.contentType = file.image.type;
    }
    // console.log(event);

    //save to the DB
    event.save((err, event) => {
      if (err) {
        res.status(400).json({
          error: "Updation of Event in DB failed",
        });
      }
      res.json(event);
    });
  });
};

exports.removeEvent = (req, res) => {
  const event = req.event;

  event.remove((err, event) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete Event",
      });
    }
    res.json({
      message: "Successfull deleted!",
    });
  });
};

//middleware
exports.image = (req, res, next) => {
  if (req.event.image.data) {
    res.set("Content-Type", req.event.image.contentType);
    return res.send(req.event.image.data);
  }
  next();
};
