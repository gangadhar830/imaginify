import { model, models, Schema } from "mongoose";
export interface IImage {
  title: string;
  transformationType: string;
  publicID: string;
  secureUrl:string;
  width?: number;
  height?: number;
  transformationUrl?: string;
  aspectRation?: string;
  color?: string;
  prompt?: string;
  author?: {
    _id:String;
    firstName:String;
    lastName:String;
  }
  createAt?: Date;
  updateAt?: Date;
}
const ImageSchema =new Schema({
  title:{type:String,required:true},  
  transformationType:{type:String,required:true},  
  publicID:{type:String,required:true},  
  secureUrl:{type:URL,required:true},  
  width:{type:Number},
  height:{type:Number},
  transformationUrl:{type:URL},
  aspectRation:{type:String},
  color:{type:String},
  prompt:{type:String},
  author:{type:Schema.Types.ObjectId,ref:'User'},
  createAt:{type:Date,default:Date.now},
  updateAt:{type:Date,default:Date.now}
});
const Image=models?.Image||model('Image',ImageSchema);
export default Image;