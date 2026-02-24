import fs from 'fs';
import imagekit from '../config/imageKit.js';
import Blog from '../models/Blog.js';
import  Comment from '../models/comment.js';
import main from '../config/Groq.js';


export const addBlog=async(req,res)=>{
    try{
        const {title,subTitle,description,category,isPublished}=JSON.parse(req.body.blog);
        const imageFile=req.file;
        //check if all fields are pressent 
        if(!title || !description || !category || !imageFile){
            return res.json({success:false,message:"Missing required fields"})
        }

        const fileBuffer =fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:"/blogs"
        })

        //optimize the through tjhe image url 
        const optimizedImageUrl=imagekit.url({
            path:response.filePath,
            transformation:[
                {quality:'auto'},
                {format:'webp'},
                {width:'1280'}
            ]
        });

        const image =optimizedImageUrl;
        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image,
            isPublished
        })

        res.json({success:true,message:"Blog added Succressfully"})
    }catch(Error){
        res.json({success:false,message:"Error adding blog"})
    }
}



export const getAllBlogs=async(req,res)=>{
    try{
        const blogs=await Blog.find({isPublished:true})
        res.json({success:true,blogs})
    }catch(error){
        res.json({success:false,message:error})
    }
}

export const getBlogById=async(req,res)=>{
    try{
        const {blogId} = req.params;
        const blog =await Blog.findById(blogId)
        if(!blog){
            return res.json({success:false,message:"Blog not found"})
        }
        res.json({success:true,blog})
    }catch(error){
        res.json({success:false,message:error})
    }
}

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    await Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);

    blog.isPublished = !blog.isPublished;

    await blog.save();

    res.json({
      success: true,
      message: "Blog status updated"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


export const addcomment=async(req,res)=>{
  try{
    const {blog,name,content}=req.body;
    await Comment.create({blog,name,content});
    res.json({success:true,message:"Comment added  for review "})
  }catch(error){
    res.json({success:false,message:error.message})
  }
}


export const getBlogComments=async(req,res)=>{
  try{
    const{blogId}=req.body;
    const comments=await Comment.find({blog:blogId,isApproved:true}).sort({createdAt:-1});
    res.json({success:true,message:"Comment added for Review"})
  }catch(error){
    res.json({success:false,message:error.message})
  }
}

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await main(
      prompt + " Generate a blog content for this topic in simple text format"
    );

    // 🔥 Extract text from Groq response
    const content = result?.choices?.[0]?.message?.content || "";

    res.json({ success: true, content });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

