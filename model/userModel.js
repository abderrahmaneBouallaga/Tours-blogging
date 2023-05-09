const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name!']
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Please provide your email'],
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        photo: String,
        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guid', 'admin'],
            default: 'user'
        },
        password:{
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm password'],
            validate: {
                validator: function(e){
                    return e === this.password
                },
                message: 'Your confirm password is not correct'
            }
        },
        passwordChangedAt: {
            type: Date
        }
    }
)

userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        
        return JWTTimestamp < changedTimestamp
    }

    return false;
}

const User = mongoose.model('User', userSchema)


module.exports = User;