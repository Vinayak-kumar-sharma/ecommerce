import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userschema = new mongoose.Schema({
  username:{type:String,required:true},
  password:{type:String,required:[true,"Password is required"],minlength:[6,"Password must have more than 6 charaters long."]},
  email:{type:String, unique:true, required:[true,"Email is required"],lowercase:true,trim:true},
  cartItem:[{
    quantity:{type:Number,default:[]},
    product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
  }],
  role:[{
    type:String,
    enum: ["customer","admin"],
    default:"customer"
  }]
},{timestamps:true})


// Pree_save hook 
userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(this.password, salt);
    this.password = hashpass;  
    next();
  } catch (error) {
    next(error);
  }
});

userschema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model('User',userschema)

export default User