const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const saltRounds = 10;

const SessionSchema = new Schema({
    connections: [{
        identity: {
            type: Schema.Types.ObjectId,
        },
        _id: false,
    }],
    code: {
        type: String,
        required: true,
        default: () => Math.random().toString().slice(5,11) 
    },
});


// AccountSchema.pre('save', function (next) {
//     var user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//         if (err) return next(err);

//         // hash the password along with our new salt
//         bcrypt.hash(user.password, salt, function (err, hash) {
//             if (err) return next(err);

//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });

// AccountSchema.methods.comparePassword = function (candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;

